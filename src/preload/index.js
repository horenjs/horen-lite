/* eslint-disable */
const { contextBridge, ipcRenderer } = require("electron");
const { IPC_CODE } = require("../constant/index.js");

contextBridge.exposeInMainWorld("ipc", {
  addFavorite: async (src) => {
    return await ipcRenderer.invoke(IPC_CODE.addFavorite, src);
  },

  getFavorites: async () => {
    return await ipcRenderer.invoke(IPC_CODE.getFavorites);
  },

  removeFavorite: async (src) => {
    return await ipcRenderer.invoke(IPC_CODE.remoteFavorite, src);
  },

  saveAudioFileListMsg: async () => {
    return new Promise((res, rej) => {
      try {
        ipcRenderer.on(IPC_CODE.saveAudioFileListMsg, (evt, idx, totals, src) => {
          res([idx, totals, src]);
        })
      } catch (err) {
        rej(err);
      }
    })
  },

  getAudioFileList: async (p) => {
    return await ipcRenderer.invoke(IPC_CODE.getAudioFileList, p);
  },

  saveAudioFileList: async (p, lists) => {
    return await ipcRenderer.invoke(IPC_CODE.saveAudioFileList, p, lists);
  },

  getAudioFileMeta: async (p, items) => {
    return await ipcRenderer.invoke(IPC_CODE.getAudioFileMeta, p, items);
  },

  closeAllWindows: async () => {
    return await ipcRenderer.invoke(IPC_CODE.closeAllWindows);
  },

  saveSetting: async (item, value) => {
    return await ipcRenderer.invoke(IPC_CODE.saveSetting, item ,value);
  },

  getSetting: async (item) => {
    return await ipcRenderer.invoke(IPC_CODE.getSetting, item);
  },

  getAllSetting: async () => {
    return await ipcRenderer.invoke(IPC_CODE.getAllSetting);
  },

  openDir: async () => {
    return await ipcRenderer.invoke(IPC_CODE.openDir);
  },

  setProgress: async (progress) => {
    return await ipcRenderer.invoke(IPC_CODE.setProgress, progress);
  },

  setTitle: async (title) => {
    return await ipcRenderer.invoke(IPC_CODE.setTitle, title);
  }

})