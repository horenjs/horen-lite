import path from "path";
import fs from "fs";
import * as fse from "fs-extra";
import { AUDIO_EXTS, APP_DATA_PATH } from "@constant";
import crypto from "crypto";
import pack from "../../../package.json";
import * as mm from "music-metadata";
import { Netease } from "../apis";
import axios from "axios";
import { HandlerResponse } from "./index";
import {
  walksAsync,
  readFileAsync,
  writeFileAsync,
} from "../utils/fs-promises";
import { arrayBufferToBase64 } from "../utils";
import Logger from "../utils/logger";
import Dato from "../utils/dato";

const log = new Logger("audio-handlers", {
  filePath: path.join(APP_DATA_PATH, "logs", `${Dato.now("YYYY-MM-DD")}.log`),
});

type AudioMeta = Partial<{
  src: string;
  title: string;
  artist: string;
  artists: string | string[];
  album: string;
  genre: string | string[];
  date: string;
  duration: number;
  picture: string;
  lyric: string;
}>;

export type Favorites = {
  updateAt: string | number;
  lists: Array<
    AudioMeta & {
      addAt: string | number;
    }
  >;
};

const USER_DATA_PATH = path.join(APP_DATA_PATH, "UserData");

async function handleGetAudioFileMeta(
  evt,
  src: string,
  items?: string[]
): Promise<HandlerResponse<AudioMeta>> {
  let meta: AudioMeta;
  if (items) {
    log.debug("try to get audio meta, src: ", src, ", items: ", ...items);
    meta = await readMusicFileMeta(src, items);
  } else {
    log.debug("try to get audio meta, src: ", src);
    meta = await readMusicFileMeta(src);
  }
  return { code: 1, msg: "success", data: meta };
}

async function handleGetAudioFileList(evt, p: string) {
  log.debug("try to get audio file list from full library file: ", p);
  const audioFileListFull = await getAudioFileListFromLibraryFile(p, "full");

  if (audioFileListFull.length > 0) {
    log.debug("get file list from the full library file success, length: ", audioFileListFull.length);
    return {
      code: 1,
      msg: "success",
      data: { lists: audioFileListFull },
    };
  } else {
    log.debug("get file list from the full library file failed.");
    log.debug("try to get audio list from the short library file.");
    const audioFileListShort = await getAudioFileListFromLibraryFile(
      p,
      "short"
    );
    if (audioFileListShort.length > 0) {
      log.debug("get file list from the short library file success, length: ", audioFileListShort.length);
      return {
        code: 1,
        msg: "success",
        data: { lists: audioFileListShort },
      };
    }
  }
  // if library file doesn't exist, rebuild it.
  log.debug("library file doesn't exist, rebuild it.");
  const originFileList = await getOriginFileList(p);

  if (originFileList.length === 0) {
    log.debug("rebuild from the path: ", p, " failed.");
    return {
      code: 0,
      msg: "failed",
      err: "target path is empty: " + p,
    };
  }

  log.debug("filter the audio file from origin file list.");
  const lists = filterAudioFile(originFileList);
  // save to the library file.
  try {
    log.debug("try to save the audio file list to the file.");
    await writeFileAsync(generateLibraryFilePath(p), JSON.stringify(lists, null, 2));
  } catch (err) {
    log.error("save the library file failed.");
    log.error(err);
  }

  return {
    code: 1,
    msg: "success",
    data: { lists },
  };
}

async function handleGetFavorites(): Promise<HandlerResponse<Favorites>> {
  const favoritesFilePath = path.join(USER_DATA_PATH, "favorites.json");
  try {
    log.debug("ensure the favorite dir: ", favoritesFilePath);
    await fse.ensureDir(USER_DATA_PATH);
  } catch (err) {
    log.error("cannot make path: ", USER_DATA_PATH);
  }
  try {
    log.debug("try to get the favorites from existed file.");
    const jsonStr = await fse.readJSON(favoritesFilePath, {
      encoding: "utf-8",
    });
    return { code: 1, msg: "success", data: jsonStr };
  } catch (err) {
    log.error("get the favorites from file failed.");
    return { code: 0, msg: "get favorites failed", err: err };
  }
}

async function handleAddFavorite(
  evt,
  src: string
): Promise<HandlerResponse<any>> {
  const favoritesFilePath = path.join(USER_DATA_PATH, "favorites.json");
  let data: Favorites;
  try {
    log.debug("try to get the favorites from existed file: ", favoritesFilePath);
    data = await fse.readJSON(favoritesFilePath, { encoding: "utf-8" });
  } catch (err) {
    log.debug("there is no favorites file, create it.");
    data = {
      updateAt: new Date().valueOf(),
      lists: [],
    };
    log.debug("try to write new favorites to the file.");
    await fse.writeJSON(favoritesFilePath, data, {
      encoding: "utf-8",
      spaces: 2,
    });
  }

  const meta = await readMusicFileMeta(src, ["title", "src", "artist"]);
  const favorite = { ...meta, addAt: new Date().valueOf() };
  data.lists.push(favorite);
  log.debug("try to write the favorites to the file.");
  try {
    await fse.writeJSON(favoritesFilePath, data, {
      encoding: "utf-8",
      spaces: 2,
    });
    log.info("add favorite success: ", src);
    return { code: 1, msg: "add favorite success", data: data };
  } catch (err) {
    log.error("add favorite failed.");
    return { code: 0, msg: "add favorite failed" };
  }
}

