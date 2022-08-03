import {HandlerResponse, Resp} from "./index";
import {EVENTS, RESP_CODE} from "@constant";
import {Handler, IpcInvoke} from "../decorators";
import Logger from "../utils/logger";
import {Favorite, FavoriteService} from "../services/favorite.service";

const log = new Logger("handler::favorite");

@Handler()
export class FavoriteHandler {
  constructor(private favoriteService: FavoriteService) {
    // do nothing;
  }

  @IpcInvoke(EVENTS.GET_FAVORITES)
  public async handleGetFavorites(): Promise<HandlerResponse<Favorite[]>> {
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
  ): Promise<HandlerResponse<void>> {
    try {
      await this.favoriteService.addFavoriteItem(src);
      return Resp(RESP_CODE.OK, null);
    } catch (err) {
      log.error(err);
      return Resp(RESP_CODE.ERROR, null, err);
    }
  }

  @IpcInvoke(EVENTS.REMOVE_FAVORITE)
  public async handleRemoveFavorite(
    evt,
    src: string
  ): Promise<HandlerResponse<void>> {
    try {
      await this.favoriteService.removeFavoriteItem(src);
      return Resp(RESP_CODE.OK, null);
    } catch (err) {
      log.error(err);
      return Resp(RESP_CODE.ERROR, null, err);
    }
  }
}