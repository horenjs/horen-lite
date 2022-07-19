import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slices/couter.slice";
import playerStatusSlice from "./slices/player-status.slice";

const store = configureStore({
  reducer: {
    counter: counterSlice,
    playerStatus: playerStatusSlice,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;