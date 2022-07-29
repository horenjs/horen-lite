import {Handler, IpcInvoke} from "../decorators";
import {EVENTS, LOGS_PATH} from "@constant";
import {mainWindow} from "../index";
import {dialog} from "electron";
import Logger from "../utils/logger";
import path from "path";
import Dato from "../utils/dato";

const log = new Logger("main-index", {
  filePath: path.join(LOGS_PATH, `${Dato.now("YYYY-MM-DD")}.log`),
});

@Handler()
export class WindowHandler {
  constructor() {
    // do nothing;
  }

  @IpcInvoke(EVENTS.CLOSE_ALL_WINDOWS)
  public async handleCloseAllWindows() {
    mainWindow.close();
  }

  @IpcInvoke(EVENTS.SET_TITLE)
  public async handleSetTitle(evt, title: string) {
    mainWindow.setTitle(title);
  }

  @IpcInvoke(EVENTS.SET_PROGRESS)
  public async handleSetProgress(evt, progress: number) {
    mainWindow.setProgressBar(progress);
  }

  @IpcInvoke(EVENTS.OPEN_DIR)
  public async handleOpenDir() {
    log.debug("to open dir.");
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
  }
}