// i18n
import "@i18n";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/index";
import {selectRefreshMusicLibraryTimeStamp} from "@store/slices/setting.slice";
import React from "react";
import {getMusicFile, getMusicFileList, getSetting, saveMusicFileList} from "../data-transfer";
import {
  setTracks,
  setIsPlaying,
  setPlayMode,
  setTrack
} from "@store/slices/player-status.slice";
import {player} from "./DataManager";
import debug from "@plugins/debug";

const logger = debug("App:Init");

export default function InitApp() {
  const dispatch = useDispatch<AppDispatch>();
  const refreshMusicLibraryTimeStamp = useSelector(
    selectRefreshMusicLibraryTimeStamp
  );

  // 通过生成新的时间戳来指示歌曲库的变动
  // 这是一种取巧的方式，利用了 useEffect 这个 hook 的特性
  React.useEffect(() => {
    (async () => {
      logger("sync all: [autoPlay, playMode, trackList], timestamp: ", refreshMusicLibraryTimeStamp);
      await syncAll();
    })();
  }, [refreshMusicLibraryTimeStamp]);

  const syncAll = async () => {
    await _syncAutoPlay();
    await _syncPlayMode();
    await _syncTrackList();
  }

  const _syncAutoPlay = async () => {
    const res = await getSetting("autoPlay");
    if (res.code === 1) {
      logger("get the setting->autoPlay success: ", res.data);
      player.isAutoPlay = res.data;
      dispatch(setIsPlaying(res.data));
    }
  };

  const _syncPlayMode = async () => {
    const res = await getSetting("playMode");
    if (res.code === 1) {
      logger("get the setting->playMode success: ", res.data);
      player.playMode = res.data;
      dispatch(setPlayMode(res.data));
    }
  };

  const _syncTrackList = async () => {
    const musicLibraryPath = (await getSetting("musicLibraryPath")).data;
    const musicFileList = (await getMusicFileList(musicLibraryPath)).data?.lists;

    if (musicFileList?.length > 0) {
      logger("music file list: ", musicFileList);

      const lastIndex = (await getSetting("lastIndex")).data;
      const lastSeek = (await getSetting("lastSeek")).data;

      const src = musicFileList[lastIndex]?.src;

      const musicFile = (await getMusicFile(src)).data;
      player.load(musicFileList, lastIndex, {seek: lastSeek});
      dispatch(setTracks(musicFileList));
      dispatch(setTrack(musicFile));

      logger("send signal to the main process to save list.")
      const saveResult = await saveMusicFileList(musicLibraryPath, musicFileList);
      logger("save status: ", saveResult);
    }
  };

  return <></>;
}