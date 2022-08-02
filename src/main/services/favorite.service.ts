import { Injectable } from "../decorators";
import path from "path";
import {USER_DATA_PATH} from "@constant";
import {FavoriteModel} from "../db/models";
import {AudioService} from "./audio.service";

@Injectable("FavoriteService")
export class FavoriteService {
  private readonly favoriteFilePath;
  private readonly encoding = "utf-8";

  constructor() {
    // do not delete this expression
    this.favoriteFilePath = path.join(USER_DATA_PATH, "favorites.json");
  }

  public async getAllFavorites() {
    const result = await FavoriteModel.findAll();
    return result.map(r => r.get());
  }

  public async addFavoriteItem(src: string) {
    const as = new AudioService();
    const meta = await as.readMeta(src);
    for (const key in meta) {
      const value = meta[key];
      if (value instanceof Array) {
        meta[key] = JSON.stringify(value);
      }
    }
    await FavoriteModel.create({...meta});
  }

  public async removeFavoriteItem(src: string) {
    await FavoriteModel.destroy({where:{src}});
  }
}