export {
  handleSaveSetting,
  handleGetAllSetting,
  handleGetSettingItem,
} from "./setting.handler";
export {
  handleGetAudioFileList,
  handleGetAudioFileMeta,
  generateLibraryFilePath,
  readMusicFileMeta,
  handleGetFavorites,
  handleAddFavorite,
  handleRemoveFavorite,
} from "./audio.handler";

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
