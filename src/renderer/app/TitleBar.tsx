import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { closeAllWindows, saveSettingItem } from "../api";
import { useSelector } from "react-redux";
import {
  selectSeek,
  selectCurrent,
  selectQueue
} from "@store/slices/player-status.slice";
import {Track} from "@plugins/player";
import debug from "@plugins/debug";
import {useTranslation} from "react-i18next";
import {selectTitleKey} from "@store/slices/global.slice";

const logger = debug("App:TitleBar");

export default function TitleBar() {
  const { t } = useTranslation();
  const seek = useSelector(selectSeek);
  const titleKey = useSelector(selectTitleKey);
  const current = useSelector(selectCurrent);
  const trackList = useSelector(selectQueue);

  const indexOf = (items: Track[], item: Track) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].src === item.src) {
        return i;
      }
    }
    return 0;
  }

  return (
    <div className={"title-bar"}>
      <div className={"title"}>
        <span>{titleKey}</span>
      </div>
      <div className={"close bar-item electron-no-drag"} onClick={e => {
        e.preventDefault();
        (async () => {
          saveSettingItem("lastSeek", seek).then();

          const lastIdx = indexOf(trackList, current);
          logger("track list: ", trackList);
          logger("track: ", current);
          logger("save the last index to setting:", lastIdx);
          saveSettingItem("lastIndex", lastIdx).then();

          if (window.confirm(t("Confirm Exit"))) {
            logger("try to exit.");
            await closeAllWindows().then(() => {
              logger("exit the app.");
            });
          } else {
            logger("cancel the exit.");
          }

        })();
      }}>
        <RiCloseFill size={20} />
      </div>
    </div>
  )
}