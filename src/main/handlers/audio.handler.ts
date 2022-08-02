import {HandlerResponse, Resp} from "./index";
import Logger from "../utils/logger";
import {EVENTS, RESP_CODE} from "@constant";
import {Handler, IpcInvoke} from "../decorators";
import {AudioService, PureTrack} from "../services/audio.service";

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
   */
  @IpcInvoke(EVENTS.GET_AUDIO_META)
  public async handleGetAudioMeta(
    evt,
    src: string,
  ): Promise<HandlerResponse<AudioMeta>> {
    try {
      const meta = await this.audioService.readMeta(src);
      return Resp(RESP_CODE.OK, meta);
    } catch (err) {
      log.error(err);
      return Resp(RESP_CODE.ERROR, null, err);
    }
  }

  /**
   * get audio list
   */
  @IpcInvoke(EVENTS.GET_AUDIO_LIST)
  public async handleGetAudioList() {
    try {
      const lists = await this.audioService.getAudios();
      return Resp(RESP_CODE.OK, {lists});
    } catch (err) {
      return Resp(RESP_CODE.ERROR, null, err);
    }
  }

  /**
   * save audio list to file.
   * @param evt Ipc Invoke Event.
   * @param paths
   */
  @IpcInvoke(EVENTS.REBUILD_AUDIO_CACHE)
  public async rebuild(evt, paths: string[]) {
    try {
      log.info("rebuild audio cache.");
      await this.audioService.rebuild(paths);
      return Resp(RESP_CODE.OK, null);
    } catch (err) {
      return Resp(RESP_CODE.ERROR, null, err);
    }
  }

  @IpcInvoke(EVENTS.GET_INTACT_QUEUE)
  public async getIntactQueue(evt, pureQueue: PureTrack[], opts?) {
    try {
      log.info("get intact queue");
      const data = await this.audioService.getQueue(pureQueue, opts);
      return Resp(RESP_CODE.OK, data);
    } catch (err) {
      log.error(err);
      return Resp(RESP_CODE.ERROR, null, err);
    }
  }
}
