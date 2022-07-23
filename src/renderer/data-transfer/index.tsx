import {Track} from "@plugins/player";

const electron = window.require("electron");
const { ipcRenderer } = electron;
import { IPC_CODE } from "@constant/index";

export async function saveMusicFileListMsg() {
  return new Promise((res, rej) => {
    try {
      ipcRenderer.on(IPC_CODE.saveMusicFileListMsg, (evt, idx, totals, src) => {
        res([idx, totals, src]);
      })
    } catch (err) {
      rej(err);
    }
  })
}

export async function getMusicFileList(p: string) {
  return await ipcRenderer.invoke(IPC_CODE.getMusicFileList, p);
}

export async function saveMusicFileList(p: string, lists: Track[]) {
  return await ipcRenderer.invoke(IPC_CODE.saveMusicFileList, p, lists);
}

export async function getMusicFile(p: string, items?: string[]) {
  return await ipcRenderer.invoke(IPC_CODE.getMusicFile, p, items);
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
