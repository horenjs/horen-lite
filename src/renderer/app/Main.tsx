import {Route, Routes} from "react-router-dom";
import PageCover from "@pages/cover";
import PageSetting from "@pages/setting";
import PageAudios from "@pages/audios";
import PageLyric from "@pages/lyric";
import Favorites from "@pages/favorites";
import PageQueue from "@pages/queue";
import React from "react";

export default function Main() {
  return (
    <div className={"main"}>
      <Routes>
        <Route element={<PageCover />} index />
        <Route element={<PageSetting />} path={"/setting"} />
        <Route element={<PageAudios />} path={"/audios"} />
        <Route element={<PageLyric />} path={"/lyric"} />
        <Route element={<Favorites />} path={"/favorites"} />
        <Route element={<PageQueue />} path={"/queue"} />
      </Routes>
    </div>
  )
}