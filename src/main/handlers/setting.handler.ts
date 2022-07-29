import path from "path";
import {HandlerResponse, HandlerResponseCode, Resp} from "./index";
import {EVENTS, LOGS_PATH} from "@constant";
import Logger from "../utils/logger";
import Dato from "../utils/dato";
import {type SettingFile, type SettingValue} from "../utils/setting-store";
import {Handler, IpcInvoke} from "../decorators";
import {SettingService} from "../services/setting.service";

const log = new Logger("setting-handlers", {
  filePath: path.join(LOGS_PATH, `${Dato.now("YYYY-MM-DD")}.log`),
});

@Handler()
export class SettingHandler {
  constructor(private settingService: SettingService) {
    // do nothing;
  }

  @IpcInvoke(EVENTS.SAVE_SETTING_ITEM)
  public async handleSaveSettingItem(
    evt,
    item: string,
    value: SettingValue
  ): Promise<HandlerResponse<SettingFile>> {
    log.info("to save the setting item: ", item);
    try {
      const data = this.settingService.saveItem(item, value);
      return Resp(HandlerResponseCode.SUCCESS, data);
    } catch (err) {
      log.warning(err);
      return Resp(HandlerResponseCode.ERROR, null, err);
    }
  }

  @IpcInvoke(EVENTS.GET_SETTING_ITEM)
  public async handleGetSettingItem(
    evt,
    item: string
  ): Promise<HandlerResponse<SettingValue>> {
    log.info("to get setting item: ", item);
    try {
      const data = this.settingService.getItem(item);
      return Resp(HandlerResponseCode.SUCCESS, data);
    } catch (err) {
      log.warning(err);
      return Resp(HandlerResponseCode.ERROR, null, err);
    }
  }

  @IpcInvoke(EVENTS.GET_ALL_SETTINGS)
  public async handleGetAllSettings(): Promise<HandlerResponse<SettingFile>> {
    log.info("to get all setting items");
    try {
      const data = this.settingService.getAllItems();
      return Resp(HandlerResponseCode.SUCCESS, data);
    } catch (err) {
      log.warning(err);
      return Resp(HandlerResponseCode.ERROR, null, err);
    }
  }
}
