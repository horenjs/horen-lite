import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { closeAllWindows, saveSetting } from "../data-transfer";
import { useSelector } from "react-redux";
import { selectTrack, selectTrackList } from "@store/slices/player-status.slice";
import {Track} from "@plugins/player";

export default function TitleBar() {
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
          saveSetting("lastIndex", lastIdx).then(async () => {
            if (window.confirm("Exit?")) {
              await closeAllWindows();
            }
          });
        })();
      }}>
        <RiCloseFill size={20} />
      </div>
    </div>
  )
}