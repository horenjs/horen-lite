import {HandlerResponse, Resp} from "./index";
import Logger from "../utils/logger";
import {EVENTS, RESP_CODE} from "@constant";
import {Handler, IpcInvoke} from "../decorators";
import {Track} from "@plugins/player";
import {AudioService} from "../services/audio.service";

const log = new Logger("handler::audio");

export type AudioMeta = Partial<{
  src: string;
  title: string;
  artist: string;
  artists: string | string[];
  album: string;
  genre: string | string[];
  date: string;
  duration: number;
  picture: string;
  lyric: string;
}>;

export type Favorite = AudioMeta & { addAt: string | number };

export type FavoriteFile = {
  updateAt: string | number;
  lists: Favorite[];
};

@Handler()
export class AudioHandler {
  constructor(private audioService: AudioService) {
    // do nothing;
  }

  /**
   * get audio metadata by file path.
   * @param evt Ipc Invoke Event.
   * @param src audio file path.
   * @param items item to be included.
   */
  @IpcInvoke(EVENTS.GET_AUDIO_META)
  public async handleGetAudioMeta(
    evt,
    src: string,
    items?: string[]
  ): Promise<HandlerResponse<AudioMeta>> {
    try {
      const meta = await this.audioService.readMusicFileMeta(src, items);
      return Resp(RESP_CODE.OK, meta);
    } catch (err) {
      log.error(err);
      return Resp(RESP_CODE.ERROR, null, err);
    }
  }

  /**
   * get audio list
   * @param evt Ipc Invoke Event.
   * @param p audio library path.
   */
  @IpcInvoke(EVENTS.GET_AUDIO_LIST)
  public async handleGetAudioList(evt, p: string) {
    try {
      const lists = await this.audioService.getAudioList(p);
      return Resp(RESP_CODE.OK, {lists});
    } catch (err) {
      return Resp(RESP_CODE.ERROR, null, err);
    }
  }

  /**
   * save audio list to file.
   * @param evt Ipc Invoke Event.
   * @param p audio library path.
   * @param lists audio list to be saving.
   */
  @IpcInvoke(EVENTS.SAVE_AUDIO_LIST)
  public async handleSaveAudioList(evt, p: string, lists: Track[]) {
    try {
      await this.audioService.saveLibrary(p, lists);
      return Resp(RESP_CODE.OK, null);
    } catch (err) {
      return Resp(RESP_CODE.ERROR, null, err);
    }
  }
}
