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

export async function rebuild(paths: string[]) {
  return await window.ipc.rebuild(paths);
}

export async function getIntactQueue(sources: string[], opts?) {
  return await window.ipc.getIntactQueue(sources, opts);
}

export async function rebuildMsg() {
  return await window.ipc.rebuildMsg();
}

export async function getAudioList(p: string) {
  return await window.ipc.getAudioList(p);
}

export async function getAudioMeta(p: string) {
  return await window.ipc.getAudioMeta(p);
}

export async function closeAllWindows() {
  return await window.ipc.closeAllWindows();
}

export async function saveSettingItem(item: string, value: SettingValue) {
  return await window.ipc.saveSettingItem(item, value);
}

export async function getSettingItem(item: string) {
  return await window.ipc.getSettingItem(item);
}

export async function getAllSettingItems() {
  return await window.ipc.getAllSettingItems();
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
