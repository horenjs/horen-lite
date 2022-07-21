import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/index";
import {
  selectIsPlaying,
  selectNext, selectPlayMode,
  selectPrev, setSeek, setTrack
} from "@store/slices/player-status.slice";
import React from "react";
import {getMusicFile, setProgress, setTitle} from "../data-transfer";
import Player from "@plugins/player";

export const player = new Player({ autoPlay: true });

export default function DataManager() {
  const dispatch = useDispatch<AppDispatch>();
  const prev = useSelector(selectPrev);
  const next = useSelector(selectNext);
  const isPlaying = useSelector(selectIsPlaying);
  const playMode = useSelector(selectPlayMode);

  // 每隔一秒刷新一次播放进度
  React.useEffect(() => {
    const timer = setInterval(() => {
      dispatch(setSeek(player.seek));
      setProgress(player.seek / player.track?.duration).then();
      if (player.seek >= 0 && player.seek <= 1.5) {
        setTitle(`${player.track.title} - ${player.track.artist}`).then();
        dispatch(setTrack(player.track));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 下一首
  React.useEffect(() => {
    player.next();
    dispatch(setTrack(player.track));
  }, [next]);

  // 上一首
  React.useEffect(() => {
    player.prev();
    dispatch(setTrack(player.track));
  }, [prev]);

  // 切换播放 & 暂停
  React.useEffect(() => {
    player.playOrPause();
  }, [isPlaying]);

  // 切换播放模式
  React.useEffect(() => {
    player.playMode = playMode;
    // console.log("[App] play mode: ", playMode);
  }, [playMode]);

  // 音频变化时，从数据交换中心获取新的音频信息
  // 并写入到 store 和 player
  // 通过音频的地址来判断音频是否变换
  React.useEffect(() => {
    (async () => {
      // console.log("[App] player track ", player.track);
      const res = await getMusicFile(player.track?.src);
      if (res.code === 1) {
        // console.log("[App] current track: ", res.data);
        dispatch(setTrack(res.data));
        player.track = res.data;
      } else {
        console.error(res);
      }
    })();
  }, [player.track?.src]);

  return <></>;
}