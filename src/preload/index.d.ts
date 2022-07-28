import {HandlerResponse} from "../main/handlers";
import {Favorites} from "../main/handlers/audio.handler";
import {SettingFile, SettingValue} from "../main/utils/setting-store";
import {Track} from "@plugins/player";


export interface IPC {
  /**
   * add favorite
   * @param src audio file path
   */
  addFavorite(src: string): Promise<HandlerResponse<void>>;

  /**
   * get favorite file
   */
  getFavorites(): Promise<HandlerResponse<Favorites>>;

  /**
   * remove a favorite audio
   * @param src audio file path
   */
  removeFavorite(src: string): Promise<HandlerResponse<void>>;

  /**
   * get the message from main process
   * when saving the audio list with meta to the file.
   */
  saveAudioFileListMsg(): Promise<[number, number, string]>;

  /**
   * get the audio list
   * @param p the path includes audio file.
   */
  getAudioFileList(p: string): Promise<HandlerResponse<{lists: Track[]}>>;

  /**
   * call main process to save audio list from renderer process
   * @param p the path includes audio file.
   * @param lists audio list
   */
  saveAudioFileList(p: string, lists: Track[]): Promise<HandlerResponse<void>>;

  /**
   * get an audio meta.
   * @param src audio file path.
   * @param items item to be included, like title, artist, etc..
   */
  getAudioFileMeta(src: string, items?: string[]): Promise<HandlerResponse<Track>>;

  /**
   * close all windows
   */
  closeAllWindows(): Promise<HandlerResponse<void>>;

  /**
   * save setting item
   * @param item item key
   * @param value item value
   */
  saveSetting(item: string, value: SettingValue): Promise<HandlerResponse<void>>;

  /**
   * get setting item
   * @param item item key
   */
  getSetting(item: string): Promise<HandlerResponse<SettingValue>>;

  /**
   * get all settings
   */
  getAllSetting(): Promise<HandlerResponse<SettingFile>>;

  /**
   * open a dir and return the dir path.
   */
  openDir(): Promise<HandlerResponse<string[]>>;

  /**
   * set the progress bar under the desktop
   * @param progress progress [0~1]
   */
  setProgress(progress: number): Promise<HandlerResponse<void>>;

  /**
   * set the progress bar title under the desktop
   * @param title title to be set.
   */
  setTitle(title: string): Promise<HandlerResponse<void>>;
}

declare global {
  interface Window {
    ipc: IPC;
  }
}