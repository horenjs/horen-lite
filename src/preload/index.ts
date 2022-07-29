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

  saveAudioFileListMsg: async () => {
    return new Promise((res, rej) => {
      try {
        ipcRenderer.on(EVENTS.SAVE_AUDIO_LIST_REPLY_MSG.toString(), (evt, idx, totals, src) => {
          res([idx, totals, src]);
        })
      } catch (err) {
        rej(err);
      }
    })
  },

  getAudioFileList: async (p) => {
    return await ipcRenderer.invoke(EVENTS.GET_AUDIO_LIST.toString(), p);
  },

  saveAudioFileList: async (p, lists) => {
    return await ipcRenderer.invoke(EVENTS.SAVE_AUDIO_LIST.toString(), p, lists);
  },

  getAudioFileMeta: async (p, items) => {
    return await ipcRenderer.invoke(EVENTS.GET_AUDIO_META.toString(), p, items);
  },

  closeAllWindows: async () => {
    return await ipcRenderer.invoke(EVENTS.CLOSE_ALL_WINDOWS.toString());
  },

  saveSetting: async (item, value) => {
    return await ipcRenderer.invoke(EVENTS.SAVE_SETTING_ITEM.toString(), item ,value);
  },

  getSetting: async (item: string) => {
    return await ipcRenderer.invoke(EVENTS.GET_SETTING_ITEM.toString(), item);
  },

  getAllSetting: async () => {
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