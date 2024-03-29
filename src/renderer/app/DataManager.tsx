import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/index";
import {
  selectIsPlaying,
  selectNext,
  selectPlayMode,
  selectPrev,
  selectSeek,
  selectCurrent,
  setSeek,
  setCurrent,
  addToQueue,
  selectQueue,
  setAudioList
} from "@store/slices/player-status.slice";
import React from "react";
import {
  getAudioMeta,
  getSettingItem,
  rebuild,
  setProgress,
  setTitle,
  getAudios
} from "../api";
import Player from "@plugins/player";
import debug from "@plugins/debug";
import {selectRefreshMusicLibraryTimeStamp} from "@store/slices/setting.slice";

const logger = debug("App:DataManager");

export const player = new Player();

export default function DataManager() {
  const dispatch = useDispatch<AppDispatch>();
  const seek = useSelector(selectSeek);
  const prev = useSelector(selectPrev);
  const next = useSelector(selectNext);
  const current = useSelector(selectCurrent);
  const queue = useSelector(selectQueue);
  const isPlaying = useSelector(selectIsPlaying);
  const playMode = useSelector(selectPlayMode);
  const refreshMusicLibraryTimeStamp = useSelector(
    selectRefreshMusicLibraryTimeStamp
  );

  // 每隔一秒刷新一次播放进度
  React.useEffect(() => {
    const timer = setInterval(() => {
      dispatch(setSeek(player.seek));
    }, 500);

    // send progress to the status bar here
    // because the progress should update per 1 second
    setProgress(seek / current?.duration).then();

    // set the title to the progress bar here
    setTitle(`${current?.title} - ${current?.artist}`).then();

    return () => clearInterval(timer);
  }, [seek]);

  // 通过生成新的时间戳来指示歌曲库的变动
  // 这是一种取巧的方式，利用了 useEffect 这个 hook 的特性
  React.useEffect(() => {
    if (refreshMusicLibraryTimeStamp !== 0) {
      logger("refresh library, timestamp: ", refreshMusicLibraryTimeStamp);
      (async() => {
        const paths = await _refreshLibrary();
        const resp = await getAudios(paths);
        if (resp.code === 1) dispatch(setAudioList(resp.data.lists));
      })();
    }
  }, [refreshMusicLibraryTimeStamp]);

  // 下一首
  React.useEffect(() => {
    logger("is playing: ", isPlaying);
    // its behavior is similar to the prev button.
    player.isAutoPlay = isPlaying;
    logger("skip to the next, timestamp: ", next);
    player.next();
  }, [next]);

  // 上一首
  React.useEffect(() => {
    logger("is playing: ", isPlaying);
    // when you click the prev button
    // the current track is playing determined
    // the track to be playing is to play auto.
    player.isAutoPlay = isPlaying;
    logger("skip to the prev, timestamp: ", prev);
    player.prev();
  }, [prev]);

  // 切换播放 & 暂停
  // switch between playing or paused.
  React.useEffect(() => {
    logger("set the playing: ", isPlaying);
    player.playOrPause();
  }, [isPlaying]);

  // 切换播放模式
  // switch the play mode in [[PlayMode]]
  // the type definition is in the plugins/player.ts
  React.useEffect(() => {
    logger("set the play mode: ", playMode);
    player.playMode = playMode;
  }, [playMode]);

  React.useEffect(() => {
    player.trackList = queue;
  }, [queue?.length]);

  React.useEffect(() => {
    if (player?.track?.src) {
      let exists = false;

      for (const q of queue) {
        if (q.src === player?.track?.src) exists = true;
      }

      getAudioMeta(player?.track?.src).then(res => {
        if (res.code === 1) {
          dispatch(setCurrent(res.data));
          if (!exists) dispatch(addToQueue([res.data]));
        }
      })
    }
  }, [player?.track?.src]);

  const _refreshLibrary = async () => {
    const resp = await getSettingItem("libraries");
    if (resp.code === 1) {
      const paths = resp.data;
      const res = await rebuild(paths);
      logger("rebuild result: ", res);
      return resp.data;
    }
  };

  return <></>;
}