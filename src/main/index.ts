import {app, BrowserWindow, dialog, ipcMain} from "electron";
import { IPC_CODE } from "../constant";
// handlers
import {
  handleSaveSetting,
  handleGetMusicFileList,
  handleGetMusicFile,
  handleGetSetting,
  handleGetAllSetting
} from "./handlers";

const isDev = process.env["NODE_ENV"] === "development";

export let mainWindow: BrowserWindow;

function createWindow() {
  const w = new BrowserWindow({
    width: 300,
    height: 468,
    frame: false,
    resizable: false,
    movable: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // this config make react use electron.
      webSecurity: false,
    },
  });

  if (isDev) w.loadURL("http://localhost:9000/").then();
  // 生产环境应使用相对地址
  // 打包后的根目录为 app/
  else w.loadFile("./dist/index.html").then();

  return w;
}

app.whenReady().then(() => {
  // create main window
  mainWindow = createWindow();

  // only in macOS
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// ipc: save setting
ipcMain.handle(IPC_CODE.saveSetting, handleSaveSetting);
// ipc: get setting
ipcMain.handle(IPC_CODE.getSetting, handleGetSetting);
// ipc: get all setting item
ipcMain.handle(IPC_CODE.getAllSetting, handleGetAllSetting);
// ipc: get music file
ipcMain.handle(IPC_CODE.getMusicFile, handleGetMusicFile);
// ipc: get music file list
ipcMain.handle(IPC_CODE.getMusicFileList, handleGetMusicFileList);
// ipc: set the main window title
ipcMain.handle(IPC_CODE.setTitle, async (evt, title: string) => {
  mainWindow.setTitle(title);
});
// ipc: set the status bar progress
ipcMain.handle(IPC_CODE.setProgress, async (evt, progress: number) => {
  mainWindow.setProgressBar(progress);
});
// ipc: open dir
ipcMain.handle(IPC_CODE.openDir, async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  if (result.filePaths.length) {
    return { code: 1, msg: "open dir success.", data: result.filePaths };
  } else {
    return { code: 0, msg: "open dir failed." };
  }
});
