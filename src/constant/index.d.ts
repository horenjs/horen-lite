interface IPC_CODE {
  getAudioFileMeta: string;
  getAudioFileList: string;
  saveAudioFileList: string;
  saveAudioFileListMsg: string;
  saveSetting: string;
  getSetting: string;
  getAllSetting: string;
  openDir: string;
  setTitle: string;
  setProgress: string;
  closeAllWindows: string;
  readonly getFavorites: string;
  addFavorite: string;
  remoteFavorite: string;
}

interface SETTING {
  "promptCN": string;
  "promptEN": string;
  "musicLibraryPath": string;
  "updateAt": number;
  "playMode": string;
  "autoPlay": boolean;
}

/**
 * app data path
 * in windows7 above: %USER_DATA%/[app_name]/
 */
export declare const APP_DATA_PATH: string;
export declare const USER_DATA_PATH: string;
export declare const ALBUM_COVER_PATH: string;
export declare const MUSIC_LIBRARY_PATH: string;
export declare const LOGS_PATH: string;
/**
 * IPC channel code, from main process and preload
 */
export declare const IPC_CODE: IPC_CODE;
/**
 * Default setting
 */
export declare const DEFAULT_SETTING: SETTING;
/**
 * the audio with extname below can be playing.
 */
export declare const AUDIO_EXTS: string[];