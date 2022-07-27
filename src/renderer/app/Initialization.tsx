// i18n
import "@i18n";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@store/index";
import React from "react";
import {getSetting, getAudioFileMeta} from "../data";
import {
  setCurrent,
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

  const _syncQueue = async () => {
    const res = await getSetting("queue");
    const lastIdx = (await getSetting("lastIndex")).data;

    const lastSeek = (await getSetting("lastSeek")).data;

    if (res.code === 1) {
      logger("get the setting-> queue success: ", res.data);
      const queue = res.data;
      if (queue?.length > 0) {
        const newQueue = [];
        for (const q of queue) {
          const resp = await getAudioFileMeta(q?.src, ["title", "src"]);
          console.log(resp);
          if (resp.code === 1) newQueue.push(resp.data);
        }
        if (newQueue.length > 0) {
          dispatch(setQueue(newQueue));
          player.track = newQueue[lastIdx];
          player.seek = lastSeek;
        }
      }
    }
  }

  return <></>;
}