const electron = window.require("electron");
const { ipcRenderer } = electron;
import { IPC_CODE } from "../../constant";

export async function getMusicFileList() {
  return await ipcRenderer.invoke(IPC_CODE.getMusicFileList);
}