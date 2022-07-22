// i18n
import "@i18n";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/index";
import {selectRefreshMusicLibraryTimeStamp} from "@store/slices/setting.slice";
import React from "react";
import {getMusicFile, getMusicFileList, getSetting} from "../data-transfer";
import {
  addTracks,
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
    const result = await getSetting("musicLibraryPath");
    if (result.code === 1) {
      logger("get the music library path success: ", result.data);
      // 获取所有音频文件
      const res = await getMusicFileList(result.data);

      if (res.code === 1) {
        logger("get the music file list success: ", res.data.lists);
        const musicFileList = res.data.lists;

        if (musicFileList.length > 0) {
          logger("the music file list is not empty, length: ", musicFileList.length);
          // 获取新的曲库音频文件，并加载第一首到 player 和 store
          const resp = await getSetting("lastIndex");

          if (resp.code === 1) {
            logger("get the setting->lastIndex success: ", resp.data);
            const lastIdx = resp.data;
            // 获取成功，加载到 player 和 store 中
            player.load(musicFileList, lastIdx);
            dispatch(addTracks(musicFileList));

            const r = await getMusicFile(musicFileList[lastIdx]?.src);
            if (r.code === 1) {
              logger("get the music file meta success: ", r.data);
              dispatch(setTrack(r.data));
            } else {
              logger("get the music file meta failed, err: ", r.err);
            }
          } else {
            logger("get the setting->lastIndex failed, err: ", resp.err);
          }
        } else {
          logger("the music file list is empty: ", res.data);
        }
      } else {
        logger("get the music file list failed, err: ", res.err);
      }
    } else {
      logger("get the setting->musicLibraryPath failed, err: ", result.err);
    }
  };

  return <></>;
}