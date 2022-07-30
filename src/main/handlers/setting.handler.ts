import {HandlerResponse, HandlerResponseCode, Resp} from "./index";
import {EVENTS} from "@constant";
import Logger from "../utils/logger";
import {type SettingFile, type SettingValue} from "../utils/setting-store";
import {Handler, IpcInvoke} from "../decorators";
import {SettingService} from "../services/setting.service";

const log = new Logger("handler::setting");

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
