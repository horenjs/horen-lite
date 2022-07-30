import path from "path";
import * as fse from "fs-extra";
import { HandlerResponse } from "./index";
import Logger from "../utils/logger";
import { EVENTS } from "@constant";
import { Handler, IpcInvoke } from "../decorators";
import { Track } from "@plugins/player";
import { mainWindow } from "../index";
import { AudioService } from "../services/audio.service";

const log = new Logger("handler::audio");

type AudioMeta = Partial<{
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

export type Favorites = {
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
    let meta: AudioMeta;
    if (items) {
      log.debug("try to get audio meta, src: ", src, ", items: ", items.join(", "));
      meta = await this.audioService.readMusicFileMeta(src, items);
    } else {
      log.debug("try to get audio meta, src: ", src);
      meta = await this.audioService.readMusicFileMeta(src);
    }
    return { code: 1, msg: "success", data: meta };
  }

  /**
   * get audio list
   * @param evt Ipc Invoke Event.
   * @param p audio library path.
   */
  @IpcInvoke(EVENTS.GET_AUDIO_LIST)
  public async handleGetAudioList(evt, p: string) {
    log.debug("try to get audio file list from full library file: ", p);
    const audioFileListFull =
      await this.audioService.parseLibraryFile(p, "full");

    if (audioFileListFull?.length > 0) {
      log.debug(
        "get file list from the full library file success, length: ",
        audioFileListFull.length
      );
      return {
        code: 1,
        msg: "success",
        data: { lists: audioFileListFull },
      };
    } else {
      log.debug("get file list from the full library file failed.");
      log.debug("try to get audio list from the short library file.");
      const audioFileListShort =
        await this.audioService.parseLibraryFile(p, "short");
      if (audioFileListShort?.length > 0) {
        log.debug(
          "get file list from the short library file success, length: ",
          audioFileListShort.length
        );
        return {
          code: 1,
          msg: "success",
          data: { lists: audioFileListShort },
        };
      }
    }
    // if library file doesn't exist, rebuild it.
    log.debug("library file doesn't exist, rebuild it.");
    const originFileList = await this.audioService.readFileList(p);

    if (originFileList?.length === 0) {
      log.debug("rebuild from the path: ", p, " failed.");
      return {
        code: 0,
        msg: "failed",
        err: "target path is empty: " + p,
      };
    }

    log.debug("filter the audio file from origin file list.");
    const lists = this.audioService.filterAudioFile(originFileList);
    // save to the library file.
    try {
      log.debug("try to save the audio file list to the file.");
      await fse.writeJSON(this.audioService.getLibraryFilePath(p), lists, {
        spaces: 2,
        encoding: "utf-8",
      });
    } catch (err) {
      log.error("save the library file failed.");
      log.error(err);
    }

    return {
      code: 1,
      msg: "success",
      data: { lists },
    };
  }

  /**
   * save audio list to file.
   * @param evt Ipc Invoke Event.
   * @param p audio library path.
   * @param lists audio list to be saving.
   */
  @IpcInvoke(EVENTS.SAVE_AUDIO_LIST)
  public async handleSaveAudioList(evt, p: string, lists: { src: string }[]) {
    const readAllMeta = async (fileLists: Track[]) => {
      const metas = [];
      for (let i = 0; i < fileLists.length; i++) {
        mainWindow.webContents.send(
          EVENTS.SAVE_AUDIO_LIST_REPLY_MSG.toString(),
          i,
          fileLists.length,
          path.basename(fileLists[i].src)
        );
        const meta = await this.audioService.readMusicFileMeta(
          fileLists[i].src,
          [
            "title",
            "artist",
            "artists",
            "album",
            "genre",
            "date",
            "duration",
            // "picture",
            "lyric",
          ]
        );
        metas.push(meta);
      }
      return metas;
    };

    const filepath = this.audioService.getLibraryFilePath(p, "-full");
    log.info("to read full music library: ", filepath);

    try {
      const stat = await fse.stat(filepath);
      if (stat.isFile()) {
        log.warning("full music library exists.");
        return { code: 1, msg: "full music library exists." };
      }
    } catch (err) {
      log.error("read the full music library path failed.");
    }

    log.info("to get all metas.");
    const metas = await readAllMeta(lists);

    try {
      await fse.writeJSON(filepath, metas, { encoding: "utf-8", spaces: 2 });
      log.info("save the full library success: ", filepath);
      return { code: 1, msg: "success" };
    } catch (err) {
      log.error("save the full library failed");
      return { code: 0, msg: "save the full library failed" };
    }
  }
}

export type { AudioMeta };
