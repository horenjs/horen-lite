import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

export const settingSlice = createSlice({
  name: "setting",
  initialState: {
    refreshMusicLibraryTimeStamp: 0,
    autoPlay: false,
  },
  reducers: {
    refreshMusicLibrary: (state) => {
      state.refreshMusicLibraryTimeStamp = new Date().valueOf();
    },
  },
});

export const { refreshMusicLibrary } = settingSlice.actions;

export const selectAutoPlay = (state: RootState) => state.setting.autoPlay;

export const selectRefreshMusicLibraryTimeStamp = (state: RootState) => {
  return state.setting.refreshMusicLibraryTimeStamp;
}

export default settingSlice.reducer;
