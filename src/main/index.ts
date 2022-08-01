import "reflect-metadata";
import {app, BrowserWindow} from "electron";
import Logger from "./utils/logger";
import {createWindow} from "./create-window";

const log = new Logger("main::init");

export let mainWindow: BrowserWindow;

app.whenReady().then(async () => {
  // create main window
  log.debug("create the main window.");
  mainWindow = await createWindow(app);
});

app.on("activate", async () => {
  // create window when you close all
  // only in macOS
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow(app);
  }
});

app.on("window-all-closed", function () {
  log.debug("all windows is closed, quit.")
  if (process.platform !== "darwin") {
    log.debug("I am in darwin, don't quit.");
    app.quit();
  }
});
