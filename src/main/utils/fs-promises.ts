import fs from "fs";
import path from "path";

async function readFileAsync(p: string, type = "string"): Promise<string> {
  return new Promise((rev, rej) => {
    const encoding = type === "string" ? "utf-8" : null;
    fs.readFile(p, {encoding: encoding}, (err, data) => {
      if (err) rej(err);
      else rev(data);
    });
  });
}

/* eslint-disable */
async function writeFileAsync(p: string, data: any): Promise<string> {
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
async function walksAsync(
  p: string,
  fileList: string[] = []
): Promise<string[]> {
  const files = await readdirAsync(p);

  for (const f of files) {
    const filepath = path.join(p, f);
    const stats = await statAsync(filepath);
    if (stats.isFile()) fileList.push(filepath);
    if (stats.isDirectory()) await walksAsync(filepath, fileList);
  }
  return fileList;
}

/**
 * 获取给定文件夹的所有文件（不区分文件夹与文件）
 * @param p 文件夹地址
 * @returns 给定文件夹下的文件列表
 */
function readdirAsync(p: string): Promise<string[]> {
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
async function statAsync(p: string): Promise<fs.Stats> {
  return new Promise((resolve, reject) => {
    fs.stat(p, (err, stats) => {
      if (err) reject(err);
      else resolve(stats);
    });
  });
}

export {
  readdirAsync,
  walksAsync,
  readFileAsync,
  writeFileAsync,
  statAsync,
}