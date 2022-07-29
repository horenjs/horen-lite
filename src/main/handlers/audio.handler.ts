import path from "path";
import crypto from "crypto";
import * as fse from "fs-extra";
import * as mm from "music-metadata";
import axios from "axios";
import {HandlerResponse} from "./index";
import {readFileAsync, walksAsync, writeFileAsync,} from "../utils/fs-promises";
import {arrayBufferToBase64} from "../utils";
import Logger from "../utils/logger";
import Dato from "../utils/dato";
import {Netease} from "../apis";
import {
  ALBUM_COVER_PATH,
  AUDIO_EXTS,
  EVENTS,
  LOGS_PATH,
  MUSIC_LIBRARY_PATH,
} from "@constant";
import {Handler, IpcInvoke} from "../decorators";
import {Track} from "@plugins/player";
import {mainWindow} from "../index";

const log = new Logger("audio-handlers", {
  filePath: path.join(LOGS_PATH, `${Dato.now("YYYY-MM-DD")}.log`),
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

export type Favorite = AudioMeta & { addAt: string | number; }

export type Favorites = {
  updateAt: string | number;
  lists: Favorite[];
};

@Handler()
export class AudioHandler {
  constructor() {
    // do nothing;
  }

  @IpcInvoke(EVENTS.GET_AUDIO_META)
  public async handleGetAudioMeta(
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

  @IpcInvoke(EVENTS.GET_AUDIO_LIST)
  public async handleGetAudioList(evt, p: string) {
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

  @IpcInvoke(EVENTS.SAVE_AUDIO_LIST)
  public async handleSaveAudioList(evt, p: string, lists: { src: string }[]) {
    const readAllMeta = async (fileLists: Track[]) => {
      const metas = [];
      for (let i = 0; i < fileLists.length; i++) {
        mainWindow.webContents.send(
          EVENTS.SAVE_AUDIO_LIST_REPLY_MSG.toString(),
          i,
          fileLists.length,
          path.basename(fileLists[i].src)
        );
        const meta = await readMusicFileMeta(fileLists[i].src, [
          "title",
          "artist",
          "artists",
          "album",
          "genre",
          "date",
          "duration",
          // "picture",
          "lyric",
        ]);
        metas.push(meta);
      }
      return metas;
    }

    const filepath = generateLibraryFilePath(p, "-full");
    log.info("to read full music library: ", filepath);

    try {
      const stat = await fse.stat(filepath);
      if (stat.isFile()) {
        log.warning("full music library exists.");
        return { code: 1, msg: "full music library exists." };
      }
    } catch (err) {
      log.error("read the full music library path failed.");
    }

    log.info("to get all metas.");
    const metas = await readAllMeta(lists);

    try {
      await fse.writeJSON(filepath, metas, {encoding:"utf-8", spaces: 2});
      log.info("save the full library success: ", filepath);
      return { code: 1, msg: "success" };
    } catch (err) {
      log.error("save the full library failed");
      return { code: 0, msg: "save the full library failed" };
    }
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

export function generateLibraryFilePath(p: string, flag = "") {
  const hash = crypto.createHash("md5");
  hash.update(p);

  fse.ensureDir(MUSIC_LIBRARY_PATH).then();

  return path.join(MUSIC_LIBRARY_PATH, `${hash.digest("hex")}${flag}.json`);
}

export async function readMusicFileMeta(
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

  log.info("to get the audio meta: ", filepath);
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
      const picPath = path.join(ALBUM_COVER_PATH, `${hash.digest("hex")}.png`);

      fse.ensureDir(ALBUM_COVER_PATH).then();

      if (fse.existsSync(picPath)) {
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
