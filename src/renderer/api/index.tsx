export const {
  addFavoriteItem,
  removeFavoriteItem,
  getFavorites,
  rebuild,
  rebuildMsg,
  getAudios,
  getAudioMeta,
  getIntactQueue,
  // main window
  closeAllWindows,
  setTitle,
  setProgress,
  openDir,
  // setting
  getAllSettingItems,
  getSettingItem,
  saveSettingItem,
  //
  minimizeMainWindow,
} = window.ipc;
