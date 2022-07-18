import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BsListNested } from "react-icons/bs";
import { BiPulse } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import { MdAlbum } from "react-icons/md";
import Footer from "./components/footer";
import PageCover from "./pages/cover";
import Player from "./plugins/player";
import { getMusicFileList } from "./date-center";
import "./App.less";

export const player = new Player();

function App() {
  const footerItems = [
    {
      key: "playlist",
      title: "Play List",
      icon: <BsListNested size={28} />,
      onClick: function (key: string | number) {
        console.log(key);
      },
    },
    {
      key: "playing",
      title: "Playing",
      icon: <BiPulse size={32} />,
      onClick: function (key: string | number) {
        console.log(key);
      },
    },
    {
      key: "albums",
      title: "Albums",
      icon: <MdAlbum size={28} />,
      onClick: function (key: string | number) {
        console.log(key);
      },
    },
    {
      key: "favorite",
      title: "Favorite",
      icon: <FaHeart size={24} />,
      onClick(key: string | number) {
        console.log(key);
      }
    }
  ];

  const [itemKey, setItemKey] = React.useState("");

  React.useEffect(() => {
    (async() => {
      const musicFileList = await getMusicFileList();
      console.log(musicFileList);
      player.load(musicFileList);
    })();
  }, [])

  return (
    <div className="my-app" style={{ textAlign: "center" }}>
      <div className={"footer"}>
        <Footer items={footerItems} />
      </div>
      <div className={"main"}>
        <BrowserRouter>
          <Routes>
            <Route element={<PageCover />} index />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
