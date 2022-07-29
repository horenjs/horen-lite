import { Injectable } from "../decorators";
import {readFileAsync, walksAsync, writeFileAsync} from "../utils/fs-promises";
import {AudioMeta} from "../handlers/audio.handler";
import * as mm from "music-metadata";
import path from "path";
import {Netease} from "../apis";
import {arrayBufferToBase64} from "../utils";
import crypto from "crypto";
import {
  ALBUM_COVER_PATH,
  AUDIO_EXTS,
  LOGS_PATH,
  MUSIC_LIBRARY_PATH
} from "@constant";
import * as fse from "fs-extra";
import axios from "axios";
import Logger from "../utils/logger";
import Dato from "../utils/dato";

const log = new Logger("audio-service", {
  filePath: path.join(LOGS_PATH, `${Dato.now("YYYY-MM-DD")}.log`),
});

@Injectable("AudioService")
export class AudioService {
  constructor() {
    // do nothing
    // don't delete this.
  }

  /**
   * read audio meta
   * @param filepath audio file path
   * @param items meta item to be included
   */
  public async readMusicFileMeta(
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

  /**
   * filter the audio from origin files
   * @param originFileList origin file list
   */
  public filterAudioFile(originFileList: string[]) {
    const tmp = [];
    for (const m of originFileList) {
      const extname = path.extname(m).replace(".", "");
      if (AUDIO_EXTS.includes(extname)) tmp.push({ src: m });
    }
    return tmp;
  }

  /**
   * get audio list from library file.
   * @param p library path
   * @param flag short or full
   */
  public async getAudioFileListFromLibraryFile(
    p: string,
    flag: "short" | "full"
  ) {
    let libraryFilePath: string;
    switch (flag) {
    case "short":
      libraryFilePath = this.generateLibraryFilePath(p);
      break;
    case "full":
      libraryFilePath = this.generateLibraryFilePath(p, "-full");
      break;
    }
    try {
      const jsonStr = await readFileAsync(libraryFilePath);
      return JSON.parse(jsonStr);
    } catch (err) {
      return [];
    }
  }

  /**
   * read file list
   * @param p
   */
  public async readFileList(p: string) {
    const tmp = [];
    try {
      return await walksAsync(path.resolve(p), tmp);
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  /**
   * generate library file path from library path.
   * @param p library path
   * @param flag short or full
   */
  public generateLibraryFilePath(p: string, flag = "") {
    const hash = crypto.createHash("md5");
    hash.update(p);

    fse.ensureDir(MUSIC_LIBRARY_PATH).then();

    return path.join(MUSIC_LIBRARY_PATH, `${hash.digest("hex")}${flag}.json`);
  }
}
