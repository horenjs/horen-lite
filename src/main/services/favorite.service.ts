import { Injectable } from "../decorators";
import path from "path";
import {USER_DATA_PATH} from "@constant";
import * as fse from "fs-extra";
import {FavoriteFile} from "../handlers/audio.handler";

@Injectable("FavoriteService")
export class FavoriteService {
  private readonly favoriteFilePath;
  private readonly encoding = "utf-8";

  constructor() {
    // do not delete this expression
    this.favoriteFilePath = path.join(USER_DATA_PATH, "favorites.json");
  }

  public async getAllFavorites() {
    try {
      return await fse.readJSON(this.favoriteFilePath, {
        encoding: this.encoding
      });
    } catch (err) {
      throw new Error("read favorite file failed.");
    }
  }

  public async addFavoriteItem(src: string) {
    let data;

    try {
      data = await fse.readJSON(this.favoriteFilePath, { encoding: this.encoding });
    } catch (err) {
      // do nothing
      data = null;
    }

    if (data) {
      data = {
        updateAt: new Date().valueOf(),
        lists: [...data.lists, {src, addAt: new Date().valueOf()}]
      }
    } else {
      data = {
        updateAt: new Date().valueOf(),
        lists: [{src, addAt: new Date().valueOf()}],
      };
    }

    try {
      await fse.writeJSON(this.favoriteFilePath, data, {
        encoding: this.encoding,
        spaces: 2,
      });
      return data;
    } catch (err) {
      throw new Error("cannot create new favorite file.");
    }
  }

  public async removeFavoriteItem(src: string) {
    let data: FavoriteFile;
    try {
      data = await fse.readJSON(this.favoriteFilePath, { encoding: this.encoding });
    } catch (err) {
      throw new Error("there is no favorite file.");
    }

    for (let i = 0; i < data.lists.length; i++) {
      const item = data.lists[i];
      if (item?.src === src) {
        data.lists.splice(i, 1);
      }
    }

    data.updateAt = new Date().valueOf();

    try {
      await fse.writeJSON(this.favoriteFilePath, data, {
        encoding: this.encoding,
        spaces: 2,
      });
    } catch (err) {
      throw new Error("cannot write the new favorite file.");
    }
  }
}