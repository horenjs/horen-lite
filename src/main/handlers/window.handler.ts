import {Handler, IpcInvoke} from "../decorators";
import {EVENTS} from "@constant";
import {mainWindow} from "../index";
import {dialog} from "electron";
import Logger from "../utils/logger";

const log = new Logger("handler::window");

@Handler()
export class WindowHandler {
  constructor() {
    // do nothing;
  }

  @IpcInvoke(EVENTS.CLOSE_ALL_WINDOWS)
  public async handleCloseAllWindows() {
    mainWindow.close();
  }

  @IpcInvoke(EVENTS.MINIMIZE)
  public async handleMinimize() {
    mainWindow.minimize();
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