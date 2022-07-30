import { Injectable } from "../decorators";
import {walksAsync} from "../utils/fs-promises";
import {AudioMeta} from "../handlers/audio.handler";
import * as mm from "music-metadata";
import path from "path";
import {Netease} from "../apis";
import {arrayBufferToBase64} from "../utils";
import crypto from "crypto";
import {
  ALBUM_COVER_PATH,
  AUDIO_EXTS,
  MUSIC_LIBRARY_PATH
} from "@constant";
import * as fse from "fs-extra";
import axios from "axios";
import Logger from "../utils/logger";
import {Track} from "@plugins/player";

const log = new Logger("service::audio");

@Injectable("AudioService")
export class AudioService {
  private encoding = "utf-8";

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
    const { duration } = meta?.format || {};

    const extname = path.extname(filepath);
    const finalTitle = title || path.basename(filepath, extname);

    let lyric = "";
    if (items.includes("lyric")) {
      lyric = await this.getLyric(filepath, title, artist, album);
    }

    let finalPic: string;
    if (items.includes("picture")) {
      log.debug("include picture, try to get it.");
      finalPic = await AudioService.getPicture(picture, title, artist, album);
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
  public async parseLibraryFile(p: string, flag: "short" | "full") :Promise<Track[]> {
    let libraryPath: string;
    switch (flag) {
    case "short":
      libraryPath = this.getLibraryFilePath(p);
      break;
    case "full":
      libraryPath = this.getLibraryFilePath(p, "-full");
      break;
    }
    try {
      return await fse.readJSON(libraryPath, { encoding: this.encoding });
    } catch (err) {
      log.error("can't parse library file.");
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
      log.error("can't walks the path: ", p);
    }
  }

  /**
   * generate library file path from library path.
   * @param p library path
   * @param flag short or full
   */
  public getLibraryFilePath(p: string, flag = "") {
    const hash = crypto.createHash("md5");
    hash.update(p);
    return path.join(MUSIC_LIBRARY_PATH, `${hash.digest("hex")}${flag}.json`);
  }

  /**
   * get lyric from built-in or internet
   * @param src audio path
   * @param title audio title
   * @param artist audio artist
   * @param album audio album
   * @private
   */
  private async getLyric(src, title, artist, album) {
    let lyric;
    const extname = path.extname(src);
    const lrcPath = src.replace(extname, ".lrc");
    try {
      return await fse.readFile(lrcPath, {encoding: this.encoding});
    } catch (err) {
      log.warning("there is no local lrc file");
    }

    try {
      const neteaseApi = new Netease(title, artist, album);
      lyric = await neteaseApi.getLyric();
      if (lyric) await fse.writeFile(lrcPath, lyric);
      return lyric;
    } catch (err) {
      log.error("get the lyric from internet failed.");
    }
  }

  private static async getPicture(builtInPicture: any, title, artist, album) {
    if (builtInPicture) {
      const data = builtInPicture[0]?.data;
      return arrayBufferToBase64(data);
    } else {
      const hash = crypto.createHash("md5");
      hash.update(artist + album);
      const albumPath = path.join(
        ALBUM_COVER_PATH,
        `${hash.digest("hex")}.png`
      );

      if (fse.existsSync(albumPath)) {
        return "file:///" + albumPath.replace(/\\/g, "/");
      } else {
        const neteaseApi = new Netease(title, artist, album);
        const picUrl = await neteaseApi.getAlbumPic();
        await AudioService.saveAlbumCover(picUrl, albumPath);
        return picUrl;
      }
    }
  }

  private static async saveAlbumCover(url: string, coverPath: string) {
    const resp = await axios.get(url, { responseType: "arraybuffer" });
    if (resp.data) {
      await fse.writeFile(coverPath, resp.data);
    }
  }
}
