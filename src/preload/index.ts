import { contextBridge, ipcRenderer } from "electron";
import { EVENTS } from "@constant";
import { HandlerResponse } from "../main/handlers";
import { Track } from "@plugins/player";
import { SettingValue } from "../main/utils/setting-store";
import {Favorite} from "../main/services/favorite.service";
import {AudioMeta} from "../main/services/audio.service";

const IpcInvoke = async (
  event: EVENTS,
  ...args
): Promise<HandlerResponse<any>> => {
  return await ipcRenderer.invoke(event.toString(), ...args);
};

async function IpcOn(event: EVENTS): Promise<any> {
  return new Promise((res, rej) => {
    try {
      ipcRenderer.on(event.toString(), (evt, ...args) => {
        res(args);
      });
    } catch (err) {
      rej(err);
    }
  });
}

declare global {
  interface Window {
    ipc: IpcApi;
  }
}

interface IpcApi {
  // audio: favorite
  /**
   * add favorite item via src
   * @param src audio source
   */
  addFavoriteItem(src: string): Promise<HandlerResponse<void>>;
  /**
   * remove favorite item via src
   * @param src audio source
   */
  removeFavoriteItem(src: string): Promise<HandlerResponse<void>>;
  /**
   * get favorite list
   */
  getFavorites(): Promise<HandlerResponse<Favorite[]>>;
  // audio
  /**
   * get the audio list
   * @param libraries library path
   * @param opts
   */
  getAudios(
    libraries: string[],
    opts?: any
  ): Promise<HandlerResponse<AudioMeta[]>>;
  /**
   * rebuild audio cache
   * @param libraries
   */
  rebuild(libraries: string[]): Promise<HandlerResponse<void>>;
  /**
   * rebuild audio cache msg
   */
  rebuildMsg(): Promise<[number, number, string]>;
  /**
   * get the intact queue
   * @param sources
   * @param opts limit: default 99999, offset: default 0
   */
  getIntactQueue(
    sources: string[],
    opts?: any
  ): Promise<HandlerResponse<AudioMeta>>;
  /**
   * get audio meta
   * @param src
   */
  getAudioMeta(src: string): Promise<HandlerResponse<AudioMeta>>;
  // main window
  /**
   * close all windows
   */
  closeAllWindows(): Promise<HandlerResponse<void>>;
  /**
   * open directory
   */
  openDir(): Promise<HandlerResponse<any>>;
  /**
   * set progress bar
   * @param progress
   */
  setProgress(progress: number): Promise<HandlerResponse<void>>;
  /**
   * set title
   * @param title
   */
  setTitle(title: string): Promise<HandlerResponse<void>>;
  // setting
  /**
   * save setting item
   * @param item item title
   * @param value item value
   */
  saveSettingItem(
    item: string,
    value: SettingValue
  ): Promise<HandlerResponse<void>>;
  /**
   * get setting item
   * @param item item title
   */
  getSettingItem(item: string): Promise<HandlerResponse<SettingValue>>;
  /**
   * get all setting item
   */
  getAllSettingItems(): Promise<HandlerResponse<SettingValue[]>>;
}

const IPC_API: IpcApi = {
  addFavoriteItem: async (src: string): Promise<HandlerResponse<void>> => {
    return await IpcInvoke(EVENTS.ADD_FAVORITES, src);
  },
  getFavorites: async (): Promise<HandlerResponse<Favorite[]>> => {
    return await IpcInvoke(EVENTS.GET_FAVORITES);
  },
  removeFavoriteItem: async (src: string): Promise<HandlerResponse<void>> => {
    return await IpcInvoke(EVENTS.REMOVE_FAVORITE, src);
  },
  getIntactQueue: async (
    sources: string[],
    opts?
  ): Promise<HandlerResponse<Track[]>> => {
    return await IpcInvoke(EVENTS.GET_INTACT_QUEUE, sources, opts);
  },
  rebuildMsg: async (): Promise<[number, number, string]> => {
    return await IpcOn(EVENTS.REBUILD_AUDIO_CACHE_MSG);
  },
  getAudios: async (
    libraries: string[],
    opts?
  ): Promise<HandlerResponse<AudioMeta[]>> => {
    return await IpcInvoke(EVENTS.GET_AUDIO_LIST, libraries, opts);
  },
  rebuild: async (paths: string[]): Promise<HandlerResponse<void>> => {
    return await IpcInvoke(EVENTS.REBUILD_AUDIO_CACHE, paths);
  },
  getAudioMeta: async (src: string): Promise<HandlerResponse<AudioMeta>> => {
    return await IpcInvoke(EVENTS.GET_AUDIO_META, src);
  },
  closeAllWindows: async (): Promise<HandlerResponse<void>> => {
    return await IpcInvoke(EVENTS.CLOSE_ALL_WINDOWS);
  },
  saveSettingItem: async (
    item: string,
    value: SettingValue
  ): Promise<HandlerResponse<void>> => {
    return await IpcInvoke(EVENTS.SAVE_SETTING_ITEM, item, value);
  },
  getSettingItem: async (
    item: string
  ): Promise<HandlerResponse<SettingValue>> => {
    return await IpcInvoke(EVENTS.GET_SETTING_ITEM, item);
  },
  getAllSettingItems: async (): Promise<HandlerResponse<SettingValue[]>> => {
    return await IpcInvoke(EVENTS.GET_ALL_SETTINGS);
  },
  openDir: async (): Promise<HandlerResponse<any>> => {
    return await IpcInvoke(EVENTS.OPEN_DIR);
  },
  setProgress: async (progress): Promise<HandlerResponse<void>> => {
    return await IpcInvoke(EVENTS.SET_PROGRESS, progress);
  },
  setTitle: async (title: string): Promise<HandlerResponse<void>> => {
    return await IpcInvoke(EVENTS.SET_TITLE, title);
  },
};

contextBridge.exposeInMainWorld("ipc", IPC_API);
