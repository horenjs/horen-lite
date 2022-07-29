import path from "path";
import { HandlerResponse } from "./index";
import { EVENTS, LOGS_PATH } from "@constant";
import Logger from "../utils/logger";
import Dato from "../utils/dato";
import SettingStore, {
  type SettingFile,
  type SettingValue,
} from "../utils/setting-store";
import { Handler, IpcInvoke } from "../decorators";

const log = new Logger("setting-handlers", {
  filePath: path.join(LOGS_PATH, `${Dato.now("YYYY-MM-DD")}.log`),
});

@Handler()
export class SettingHandler {
  constructor() {
    // do nothing;
  }

  @IpcInvoke(EVENTS.SAVE_SETTING_ITEM)
  public async handleSaveSettingItem(
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

  @IpcInvoke(EVENTS.GET_SETTING_ITEM)
  public async handleGetSettingItem(
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

  @IpcInvoke(EVENTS.GET_ALL_SETTINGS)
  public async handleGetAllSettings(): Promise<HandlerResponse<SettingFile>> {
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
}
