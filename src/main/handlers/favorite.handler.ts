import {HandlerResponse, Resp} from "./index";
import {EVENTS, RESP_CODE} from "@constant";
import {FavoriteFile} from "./audio.handler";
import {Handler, IpcInvoke} from "../decorators";
import Logger from "../utils/logger";
import {FavoriteService} from "../services/favorite.service";

const log = new Logger("handler::favorite");

@Handler()
export class FavoriteHandler {
  constructor(private favoriteService: FavoriteService) {
    // do nothing;
  }

  @IpcInvoke(EVENTS.GET_FAVORITES)
  public async handleGetFavorites(): Promise<HandlerResponse<FavoriteFile>> {
    try {
      const data = await this.favoriteService.getAllFavorites();
      return Resp(RESP_CODE.OK, data);
    } catch (err) {
      log.error(err);
      return Resp(RESP_CODE.ERROR, null, err);
    }
  }

  @IpcInvoke(EVENTS.ADD_FAVORITES)
  public async handleAddFavorite(
    evt,
    src: string
  ): Promise<HandlerResponse<FavoriteFile>> {
    try {
      const data = await this.favoriteService.addFavoriteItem(src);
      return Resp(RESP_CODE.OK, data);
    } catch (err) {
      log.error(err);
      return Resp(RESP_CODE.ERROR, null, err);
    }
  }

  @IpcInvoke(EVENTS.REMOVE_FAVORITE)
  public async handleRemoveFavorite(
    evt,
    src: string
  ): Promise<HandlerResponse<FavoriteFile>> {
    try {
      const data = await this.favoriteService.removeFavoriteItem(src);
      return Resp(RESP_CODE.OK, data);
    } catch (err) {
      log.error(err);
      return Resp(RESP_CODE.ERROR, null, err);
    }
  }
}