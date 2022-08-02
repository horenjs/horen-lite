import { Op } from "sequelize";
import { Injectable } from "../decorators";
import {walksAsync} from "../utils/fs-promises";
import {AudioMeta} from "../handlers/audio.handler";
import * as mm from "music-metadata";
import path from "path";
import {Netease} from "../apis";
import crypto from "crypto";
import {
  ALBUM_COVER_PATH,
  AUDIO_EXTS, EVENTS,
} from "@constant";
import * as fse from "fs-extra";
import axios from "axios";
import Logger from "../utils/logger";
import {Track} from "@plugins/player";
import {mainWindow} from "../index";
import {AudioModel} from "../db/models";

export type PureTrack = Pick<Track, "src">;

const log = new Logger("service::audio");

@Injectable("AudioService")
export class AudioService {
  private encoding = "utf-8";

  constructor() {
    // do nothing
    // don't delete this.
  }

  public async getAudios(
    libraries: string[],
    opts = {
      limit: 99999,
      offset: 0,
    }
  ) {
    const { limit, offset } = opts;
    let tmp = [];

    log.info("libraries: ", libraries);

    for (const lib of libraries) {
      const results = await AudioModel.findAll({
        where: { dir: { [Op.startsWith]: lib } },
      });

      if (results) {
        const list = results.map((r) => {
          console.log(r.toJSON());
          return r.get();
        });
        tmp = [...tmp, ...list];
      }
    }
    return tmp.slice(offset, limit);
  }

  /**
   * get queue from table Audios
   * @param sources list of audio src
   * @param opts limit: default is 99999, offset: default is 0
   */
  public async getQueue(
    sources: string[],
    opts = { limit: 99999, offset: 0 }
  ) {
    const { limit, offset } = opts;
    const intactQueue = [];
    for (const src of sources) {
      const result = await AudioModel.findOne({where:{ src }});
      intactQueue.push(result.get());
    }
    return intactQueue.slice(offset, limit);
  }

  public async rebuild(paths: string[]) {
    // avoid the memory leak, set the limit to 100
    let files: string[] = [];

    log.debug("read files from paths");
    for (const p of paths) {
      const tmp = [];
      const originFiles = await walksAsync(path.resolve(p), tmp);
      files = [...files, ...originFiles];
    }

    log.debug("filter audio file");
    const audios = AudioService.filterAudioFile(files);

    const totals = audios.length;

    log.debug("save audio meta to db");
    for (let i = 0; i < audios.length; i++) {
      const metas = await this.readMetas(audios.slice(i, i+1), totals, i);
      const src = metas[0].src;

      const result = await AudioModel.findOne({where:{src}});
      if (result) await AudioModel.update(metas[0], {where:{src}});
      else await AudioModel.create(metas[0]);
    }
  }

  /**
   * filter the audio from origin files
   * @param originFiles
   */
  private static filterAudioFile(originFiles: string[]) {
    const tmp = [];
    for (const src of originFiles) {
      const extname = path.extname(src).replace(".", "");
      if (AUDIO_EXTS.includes(extname)) tmp.push({ src });
    }
    return tmp;
  }

  /**
   * read audio meta
   * @param src
   */
  public async readMeta(src: string): Promise<AudioMeta> {
    let meta;

    try {
      meta = await mm.parseFile(src);
    } catch (err) {
      log.error(err);
      meta = null;
    }

    const { title, artist, artists, album, genre, date, picture } =
      meta?.common || {};
    const { duration } = meta?.format || {};

    const extname = path.extname(src);
    const dirname = path.dirname(src);

    const lyric = await this.getLyric(src, title, artist, album);
    let pic = "";
    if (picture) {
      pic = await AudioService.getPicture(
        title,
        artist,
        album,
        picture[0]?.data
      );
    }

    return {
      dir: dirname,
      src,
      title: title ? title : path.basename(src, extname) || null,
      artist,
      artists: JSON.stringify(artists),
      album,
      genre: JSON.stringify(genre),
      date,
      duration: duration === Infinity ? 0 : duration,
      picture: pic,
      lyric,
    };
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
      return await fse.readFile(lrcPath, { encoding: this.encoding });
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

  private static async getPicture(title, artist, album, picBuffer?) {
    const hash = crypto.createHash("md5");
    hash.update(artist + album);

    const coverFileName = `${hash.digest("hex")}.png`;
    const coverFilePath = path.join(ALBUM_COVER_PATH, coverFileName);
    const finalFilePath = "file:///" + coverFilePath.replace(/\\/g, "/");

    if (fse.existsSync(coverFilePath)) return finalFilePath;

    if (picBuffer) {
      await AudioService.saveAlbumCover(picBuffer, coverFilePath);
      return finalFilePath;
    }

    const neteaseApi = new Netease(title, artist, album);
    const picUrl = await neteaseApi.getAlbumPic();
    await AudioService.saveAlbumCover(picUrl, coverFilePath);
    return finalFilePath;
  }

  private static async saveAlbumCover(
    urlOrBuf: string | Buffer,
    coverPath: string
  ) {
    let data;
    if (typeof urlOrBuf === "string") {
      const resp = await axios.get(urlOrBuf, { responseType: "arraybuffer" });
      data = resp?.data;
    } else {
      data = urlOrBuf;
    }

    try {
      if (data) await fse.writeFile(coverPath, data);
    } catch (err) {
      log.error(err);
    }
  }

  private async readMetas(
    pureAudios: PureTrack[],
    totals: number,
    current: number
  ): Promise<AudioMeta[]> {
    const metas = [];
    for (let i = 0; i < pureAudios.length; i++) {
      const src = pureAudios[i].src;
      const basename = path.basename(src);
      log.debug(`read meta: ${src}, ${current + i} / ${totals}`);

      const msg = [current + i, totals, basename];

      mainWindow.webContents.send(
        EVENTS.REBUILD_AUDIO_CACHE_MSG.toString(),
        msg
      );

      const meta = await this.readMeta(src);
      metas.push(meta);
    }
    return metas;
  }
}
