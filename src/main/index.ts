import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import * as mm from "music-metadata";
import { readDir } from "./utils";
import { IPC_CODE, AUDIO_EXTS } from "../constant";
import Store from "./utils/store";

const isDev = process.env["NODE_ENV"] === "development";

let mainWindow;

function createWindow() {
  const w = new BrowserWindow({
    width: 1000,
    height: 600,
    // frame: true,
    resizable: true,
    // movable: true,
    // transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // this config make react use electron.
      webSecurity: false,
    },
  });

  if (isDev) w.loadURL("http://localhost:9000/");
  // 生产环境应使用相对地址
  // 打包后的根目录为 app/
  else w.loadFile("./dist/index.html");

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
ipcMain.handle(IPC_CODE.saveSetting, async (evt, item: string, value: object | string | number | boolean) => {
  const store = new Store();
  try {
    const data = store.save(item, value);
    return {code: 1, msg: "save success.", data: data};
  } catch (err) {
    return {code: 0, msg: "save failed.", err: err};
  }
})

// ipc: get setting
ipcMain.handle(IPC_CODE.getSetting, async (evt, item: string) => {
  const store = new Store();
  try {
    const result = store.get(item);
    return {code: 1, msg: "get setting success.", data: result};
  } catch (err) {
    return {code: 0, msg: "get setting failed", err: err};
  }
})

// ipc: get all setting item
ipcMain.handle(IPC_CODE.getAllSetting, async () => {
  const store = new Store();
  try {
    const result = store.getAll();
    return {code: 1, msg: "get all setting success.", data: result};
  } catch (err) {
    return {code: 0, msg: "get setting failed", err: err};
  }
})

// ipc: open dir
ipcMain.handle(IPC_CODE.openDir, async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"]
  });
  if (result) {
    return {code: 1, msg: "open dir success.", data: result.filePaths};
  } else {
    return {code: 0, msg: "open dir failed."};
  }
})

// ipc: get music file list
ipcMain.handle(IPC_CODE.getMusicFileList, async (evt, p: string) => {
  const fileList = [];
  let musicFileList = [];

  try {
    musicFileList = await readDir(path.resolve(p), fileList);
  } catch (err) {
    console.error(err);
  }

  const results = [];

  for (const file of musicFileList) {
    const extname = path.extname(file).replace(".", "");
    let meta;

    try {
      meta = await mm.parseFile(file);
    } catch (err) {
      meta = null;
    }

    const { title, artist, artists, album, genre, date } = meta?.common || {};

    const { duration } = meta?.format || {};

    if (AUDIO_EXTS.includes(extname)) {
      results.push({
        src: file,
        title,
        artist,
        artists,
        album,
        genre,
        date,
        duration,
      });
    }
  }
  return results;
});
