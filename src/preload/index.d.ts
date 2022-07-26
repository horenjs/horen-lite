import {HandlerResponse} from "../main/handlers";
import {Favorites} from "../main/handlers/audio.handler";
import {Track} from "@plugins/player";
import {SettingFile, SettingValue} from "../main/utils/setting-store";

export interface IPC {
  addFavorite(src: string): Promise<HandlerResponse<void>>;
  getFavorites(): Promise<HandlerResponse<Favorites>>;
  removeFavorite(src: string): Promise<HandlerResponse<void>>;
  saveAudioFileListMsg(): Promise<[number, number, string]>;
  getAudioFileList(p: string): Promise<HandlerResponse<{lists: Track[]}>>;
  saveAudioFileList(p: string, lists: Track[]): Promise<HandlerResponse<void>>;
  getAudioFileMeta(src: string, items?: string[]): Promise<HandlerResponse<Track>>;
  closeAllWindows(): Promise<HandlerResponse<void>>;
  saveSetting(item: string, value: SettingValue): Promise<HandlerResponse<void>>;
  getSetting(item: string): Promise<HandlerResponse<SettingValue>>;
  getAllSetting(): Promise<HandlerResponse<SettingFile>>;
  openDir(): Promise<HandlerResponse<string[]>>;
  setProgress(progress: number): Promise<HandlerResponse<void>>;
  setTitle(title: string): Promise<HandlerResponse<void>>;
}

declare global {
  interface Window {
    ipc: IPC;
  }
}