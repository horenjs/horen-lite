import {BrowserWindow, app} from "electron";
import path from "path";
import {bootstrap, destroy} from "./bootstrap";
import Logger from "./utils/logger";
import { MAIN_WINDOW_CONFIG } from "@constant";

const log = new Logger("main::create-window");
const isDev = process.env.NODE_ENV === "development";
type ElectronApp = typeof app;

export async function createWindow(app: ElectronApp) {
  const config = {
    width: MAIN_WINDOW_CONFIG.width,
    height: MAIN_WINDOW_CONFIG.height,
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
  }

  const w = new BrowserWindow(config);

  log.info("to bootstrap all handlers...");
  await bootstrap({
    webContents: w.webContents,
    mainWindow: w,
    app: app,
  });

  if (isDev) {
    log.info("env: development, load http://localhost:9000");
    await w.loadURL("http://localhost:9000/");
    log.debug("open the dev tools...");
    w.webContents.openDevTools();
  } else {
    // 生产环境应使用相对地址
    // 打包后的根目录为 app/
    log.info("env: production, load the index.html");
    await w.loadFile("./dist/index.html");
  }

  w.on("closed", () => {
    destroy();
    w.destroy();
  });

  return w;
}