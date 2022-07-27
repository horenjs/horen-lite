import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export const globalSlice = createSlice({
  name: "global",
  initialState: {
    titleKey: "Playing"
  },
  reducers: {
    setTitleKey: (state, action: PayloadAction<string>) => {
      state.titleKey = action.payload;
    },
  },
});

export const { setTitleKey } = globalSlice.actions;

export const selectTitleKey = (state: RootState) => state.global.titleKey;

export default globalSlice.reducer;
