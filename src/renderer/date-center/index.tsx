const electron = window.require("electron");
const { ipcRenderer } = electron;
import { IPC_CODE } from "@constant";

export async function getMusicFileList(p: string) {
  return await ipcRenderer.invoke(IPC_CODE.getMusicFileList, p);
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