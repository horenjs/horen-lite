export { AudioHandler } from "./audio.handler";
export { FavoriteHandler } from "./favorite.handler";
export { SettingHandler } from "./setting.handler";
export { WindowHandler } from "./window.handler";

export type HandlerResponseCode =
  | 0
  | 1;

export type HandlerResponseData<T> = T | any;

export interface HandlerResponse<T> {
  code: HandlerResponseCode;
  msg: string;
  data?: HandlerResponseData<T>;
  err?: string;
}
