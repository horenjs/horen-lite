import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { IPC_CODE } from "../constant";
import fs from "fs";
import path from "path";
// handlers
import {
  handleSaveSetting,
  handleGetMusicFileList,
  handleGetMusicFile,
  handleGetSetting,
  handleGetAllSetting,
} from "./handlers";
import { readMusicFileMeta, writeFile } from "./utils";
import { generateMusicLibraryFilePath } from "./handlers/get-music-file-list";

const isDev = process.env["NODE_ENV"] === "development";

export let mainWindow: BrowserWindow;

function createWindow() {
  const w = new BrowserWindow({
    width: 300,
    height: 488,
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
// ipc: close all windows
ipcMain.handle(IPC_CODE.closeAllWindows, async () => {
  mainWindow.close();
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
// ipc: save music file list
ipcMain.handle(
  IPC_CODE.saveMusicFileList,
  async (evt, p: string, lists: { src: string }[]) => {
    const filepath = generateMusicLibraryFilePath(p, "-full");
    if (fs.existsSync(filepath)) {
      return {code: 1, msg: "full music library exists."};
    }

    const metas = [];
    for (let i = 0; i < lists.length; i++) {
      mainWindow.webContents.send(
        IPC_CODE.saveMusicFileListMsg,
        i,
        lists.length,
        path.basename(lists[i].src)
      );
      const meta = await readMusicFileMeta(lists[i].src, [
        "title",
        "artist",
        "artists",
        "album",
        "genre",
        "date",
        "duration",
        // "picture",
        "lyric",
      ]);
      metas.push(meta);
    }

    try {
      await writeFile(filepath, JSON.stringify(metas, null, 2));
      return { code: 1, msg: "success" };
    } catch (err) {
      return { code: 0, msg: "save library list full failed" };
    }
  }
);
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