async function handleRemoveFavorite(
  evt,
  src: string
): Promise<HandlerResponse<any>> {
  log.warning("try to remove the favorite item: ", src);
  const favoritesFilePath = path.join(USER_DATA_PATH, "favorites.json");
  let data: Favorites;
  try {
    data = await fse.readJSON(favoritesFilePath, { encoding: "utf-8" });
  } catch (err) {
    log.warning("there is no favorites file, create it.");
    return { code: 0, msg: "no favorites" };
  }

  for (let i = 0; i < data.lists.length; i++) {
    const item = data.lists[i];
    if (item?.src === src) {
      data.lists.splice(i, 1);
    }
  }

  data.updateAt = new Date().valueOf();

  try {
    await fse.writeJSON(favoritesFilePath, data, {
      encoding: "utf-8",
      spaces: 2,
    });
    return { code: 1, msg: "remove success", data: data };
  } catch (err) {
    return { code: 0, msg: "remove failed" };
  }
}

// tools function

function filterAudioFile(originFileList: string[]) {
  const tmp = [];
  for (const m of originFileList) {
    const extname = path.extname(m).replace(".", "");
    if (AUDIO_EXTS.includes(extname)) tmp.push({ src: m });
  }
  return tmp;
}

async function getAudioFileListFromLibraryFile(
  p: string,
  flag: "short" | "full"
) {
  let libraryFilePath: string;
  switch (flag) {
  case "short":
    libraryFilePath = generateLibraryFilePath(p);
    break;
  case "full":
    libraryFilePath = generateLibraryFilePath(p, "-full");
    break;
  }
  try {
    const jsonStr = await readFileAsync(libraryFilePath);
    return JSON.parse(jsonStr);
  } catch (err) {
    return [];
  }
}

async function getOriginFileList(p: string) {
  const tmp = [];
  try {
    return await walksAsync(path.resolve(p), tmp);
  } catch (err) {
    console.error(err);
    return [];
  }
}

function generateLibraryFilePath(p: string, flag = "") {
  const hash = crypto.createHash("md5");
  hash.update(p);

  const appPath = path.join(process.env.APPDATA, pack.name);
  const musicLibraryPath = path.join(appPath, "MusicLibrary");

  if (!fs.existsSync(musicLibraryPath)) {
    fs.mkdirSync(musicLibraryPath);
  }

  return path.join(musicLibraryPath, `${hash.digest("hex")}${flag}.json`);
}

async function readMusicFileMeta(
  filepath: string,
  items = [
    "title",
    "artist",
    "artists",
    "album",
    "genre",
    "date",
    "duration",
    "picture",
    "lyric",
  ]
): Promise<AudioMeta> {
  let meta;
  log.info("try to get the audio meta.");

  try {
    meta = await mm.parseFile(filepath);
  } catch (err) {
    meta = null;
  }

  const { title, artist, artists, album, genre, date, picture } =
    meta?.common || {};

  const extname = path.extname(filepath);
  const finalTitle = title || path.basename(filepath, extname);

  const { duration } = meta?.format || {};

  let lyric: string;
  if (items.includes("lyric")) {
    log.debug("include lyric, try to get it.");
    const lrcPath = filepath.replace(extname, ".lrc");
    try {
      lyric = await readFileAsync(lrcPath);
    } catch (err) {
      log.warning("there is no local lrc file, try to get from internet.");

      const neteaseApi = new Netease(title, artist, album);
      try {
        lyric = await neteaseApi.getLyric();
        log.info("get the lyric from internet success, save it to file.");
        if (lyric) await writeFileAsync(lrcPath, lyric);
      } catch (err) {
        log.error("get the lyric from internet failed.");
        lyric = String(err);
      }
    }
  }

  let finalPic: string;
  if (items.includes("picture")) {
    log.debug("include picture, try to get it.");
    if (picture) {
      const data = picture[0]?.data;
      finalPic = arrayBufferToBase64(data);
    } else {
      const hash = crypto.createHash("md5");
      hash.update(artist + album);
      const picDir = path.join(process.env.APPDATA, pack.name, "AlbumCover");
      const picPath = path.join(picDir, `${hash.digest("hex")}.png`);

      if (!fs.existsSync(picDir)) {
        fs.mkdirSync(picDir);
      }

      if (fs.existsSync(picPath)) {
        finalPic = "file:///" + picPath.replace(/\\/g, "/");
      } else {
        const neteaseApi = new Netease(title, artist, album);
        const picUrl = await neteaseApi.getAlbumPic();
        finalPic = picUrl;

        if (picUrl) {
          const resp = await axios.get(picUrl, { responseType: "arraybuffer" });
          if (resp.data) {
            await writeFileAsync(picPath, resp.data);
          }
        }
      }
    }
  }

  return {
    src: filepath,
    title: items.includes("title") ? finalTitle : null,
    artist: items.includes("artist") ? artist : null,
    artists: items.includes("artists") ? artists : null,
    album: items.includes("album") ? album : null,
    genre: items.includes("genre") ? genre : null,
    date: items.includes("date") ? date : null,
    duration: items.includes("duration") ? duration : null,
    picture: items.includes("lyric") ? finalPic : null,
    lyric: items.includes("lyric") ? lyric : null,
  };
}

export type { AudioMeta };

export {
  handleGetAudioFileList,
  handleGetAudioFileMeta,
  readMusicFileMeta,
  generateLibraryFilePath,
  handleGetFavorites,
  handleAddFavorite,
  handleRemoveFavorite,
};
