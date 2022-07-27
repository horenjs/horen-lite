import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slices/setting.slice";
import playerStatusSlice from "./slices/player-status.slice";
import globalSlice from "./slices/global.slice";

const store = configureStore({
  reducer: {
    setting: counterSlice,
    playerStatus: playerStatusSlice,
    global: globalSlice
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;