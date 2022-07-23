import Store from "../utils/store";
import {readMusicFileMeta} from "../utils";

async function handleSaveSetting(
  evt,
  item: string,
  value: object | string | number | boolean
) {
  const store = new Store();
  try {
    const data = store.save(item, value);
    return { code: 1, msg: "save success.", data: data };
  } catch (err) {
    return { code: 0, msg: "save failed.", err: err };
  }
}

async function handleGetSetting(evt, item: string) {
  const store = new Store();
  try {
    const result = store.get(item);
    return { code: 1, msg: "get setting success.", data: result };
  } catch (err) {
    return { code: 0, msg: "get setting failed", err: err };
  }
}

async function handleGetAllSetting() {
  const store = new Store();
  try {
    const result = store.getAll();
    return { code: 1, msg: "get all setting success.", data: result };
  } catch (err) {
    return { code: 0, msg: "get setting failed", err: err };
  }
}

async function handleGetMusicFile(evt, p: string, items?: string[]) {
  let meta;
  if (items) {
    meta = await readMusicFileMeta(p, items);
  } else {
    meta = await readMusicFileMeta(p);
  }
  return { code: 1, msg: "success", data: meta };
}

export {
  handleSaveSetting,
  handleGetAllSetting,
  handleGetSetting,
  handleGetMusicFile,
};
export { handleGetMusicFileList } from "./get-music-file-list";
