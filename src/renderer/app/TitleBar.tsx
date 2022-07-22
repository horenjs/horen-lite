import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { closeAllWindows, saveSetting } from "../data-transfer";
import { useSelector } from "react-redux";
import {
  selectSeek,
  selectTrack,
  selectTrackList
} from "@store/slices/player-status.slice";
import {Track} from "@plugins/player";
import debug from "@plugins/debug";

const logger = debug("App:TitleBar");

export default function TitleBar() {
  const seek = useSelector(selectSeek);
  const track = useSelector(selectTrack);
  const trackList = useSelector(selectTrackList);

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
      <div className={"close bar-item electron-no-drag"} onClick={e => {
        e.preventDefault();
        (async () => {
          const lastIdx = indexOf(trackList, track);
          saveSetting("seek", seek).then();
          saveSetting("lastIndex", lastIdx).then(async () => {
            logger("save the last index to setting success: ", lastIdx);
            if (window.confirm("Exit?")) {
              logger("try to exit.");
              await closeAllWindows().then(() => {
                logger("exit the app.");
              });
            } else {
              logger("cancel the exit.");
            }
          });
        })();
      }}>
        <RiCloseFill size={20} />
      </div>
    </div>
  )
}