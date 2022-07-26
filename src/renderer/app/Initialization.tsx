// i18n
import "@i18n";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@store/index";
import React from "react";
import {getSetting} from "../data";
import {
  setIsPlaying,
  setPlayMode,
} from "@store/slices/player-status.slice";
import {player} from "./DataManager";
import debug from "@plugins/debug";

const logger = debug("App:Init");

export default function InitApp() {
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    _syncAutoPlay().then();
    _syncPlayMode().then();
  }, []);

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

  return <></>;
}