export const IPC_CODE = {
  getMusicFile: "get-music-file",
  getMusicFileList: "get-music-file-list",
  saveMusicFileList: "save-music-file-list",
  saveSetting: "save-setting",
  getSetting: "get-setting",
  getAllSetting: "get-all-setting",
  openDir: "open-dir",
  setTitle: "set-title",
  setProgress: "set-progress",
  getMusicFileListProgress: "get-music-file-list-progress",
  closeAllWindows: "close-all-windows",
  saveMusicFileListMsg: "save-music-file-list-msg",
}

export const DEFAULT_SETTING = {
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
export const AUDIO_EXTS = [
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