export { AudioHandler } from "./audio.handler";
export { FavoriteHandler } from "./favorite.handler";
export { SettingHandler } from "./setting.handler";
export { WindowHandler } from "./window.handler";


export type HandlerResponseData<T> = T | any;

export interface HandlerResponse<T> {
  code: HandlerResponseCode;
  msg: string;
  data?: HandlerResponseData<T>;
  err?: string;
}

export enum HandlerResponseCode {
  ERROR = 0,
  SUCCESS
}

export function Resp<T = any>(code: HandlerResponseCode, data: HandlerResponseData<T>, err?: string, msg?: string) {
  return {
    code,
    data,
    err,
    msg,
  }
}
