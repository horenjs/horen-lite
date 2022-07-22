import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/index";
import {
  selectIsPlaying,
  selectNext, selectPlayMode,
  selectPrev, selectSeek, selectTrack, setIsPlaying, setSeek, setTrack
} from "@store/slices/player-status.slice";
import React from "react";
import {getMusicFile, setProgress, setTitle} from "../data-transfer";
import Player from "@plugins/player";
import debug from "@plugins/debug";

const logger = debug("App:DataManager");

export const player = new Player();

export default function DataManager() {
  const dispatch = useDispatch<AppDispatch>();
  const seek = useSelector(selectSeek);
  const prev = useSelector(selectPrev);
  const next = useSelector(selectNext);
  const track = useSelector(selectTrack);
  const isPlaying = useSelector(selectIsPlaying);
  const playMode = useSelector(selectPlayMode);

  // 每隔一秒刷新一次播放进度
  React.useEffect(() => {
    const timer = setInterval(() => {
      dispatch(setSeek(player.seek));
    }, 1000);

    // send progress to the status bar here
    // because the progress should update per 1 second
    setProgress(seek / track?.duration).then();

    return () => clearInterval(timer);
  }, [seek]);

  // 下一首
  React.useEffect(() => {
    logger("skip to the next, timestamp: ", next);
    player.next();
    // if the current track is paused, set it to playing.
    // that means you will change the playing status
    // when you click prev or next button.
    dispatch(setIsPlaying(true));
  }, [next]);

  // 上一首
  React.useEffect(() => {
    logger("skip to the prev, timestamp: ", prev);
    player.prev();
    // if the current track is paused, set it to playing.
    // just like clicking the next button.
    dispatch(setIsPlaying(true));
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

  // 音频变化时，从数据交换中心获取新的音频信息
  // 并写入到 store 和 player
  // 判断方式：音频地址的变化
  React.useEffect(() => {
    // set the title to the progress bar here
    // because the title only change when track is changing.
    setTitle(`${track?.title} - ${track?.artist}`).then();
    (async () => {
      const res = await getMusicFile(player.track?.src);
      if (res.code === 1) {
        logger("get the music file meta success: ", res.data.src);
        logger("set the track: ", res.data);
        dispatch(setTrack(res.data));
      } else {
        logger("get the music file meta failed, err: ", res.err);
      }
    })();
  }, [player.track?.src]);

  return <></>;
}