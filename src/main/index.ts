/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-06-08 22:04:38
 * @LastEditTime : 2022-06-11 06:35:40
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \react-electron-typescript\src\main\index.ts
 * @Description  :
 */
import { app, BrowserWindow } from "electron";

const isDev = process.env["NODE_ENV"] === "development";

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
  const mainWindow = createWindow();

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
