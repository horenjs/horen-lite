import SettingStore, { SettingFile } from "../utils/setting-store";
import { HandlerResponse } from "./index";
import { SettingValue } from "../utils/setting-store";
import Logger from "../utils/logger";
import path from "path";
import {APP_DATA_PATH} from "@constant";
import Dato from "../utils/dato";

const log = new Logger("setting-handlers", {
  filePath: path.join(APP_DATA_PATH, "logs", `${Dato.now("YYYY-MM-DD")}.log`),
});

export async function handleSaveSetting(
  evt,
  item: string,
  value: SettingValue
): Promise<HandlerResponse<SettingFile>> {
  const store = new SettingStore();
  try {
    log.debug("try to save the setting item: ", item);
    const data = store.save(item, value);
    return { code: 1, msg: "save success.", data: data };
  } catch (err) {
    log.error("save the setting failed.");
    return { code: 0, msg: "save failed.", err: err };
  }
}

export async function handleGetSettingItem(
  evt,
  item: string
): Promise<HandlerResponse<SettingValue>> {
  const store = new SettingStore();
  try {
    log.debug("try to get the setting item: ", item);
    const value = store.get(item);
    return { code: 1, msg: "get setting success.", data: value };
  } catch (err) {
    log.error("get the setting item failed.");
    return { code: 0, msg: "get setting failed", err: err };
  }
}

export async function handleGetAllSetting(): Promise<
  HandlerResponse<SettingFile>
  > {
  const store = new SettingStore();
  try {
    log.debug("try to get all settings");
    const result = store.getAll();
    return { code: 1, msg: "get all setting success.", data: result };
  } catch (err) {
    log.error("get the all settings failed");
    return { code: 0, msg: "get setting failed", err: err };
  }
}
