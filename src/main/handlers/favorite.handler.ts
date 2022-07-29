import {HandlerResponse} from "./index";
import path from "path";
import {EVENTS, USER_DATA_PATH} from "@constant";
import * as fse from "fs-extra";
import {Favorites} from "./audio.handler";
import {Handler, IpcInvoke} from "../decorators";
import Logger from "../utils/logger";
import {readMusicFileMeta} from "./audio.handler";

const log = new Logger("handler:favorite");

@Handler()
export class FavoriteHandler {
  constructor() {
    // do nothing;
  }

  @IpcInvoke(EVENTS.GET_FAVORITES)
  public async handleGetFavorites(): Promise<HandlerResponse<Favorites>> {
    const favoritesFilePath = path.join(USER_DATA_PATH, "favorites.json");
    try {
      log.debug("ensure the favorite dir: ", favoritesFilePath);
      await fse.ensureDir(USER_DATA_PATH);
    } catch (err) {
      log.error("cannot make path: ", USER_DATA_PATH);
    }
    try {
      log.debug("try to get the favorites from existed file.");
      const jsonStr = await fse.readJSON(favoritesFilePath, {
        encoding: "utf-8",
      });
      return { code: 1, msg: "success", data: jsonStr };
    } catch (err) {
      log.error("get the favorites from file failed.");
      return { code: 0, msg: "get favorites failed", err: err };
    }
  }

  @IpcInvoke(EVENTS.ADD_FAVORITES)
  public async handleAddFavorite(
    evt,
    src: string
  ): Promise<HandlerResponse<any>> {
    const favoritesFilePath = path.join(USER_DATA_PATH, "favorites.json");
    let data: Favorites;
    try {
      log.debug("try to get the favorites from existed file: ", favoritesFilePath);
      data = await fse.readJSON(favoritesFilePath, { encoding: "utf-8" });
    } catch (err) {
      log.debug("there is no favorites file, create it.");
      data = {
        updateAt: new Date().valueOf(),
        lists: [],
      };
      log.debug("try to write new favorites to the file.");
      await fse.writeJSON(favoritesFilePath, data, {
        encoding: "utf-8",
        spaces: 2,
      });
    }

    const meta = await readMusicFileMeta(src, ["title", "src", "artist"]);
    const favorite = { ...meta, addAt: new Date().valueOf() };
    data.lists.push(favorite);
    log.debug("try to write the favorites to the file.");
    try {
      await fse.writeJSON(favoritesFilePath, data, {
        encoding: "utf-8",
        spaces: 2,
      });
      log.info("add favorite success: ", src);
      return { code: 1, msg: "add favorite success", data: data };
    } catch (err) {
      log.error("add favorite failed.");
      return { code: 0, msg: "add favorite failed" };
    }
  }

  @IpcInvoke(EVENTS.REMOVE_FAVORITE)
  public async handleRemoveFavorite(
    evt,
    src: string
  ): Promise<HandlerResponse<any>> {
    log.warning("try to remove the favorite item: ", src);
    const favoritesFilePath = path.join(USER_DATA_PATH, "favorites.json");
    let data: Favorites;
    try {
      data = await fse.readJSON(favoritesFilePath, { encoding: "utf-8" });
    } catch (err) {
      log.warning("there is no favorites file, create it.");
      return { code: 0, msg: "no favorites" };
    }

    for (let i = 0; i < data.lists.length; i++) {
      const item = data.lists[i];
      if (item?.src === src) {
        data.lists.splice(i, 1);
      }
    }

    data.updateAt = new Date().valueOf();

    try {
      await fse.writeJSON(favoritesFilePath, data, {
        encoding: "utf-8",
        spaces: 2,
      });
      return { code: 1, msg: "remove success", data: data };
    } catch (err) {
      return { code: 0, msg: "remove failed" };
    }
  }
}