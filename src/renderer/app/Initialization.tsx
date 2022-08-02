// i18n
import "@i18n";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@store/index";
import React from "react";
import {getSettingItem, getIntactQueue} from "../api";
import {
  setIsPlaying,
  setPlayMode, setQueue,
} from "@store/slices/player-status.slice";
import {player} from "./DataManager";
import debug from "@plugins/debug";

const logger = debug("App:Init");

export default function InitApp() {
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    _syncAutoPlay().then();
    _syncPlayMode().then();
    _syncQueue().then();
  }, []);

  const _syncAutoPlay = async () => {
    const res = await getSettingItem("autoPlay");
    if (res.code === 1) {
      logger("get the setting->autoPlay success: ", res.data);
      player.isAutoPlay = res.data;
      dispatch(setIsPlaying(res.data));
    }
  };

  const _syncPlayMode = async () => {
    const res = await getSettingItem("playMode");
    if (res.code === 1) {
      logger("get the setting->playMode success: ", res.data);
      player.playMode = res.data;
      dispatch(setPlayMode(res.data));
    }
  };

  const _syncQueue = async () => {
    const res = await getSettingItem("queue");

    const lastIdx = (await getSettingItem("lastIndex")).data;
    const lastSeek = (await getSettingItem("lastSeek")).data;

    if (res.code === 1) {
      logger("get the pure queue success");
      const sources = res.data;
      if (sources?.length) {
        const resp = await getIntactQueue(sources);
        if (resp.code === 1) {
          const intactQueue = resp.data;
          dispatch(setQueue(intactQueue));
          player.track = intactQueue[lastIdx];
          player.seek = lastSeek;
        }
      }
    }
  }

  return <></>;
}