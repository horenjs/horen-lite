import {Track} from "@plugins/player";
import { type SettingValue } from "../../main/utils/setting-store";

export async function addFavorite(src: string) {
  return await window.ipc.addFavorite(src);
}

export async function getFavorites() {
  return await window.ipc.getFavorites();
}

export async function removeFavorite(src: string) {
  return await window.ipc.removeFavorite(src);
}

export async function saveAudioFileListMsg() {
  return await window.ipc.saveAudioFileListMsg();
}

export async function getAudioFileList(p: string) {
  return await window.ipc.getAudioFileList(p);
}

export async function saveAudioFileList(p: string, lists: Track[]) {
  return await window.ipc.saveAudioFileList(p, lists);
}

export async function getAudioFileMeta(p: string, items?: string[]) {
  return await window.ipc.getAudioFileMeta(p, items);
}

export async function closeAllWindows() {
  return await window.ipc.closeAllWindows();
}

export async function saveSetting(item: string, value: SettingValue) {
  return await window.ipc.saveSetting(item, value);
}

export async function getSetting(item: string) {
  return await window.ipc.getSetting(item);
}

export async function getAllSetting() {
  return await window.ipc.getAllSetting();
}

export async function openDir() {
  return await window.ipc.openDir();
}

export async function setProgress(progress: number) {
  return await window.ipc.setProgress(progress);
}

export async function setTitle(title: string) {
  return await window.ipc.setTitle(title);
}
