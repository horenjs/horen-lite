import path from "path";
import {AUDIO_EXTS} from "@constant/index";
import {readDir, readFile, writeFile} from "../utils";
import crypto from "crypto";

export async function handleGetMusicFileList(evt, p: string) {
  const musicLibraryFilePath = generateMusicLibraryFilePath(p);
  // 从已经保存的列表中读取，如果已经存在直接返回
  const audioFileList = await getAudioFileListFromExist(musicLibraryFilePath);
  if (audioFileList.length > 0) {
    return {
      code: 1,
      msg: "success",
      data: { lists: audioFileList },
    };
  }
  // 如果不存在，重新读取并生成
  const originFileList = await getOriginFileList(p);
  const lists = selectAudioFile(originFileList);
  // 保存到曲库文件
  await saveAudioFileList(musicLibraryFilePath, lists);

  return {
    code: 1,
    msg: "success",
    data: { lists },
  };
}

function selectAudioFile(origin: string[]) {
  const tmp = [];
  for (const m of origin) {
    const extname = path.extname(m).replace(".", "");
    if (AUDIO_EXTS.includes(extname)) {
      tmp.push({ src: m });
    }
  }
  return tmp;
}

async function getAudioFileListFromExist(p: string) {
  const musicLibraryJsonStr = await readFile(p);
  return JSON.parse(musicLibraryJsonStr);
}

async function saveAudioFileList(p: string, list: { src: string }[]) {
  try {
    await writeFile(p, JSON.stringify(list, null, 2));
  } catch (err) {
    console.log("save music library failed.");
  }
}

async function getOriginFileList(p: string) {
  const tmp = [];
  try {
    return await readDir(path.resolve(p), tmp);
  } catch (err) {
    console.error(err);
  }
}

function generateMusicLibraryFilePath(p: string) {
  const hash = crypto.createHash("md5");
  hash.update(p);

  const appPath = path.join(process.env.APPDATA, "horen-lite");
  return path.join(
    appPath,
    `Library-${hash.digest("hex")}.json`
  );
}