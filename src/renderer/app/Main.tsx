import {Route, Routes} from "react-router-dom";
import PageCover from "@pages/cover";
import PageSetting from "@pages/setting";
import PagePlayList from "@pages/playlist";
import PageLyric from "@pages/lyric";
import React from "react";

export default function Main() {
  return (
    <div className={"main"}>
      <Routes>
        <Route element={<PageCover />} index />
        <Route element={<PageSetting />} path={"/setting"} />
        <Route element={<PagePlayList />} path={"/playlist"} />
        <Route element={<PageLyric />} path={"/lyric"} />
      </Routes>
    </div>
  )
}