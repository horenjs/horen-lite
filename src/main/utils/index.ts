import fs from "fs";
import path from "path";
import crypto from "crypto";
import * as mm from "music-metadata";
import { arrayBufferToBase64 } from "./array-buf";
import { Netease } from "../apis";
import axios from "axios";
import pack from "../../../package.json";

export function arrayBufferToBuffer(ab: ArrayBuffer) {
  const buf = new Buffer(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) buf[i] = view[i];
  return buf;
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
) {
  let meta;

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

  let lyric;


  if (items.includes("lyric")) {
    const lrcPath = filepath.replace(extname, ".lrc");
    try {
      lyric = await readFile(lrcPath);
    } catch (err) {
      console.log("there is no local lrc file.");

      const neteaseApi = new Netease(title, artist, album);
      try {
        lyric = await neteaseApi.getLyric();
        if (lyric) await writeFile(lrcPath, lyric);
      } catch (err) {
        lyric = String(err);
      }
    }
  }



  let finalPic;
  if (items.includes("picture")) {
    if (picture) {
      const data = picture[0]?.data;
      finalPic = arrayBufferToBase64(data);
    } else {
      const hash = crypto.createHash("md5");
      hash.update(artist+album);
      const picDir = path.join(process.env.APPDATA, pack.name, "AlbumCover");
      const picPath = path.join(picDir, `${hash.digest("hex")}.png`);

      if (!fs.existsSync(picDir)) {
        fs.mkdirSync(picDir);
      }

      if (fs.existsSync(picPath)) {
        finalPic = "file:///" + picPath;
      } else {
        const neteaseApi = new Netease(title, artist, album);
        const picUrl = await neteaseApi.getAlbumPic();
        finalPic = picUrl;

        if (picUrl) {
          const resp = await axios.get(picUrl, {responseType: "arraybuffer"});
          if (resp.data) {
            await writeFile(picPath, resp.data);
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

export async function readFile(p: string, type="string"): Promise<string> {
  return new Promise((rev, rej) => {
    const encoding = type === "string" ? "utf-8" : null;
    fs.readFile(p, { encoding: encoding }, (err, data) => {
      if (err) rej(err);
      else rev(data);
    });
  });
}

export async function writeFile(p: string, data: any): Promise<string> {
  return new Promise((rev, rej) => {
    const opts: fs.WriteFileOptions = {};
    if (typeof data === "string") {
      opts.encoding = "utf-8";
    }
    fs.writeFile(p, data, opts, (err) => {
      if (err) rej(err);
      else rev("success");
    });
  });
}
/**
 * 获取给定文件夹下的所有文件
 * @param p 文件夹地址
 * @param fileList 用于临时存储的数组
 * @returns 包含给定文件夹下所有文件的数组
 */
export async function readDir(
  p: string,
  fileList: string[] = []
): Promise<string[]> {
  const files = await readdir(p);

  for (const f of files) {
    const filepath = path.join(p, f);
    const stats = await stat(filepath);
    if (stats.isFile()) fileList.push(filepath);
    if (stats.isDirectory()) await readDir(filepath, fileList);
  }
  return fileList;
}

/**
 * 获取给定文件夹的所有文件（不区分文件夹与文件）
 * @param p 文件夹地址
 * @returns 给定文件夹下的文件列表
 */
export function readdir(p: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(p, null, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}

/**
 * 获取文件信息*
 * @param p 文件地址
 * @returns fs.Stats
 */
export async function stat(p: string): Promise<fs.Stats> {
  return new Promise((resolve, reject) => {
    fs.stat(p, (err, stats) => {
      if (err) reject(err);
      else resolve(stats);
    });
  });
}
