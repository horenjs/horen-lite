import "reflect-metadata";
import { app, BrowserWindow } from "electron";
import path from "path";
import {LOGS_PATH} from "@constant";
import Logger from "./utils/logger";
import Dato from "./utils/dato";
import {destroy, bootstrap} from "./bootstrap";

const log = new Logger("main-index", {
  filePath: path.join(LOGS_PATH, `${Dato.now("YYYY-MM-DD")}.log`),
});

const isDev = process.env["NODE_ENV"] === "development";

export let mainWindow: BrowserWindow;

async function createWindow() {
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
      contextIsolation: true, // make this true for security.
      webSecurity: false,
    },
  });

  log.info("to bootstrap all handlers...");
  await bootstrap({
    webContents: w.webContents,
    mainWindow: w,
    app: app,
  });


  if (isDev) {
    log.info("env: development, load http://localhost:9000");
    w.loadURL("http://localhost:9000/").then();
    log.debug("open the dev tools...");
    w.webContents.openDevTools();
  }
  // 生产环境应使用相对地址
  // 打包后的根目录为 app/
  else {
    log.info("env: production, load the index.html");
    w.loadFile("./dist/index.html").then();
  }

  w.on("closed", () => {
    destroy();
    w.destroy();
  });

  return w;
}

app.whenReady().then(async () => {
  // create main window
  log.debug("create the main window.");
  mainWindow = await createWindow();

  // only in macOS
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", function () {
  log.debug("all windows is closed, quit.")
  if (process.platform !== "darwin") {
    log.debug("I am in darwin, don't quit.");
    app.quit();
  }
});
