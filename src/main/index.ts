import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
import * as crypto from "crypto";
import * as mm from "music-metadata";
import { readDir, readFile, writeFile } from "./utils";
import { arrayBufferToBase64 } from "./utils/array-buf";
import { AUDIO_EXTS, IPC_CODE } from "../constant";
import Store from "./utils/store";

const isDev = process.env["NODE_ENV"] === "development";

let mainWindow: BrowserWindow;

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
ipcMain.handle(
  IPC_CODE.saveSetting,
  async (evt, item: string, value: object | string | number | boolean) => {
    const store = new Store();
    try {
      const data = store.save(item, value);
      return { code: 1, msg: "save success.", data: data };
    } catch (err) {
      return { code: 0, msg: "save failed.", err: err };
    }
  }
);

// ipc: get setting
ipcMain.handle(IPC_CODE.getSetting, async (evt, item: string) => {
  const store = new Store();
  try {
    const result = store.get(item);
    return { code: 1, msg: "get setting success.", data: result };
  } catch (err) {
    return { code: 0, msg: "get setting failed", err: err };
  }
});

// ipc: get all setting item
ipcMain.handle(IPC_CODE.getAllSetting, async () => {
  const store = new Store();
  try {
    const result = store.getAll();
    return { code: 1, msg: "get all setting success.", data: result };
  } catch (err) {
    return { code: 0, msg: "get setting failed", err: err };
  }
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

// ipc: get music file
ipcMain.handle(IPC_CODE.getMusicFile, async (evt, p: string) => {
  const meta = await readMusicFileMeta(p);
  return { code: 1, msg: "success", data: meta };
});

// ipc: get music file list
ipcMain.handle(IPC_CODE.getMusicFileList, async (evt, p: string) => {
  const hash = crypto.createHash("md5");
  hash.update(p);

  let musicFileList = [];

  const appPath = path.join(process.env.APPDATA, "horen-lite");
  const musicLibraryPath = path.join(
    appPath,
    `Library-${hash.digest("hex")}.json`
  );

  try {
    const musicLibraryJsonStr = await readFile(musicLibraryPath);
    musicFileList = JSON.parse(musicLibraryJsonStr);
    if (musicFileList.length > 0) {
      return {
        code: 1,
        msg: "success",
        data: {
          lists: musicFileList.map((m) => {
            return { src: m };
          }),
        },
      };
    }
  } catch (err) {
    console.log(err);
  }

  const fileList = [];

  if (musicFileList.length === 0) {
    try {
      musicFileList = await readDir(path.resolve(p), fileList);
    } catch (err) {
      console.error(err);
    }
  }

  // 保存在曲库文件
  try {
    await writeFile(
      musicLibraryPath,
      JSON.stringify(
        musicFileList.map((r) => {
          return { src: r };
        }),
        null,
        2
      )
    );
  } catch (err) {
    console.log("save music library failed.");
  }

  return {
    code: 1,
    msg: "success",
    data: { lists: musicFileList.map((m) => ({ src: m })) },
  };
});

ipcMain.handle(IPC_CODE.setTitle, async (evt, title: string) => {
  mainWindow.setTitle(title);
});

ipcMain.handle(IPC_CODE.setProgress, async (evt, progress: number) => {
  mainWindow.setProgressBar(progress);
});

export function arrayBufferToBuffer(ab: ArrayBuffer) {
  const buf = new Buffer(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) buf[i] = view[i];
  return buf;
}

export async function readMusicFileMeta(filepath: string) {
  let meta;
  try {
    meta = await mm.parseFile(filepath);
  } catch (err) {
    meta = null;
  }

  const { title, artist, artists, album, genre, date, picture } =
    meta?.common || {};

  const { duration } = meta?.format || {};

  let finalPic;
  if (picture) {
    const data = picture[0]?.data;
    finalPic = arrayBufferToBase64(data);
  } else {
    finalPic = null;
  }

  return {
    src: filepath,
    title,
    artist,
    artists,
    album,
    genre,
    date,
    duration,
    picture: finalPic,
  };
}
