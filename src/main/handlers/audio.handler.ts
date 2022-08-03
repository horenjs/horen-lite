import {HandlerResponse, Resp} from "./index";
import Logger from "../utils/logger";
import {EVENTS, RESP_CODE} from "@constant";
import {Handler, IpcInvoke} from "../decorators";
import {AudioMeta, AudioService} from "../services/audio.service";

const log = new Logger("handler::audio");

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
  public async handleGetAudioList(evt, libraries: string[], opts) {
    try {
      const lists = await this.audioService.getAudios(libraries, opts);
      return Resp(RESP_CODE.OK, {lists});
    } catch (err) {
      return Resp(RESP_CODE.ERROR, null, err);
    }
  }

  /**
   * save audio list to file.
   * @param evt Ipc Invoke Event.
   * @param libraries libraries paths
   */
  @IpcInvoke(EVENTS.REBUILD_AUDIO_CACHE)
  public async rebuild(evt, libraries: string[]) {
    try {
      log.info("rebuild audio cache.");
      await this.audioService.rebuild(libraries);
      return Resp(RESP_CODE.OK, null);
    } catch (err) {
      console.trace(err);
      log.error(err);
      return Resp(RESP_CODE.ERROR, null, err);
    }
  }

  @IpcInvoke(EVENTS.GET_INTACT_QUEUE)
  public async getIntactQueue(evt, libraries:string[], opts?) {
    try {
      log.info("get intact queue");
      const data = await this.audioService.getQueue(libraries, opts);
      return Resp(RESP_CODE.OK, data);
    } catch (err) {
      log.error(err);
      return Resp(RESP_CODE.ERROR, null, err);
    }
  }
}
