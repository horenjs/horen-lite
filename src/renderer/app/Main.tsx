import {Route, Routes} from "react-router-dom";
import PageCover from "@pages/cover";
import PageSetting from "@pages/setting";
import React from "react";

export default function Main() {
  return (
    <div className={"main"}>
      <Routes>
        <Route element={<PageCover />} index />
        <Route element={<PageSetting />} path={"/setting"} />
      </Routes>
    </div>
  )
}