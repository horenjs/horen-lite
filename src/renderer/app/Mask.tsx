import DefaultCover from "@static/default-cover";
import React from "react";
import {useSelector} from "react-redux";
import {selectTrack} from "@store/slices/player-status.slice";
import {generateCover} from "@pages/cover";

export default function Mask() {
  const track = useSelector(selectTrack);

  return (
    <div
      className={"app-mask electron-drag"}
      style={{
        backgroundImage: `url(${generateCover(track?.picture)})`,
      }}
    ></div>
  )
}