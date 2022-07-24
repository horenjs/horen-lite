import SettingStore, { SettingFile } from "../utils/setting-store";
import { HandlerResponse } from "./index";
import { SettingValue } from "../utils/setting-store";

export async function handleSaveSetting(
  evt,
  item: string,
  value: SettingValue
): Promise<HandlerResponse<SettingFile>> {
  const store = new SettingStore();
  try {
    const data = store.save(item, value);
    return { code: 1, msg: "save success.", data: data };
  } catch (err) {
    return { code: 0, msg: "save failed.", err: err };
  }
}

export async function handleGetSettingItem(
  evt,
  item: string
): Promise<HandlerResponse<SettingValue>> {
  const store = new SettingStore();
  try {
    const value = store.get(item);
    return { code: 1, msg: "get setting success.", data: value };
  } catch (err) {
    return { code: 0, msg: "get setting failed", err: err };
  }
}

export async function handleGetAllSetting(): Promise<
  HandlerResponse<SettingFile>
> {
  const store = new SettingStore();
  try {
    const result = store.getAll();
    return { code: 1, msg: "get all setting success.", data: result };
  } catch (err) {
    return { code: 0, msg: "get setting failed", err: err };
  }
}
