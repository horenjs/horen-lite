import {Track} from "@plugins/player";

const electron = window.require("electron");
const { ipcRenderer } = electron;
import { IPC_CODE } from "@constant/index";

export async function addFavorite(src: string) {
  return await ipcRenderer.invoke(IPC_CODE.addFavorite, src);
}

export async function getFavorites() {
  return await ipcRenderer.invoke(IPC_CODE.getFavorites);
}

export async function removeFavorite(src: string) {
  return await ipcRenderer.invoke(IPC_CODE.remoteFavorite, src);
}

export async function saveAudioFileListMsg() {
  return new Promise((res, rej) => {
    try {
      ipcRenderer.on(IPC_CODE.saveAudioFileListMsg, (evt, idx, totals, src) => {
        res([idx, totals, src]);
      })
    } catch (err) {
      rej(err);
    }
  })
}

export async function getAudioFileList(p: string) {
  return await ipcRenderer.invoke(IPC_CODE.getAudioFileList, p);
}

export async function saveAudioFileList(p: string, lists: Track[]) {
  return await ipcRenderer.invoke(IPC_CODE.saveAudioFileList, p, lists);
}

export async function getAudioFileMeta(p: string, items?: string[]) {
  return await ipcRenderer.invoke(IPC_CODE.getAudioFileMeta, p, items);
}

export async function closeAllWindows() {
  return await ipcRenderer.invoke(IPC_CODE.closeAllWindows);
}

export async function saveSetting(item: string, value: object | string | number | boolean) {
  return await ipcRenderer.invoke(IPC_CODE.saveSetting, item ,value);
}

export async function getSetting(item: string) {
  return await ipcRenderer.invoke(IPC_CODE.getSetting, item);
}

export async function getAllSetting() {
  return await ipcRenderer.invoke(IPC_CODE.getAllSetting);
}

export async function openDir() {
  return await ipcRenderer.invoke(IPC_CODE.openDir);
}

export async function setProgress(progress: number) {
  return await ipcRenderer.invoke(IPC_CODE.setProgress, progress);
}

export async function setTitle(title: string) {
  return await ipcRenderer.invoke(IPC_CODE.setTitle, title);
}
