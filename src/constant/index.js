/* eslint-disable */
const pack = require("../../package.json");
const path = require("path");

const APP_DATA_PATH = path.join(process.env.APPDATA, pack.name);

const IPC_CODE = {
  getAudioFileMeta: "get-music-file-meta",
  getAudioFileList: "get-music-file-list",
  saveAudioFileList: "save-music-file-list",
  saveAudioFileListMsg: "save-music-file-list-msg",
  saveSetting: "save-setting",
  getSetting: "get-setting",
  getAllSetting: "get-all-setting",
  openDir: "open-dir",
  setTitle: "set-title",
  setProgress: "set-progress",
  closeAllWindows: "close-all-windows",
  getFavorites: "get-favorites",
  addFavorite: "add-favorite",
  remoteFavorite: "remove-favorite",
}

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
module.exports = {
  IPC_CODE,
  DEFAULT_SETTING,
  AUDIO_EXTS,
  APP_DATA_PATH,
}