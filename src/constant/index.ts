import * as fse from "fs-extra";

export enum EVENTS {
  /**
   * audio
   */
  GET_AUDIO_META = 111,
  GET_AUDIO_LIST,
  SAVE_AUDIO_LIST,
  SAVE_AUDIO_LIST_REPLY_MSG,
  /**
   * setting
   */
  SAVE_SETTING_ITEM,
  GET_SETTING_ITEM,
  GET_ALL_SETTINGS,
  /**
   * favorites
   */
  GET_FAVORITES,
  ADD_FAVORITES,
  REMOVE_FAVORITE,
  /**
   * others
   */
  OPEN_DIR,
  SET_TITLE,
  SET_PROGRESS,
  CLOSE_ALL_WINDOWS,
}

export enum RESP_CODE {
  ERROR,
  OK,
}

/* eslint-disable */
const pack = require("../../package.json");
const path = require("path");

const APP_DATA_PATH = path.join(process.env.APPDATA, pack.name);
const LOGS_PATH = path.join(APP_DATA_PATH, "logs");
const USER_DATA_PATH = path.join(APP_DATA_PATH, "UserData");
const ALBUM_COVER_PATH = path.join(USER_DATA_PATH, "AlbumCover");
const MUSIC_LIBRARY_PATH = path.join(USER_DATA_PATH, "MusicLibrary");

(async () => await fse.ensureDir(APP_DATA_PATH))();
(async () => await fse.ensureDir(LOGS_PATH))();
(async () => await fse.ensureDir(USER_DATA_PATH))();
(async () => await fse.ensureDir(ALBUM_COVER_PATH))();
(async () => await fse.ensureDir(MUSIC_LIBRARY_PATH))();

const DEFAULT_SETTING = {
  "promptCN": "请勿修改默认设置",
  "promptEN": "Please don't modify the default setting",
  "musicLibraryPath": "",
  "updateAt": new Date().valueOf(),
  "playMode": "random",
  "autoPlay": true,
}

/**
 * 可以解析的音频文件格式
 */
const AUDIO_EXTS = [
  "aiff",
  "aac",
  "ape",
  "asf",
  "dsdiff",
  "dsf",
  "flac",
  "mp2",
  "mka",
  "mkv",
  "mp3",
  "mpc",
  "mp4",
  "m4a",
  "m4v",
  "ogg",
  "opus",
  "speex",
  "theora",
  "vorbis",
  "wav",
  "webm",
  "wv",
  "wma",
];

// eslint-disable-next-line no-undef
export {
  DEFAULT_SETTING,
  AUDIO_EXTS,
  APP_DATA_PATH,
  LOGS_PATH,
  USER_DATA_PATH,
  ALBUM_COVER_PATH,
  MUSIC_LIBRARY_PATH,
}
