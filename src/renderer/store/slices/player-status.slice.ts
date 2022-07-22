import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { PlayMode, Track } from "@plugins/player";

export const playerStatusSlice = createSlice({
  name: "player-status",
  initialState: {
    trackList: [],
    track: {} as Track,
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
    addTracks: (state, action: PayloadAction<Track[]>) => {
      state.trackList = state.trackList.concat(action.payload);
    },
    setTracks: (state, action: PayloadAction<Track[]>) => {
      state.trackList = action.payload;
    },
    setTrack: (state, action: PayloadAction<Track>) => {
      state.track = action.payload;
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
  addTracks,
  setTracks,
  setTrack,
  setSeek,
  setIsPlaying,
  setPlayMode,
} = playerStatusSlice.actions;

export const selectTrackList = (state: RootState) =>
  state.playerStatus.trackList;

export const selectTrack = (state: RootState) => state.playerStatus.track;

export const selectSeek = (state: RootState) => state.playerStatus.seek;

export const selectVolume = (state: RootState) => state.playerStatus.volume;

export const selectPrev = (state: RootState) => state.playerStatus.prev;

export const selectNext = (state: RootState) => state.playerStatus.next;

export const selectIsPlaying = (state: RootState) =>
  state.playerStatus.isPlaying;

export const selectPlayMode = (state: RootState) => state.playerStatus.playMode;

export default playerStatusSlice.reducer;
