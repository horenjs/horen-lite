import { RESP_CODE } from "@constant";

export { AudioHandler } from "./audio.handler";
export { FavoriteHandler } from "./favorite.handler";
export { SettingHandler } from "./setting.handler";
export { WindowHandler } from "./window.handler";


export type HandlerResponseData<T> = T | any;

export interface HandlerResponse<T> {
  code: RESP_CODE;
  msg: string;
  data?: HandlerResponseData<T>;
  err?: string;
}

export function Resp<T = any>(code: RESP_CODE, data: HandlerResponseData<T>, err?: string, msg?: string) {
  return {
    code,
    data,
    err,
    msg,
  }
}
