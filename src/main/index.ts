import { app, BrowserWindow, dialog, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import {
  handleGetAudioFileList,
  handleGetAudioFileMeta,
  handleGetAllSetting,
  handleGetSettingItem,
  handleSaveSetting,
  generateLibraryFilePath,
  readMusicFileMeta,
  handleGetFavorites,
  handleAddFavorite,
  handleRemoveFavorite,
} from "./handlers";
import {IPC_CODE, LOGS_PATH} from "@constant";
import {writeFileAsync} from "./utils/fs-promises";
import Logger from "./utils/logger";
import Dato from "./utils/dato";

const log = new Logger("main-index", {
  filePath: path.join(LOGS_PATH, `${Dato.now("YYYY-MM-DD")}.log`),
});

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
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true, // this config make react use electron.
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

/**
 * ipc handlers
 * some handlers need mainWindow and app instance,
 * so you cannot move it to the another file.
 * otherwise you should move it to a single file.
 */
// ipc: close all windows
ipcMain.handle(IPC_CODE.closeAllWindows, async () => {
  mainWindow.close();
});
// ipc: save setting
ipcMain.handle(IPC_CODE.saveSetting, handleSaveSetting);
// ipc: get setting
ipcMain.handle(IPC_CODE.getSetting, handleGetSettingItem);
// ipc: get all setting item
ipcMain.handle(IPC_CODE.getAllSetting, handleGetAllSetting);
// ipc: get music file
ipcMain.handle(IPC_CODE.getAudioFileMeta, handleGetAudioFileMeta);
// ipc: get music file list
ipcMain.handle(IPC_CODE.getAudioFileList, handleGetAudioFileList);
// ipc: save music file list
ipcMain.handle(
  IPC_CODE.saveAudioFileList,
  async (evt, p: string, lists: { src: string }[]) => {
    const filepath = generateLibraryFilePath(p, "-full");
    log.debug("try to save audio file list to the library");
    if (fs.existsSync(filepath)) {
      log.warning("full music library exists.");
      return { code: 1, msg: "full music library exists." };
    }

    log.info("try to get the audio meta for all.");
    const metas = [];
    for (let i = 0; i < lists.length; i++) {
      mainWindow.webContents.send(
        IPC_CODE.saveAudioFileListMsg,
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
      await writeFileAsync(filepath, JSON.stringify(metas, null, 2));
      log.info("save the audio library success: ", filepath);
      return { code: 1, msg: "success" };
    } catch (err) {
      log.error("save library list full failed");
      return { code: 0, msg: "save library list full failed" };
    }
  }
);
// ipc: get the favorites
ipcMain.handle(IPC_CODE.getFavorites, handleGetFavorites);
ipcMain.handle(IPC_CODE.addFavorite, handleAddFavorite);
ipcMain.handle(IPC_CODE.remoteFavorite, handleRemoveFavorite);
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
  log.debug("to open dialog [dir]");
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  if (result.filePaths.length) {
    log.debug("open dir success: ", result.filePaths);
    return { code: 1, msg: "open dir success.", data: result.filePaths };
  } else {
    log.error("open dir failed.");
    return { code: 0, msg: "open dir failed." };
  }
});
