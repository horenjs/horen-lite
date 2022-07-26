import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { PlayMode, Track } from "@plugins/player";
import {act} from "react-dom/test-utils";

export const playerStatusSlice = createSlice({
  name: "player-status",
  initialState: {
    queue: [] as Track[],
    current: {} as Track,
    audioList: [] as Track[],
    seek: 0,
    volume: 0,
    prev: 0,
    next: 0,
    isPlaying: true,
    playMode: "in-turn" as PlayMode,
  },
  reducers: {
    setPrev: (state) => {
      state.prev = new Date().valueOf();
    },
    setNext: (state) => {
      state.next = new Date().valueOf();
    },
    setAudioList: (state, action: PayloadAction<Track[]>) => {
      state.audioList = action.payload;
    },
    addToAudioList: (state, action: PayloadAction<Track[]>) => {
      state.audioList = state.audioList.concat(action.payload);
    },
    addToQueue: (state, action: PayloadAction<Track[]>) => {
      state.queue = Array.from(new Set([...state.queue, ...action.payload]));
    },
    setQueue: (state, action: PayloadAction<Track[]>) => {
      state.queue = action.payload;
    },
    setCurrent: (state, action: PayloadAction<Track>) => {
      state.current = action.payload;
    },
    setSeek: (state, action: PayloadAction<number>) => {
      state.seek = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setPlayMode: (state, action: PayloadAction<PlayMode>) => {
      state.playMode = action.payload;
    },
  },
});

export const {
  setPrev,
  setNext,
  addToQueue,
  setQueue,
  setAudioList,
  setCurrent,
  setSeek,
  setIsPlaying,
  setPlayMode,
} = playerStatusSlice.actions;

export const selectAudioList = (state: RootState) =>
  state.playerStatus.audioList;

export const selectQueue = (state: RootState) =>
  state.playerStatus.queue;

export const selectCurrent = (state: RootState) => state.playerStatus.current;

export const selectSeek = (state: RootState) => state.playerStatus.seek;

export const selectVolume = (state: RootState) => state.playerStatus.volume;

export const selectPrev = (state: RootState) => state.playerStatus.prev;

export const selectNext = (state: RootState) => state.playerStatus.next;

export const selectIsPlaying = (state: RootState) =>
  state.playerStatus.isPlaying;

export const selectPlayMode = (state: RootState) => state.playerStatus.playMode;

export default playerStatusSlice.reducer;
