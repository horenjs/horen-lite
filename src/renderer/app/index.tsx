import React from "react";
import "./style.less";
import Initialization from "./Initialization";
import DataManager from "./DataManager";
import Mask from "./Mask";
import Main from "./Main";
import Header from "./Header";
import TitleBar from "./TitleBar";

export default function App() {
  const MemoHeader = React.memo(Header);
  return (
    <>
      <Initialization />
      <DataManager />
      <div className="app">
        <Mask />
        <TitleBar />
        <MemoHeader />
        <Main />
      </div>
    </>
  );
}
