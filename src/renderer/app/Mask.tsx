import React from "react";
import {useSelector} from "react-redux";
import {selectCurrent} from "@store/slices/player-status.slice";
import {generateCover} from "@pages/cover";

export default function Mask() {
  const current = useSelector(selectCurrent);

  return (
    <div
      className={"app-mask electron-drag"}
      style={{
        backgroundImage: `url(${generateCover(current?.picture)})`,
      }}
    ></div>
  )
}