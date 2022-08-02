import { contextBridge, ipcRenderer } from "electron";
import { EVENTS } from "@constant";

declare global {
  interface Window {
    ipc: typeof IPC_API;
  }
}

const IPC_API = {
  addFavorite: async (src) => {
    return await ipcRenderer.invoke(EVENTS.ADD_FAVORITES.toString(), src);
  },

  getFavorites: async () => {
    return await ipcRenderer.invoke(EVENTS.GET_FAVORITES.toString());
  },

  removeFavorite: async (src) => {
    return await ipcRenderer.invoke(EVENTS.REMOVE_FAVORITE.toString(), src);
  },

  /**
   * get the intact queue
   * @param sources
   * @param opts limit: default 99999, offset: default 0
   */
  getIntactQueue: async (sources: string[], opts?) => {
    return await ipcRenderer.invoke(EVENTS.GET_INTACT_QUEUE.toString(), sources, opts);
  },

  rebuildMsg: async () => {
    return new Promise((res, rej) => {
      try {
        ipcRenderer.on(EVENTS.REBUILD_AUDIO_CACHE_MSG.toString(), (evt, msg) => {
          res(msg);
        })
      } catch (err) {
        rej(err);
      }
    })
  },

  getAudioList: async (libraries: string[], opts?) => {
    return await ipcRenderer.invoke(EVENTS.GET_AUDIO_LIST.toString(), libraries, opts);
  },

  rebuild: async (paths: string[]) => {
    return await ipcRenderer.invoke(EVENTS.REBUILD_AUDIO_CACHE.toString(), paths);
  },

  getAudioMeta: async (p: string) => {
    return await ipcRenderer.invoke(EVENTS.GET_AUDIO_META.toString(), p);
  },

  closeAllWindows: async () => {
    return await ipcRenderer.invoke(EVENTS.CLOSE_ALL_WINDOWS.toString());
  },

  saveSettingItem: async (item, value) => {
    return await ipcRenderer.invoke(EVENTS.SAVE_SETTING_ITEM.toString(), item ,value);
  },

  getSettingItem: async (item: string) => {
    return await ipcRenderer.invoke(EVENTS.GET_SETTING_ITEM.toString(), item);
  },

  getAllSettingItems: async () => {
    return await ipcRenderer.invoke(EVENTS.GET_ALL_SETTINGS.toString());
  },

  openDir: async () => {
    return await ipcRenderer.invoke(EVENTS.OPEN_DIR.toString());
  },

  setProgress: async (progress) => {
    return await ipcRenderer.invoke(EVENTS.SET_PROGRESS.toString(), progress);
  },

  setTitle: async (title) => {
    return await ipcRenderer.invoke(EVENTS.SET_TITLE.toString(), title);
  }

}

contextBridge.exposeInMainWorld("ipc", IPC_API);