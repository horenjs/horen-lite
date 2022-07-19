import React from "react";
import "./i18n";
import { Routes, Route, useNavigate } from "react-router-dom";
import { BsMusicNoteList } from "react-icons/bs";
import { CgMusic } from "react-icons/cg";
import { BiAlbum } from "react-icons/bi";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { RiSettingsLine } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import {
  addTracks,
  setTrack,
  setSeek,
  selectPrev,
  selectNext,
  selectIsPlaying,
} from "./store/slices/player-status.slice";
import { AppDispatch } from "./store";
import Footer from "./components/footer";
// pages
import PageCover from "./pages/cover";
import PageSetting from "./pages/setting";
// plugins
import Player from "./plugins/player";
import { getMusicFileList } from "./date-center";
import "./App.less";
// setting
import { getSetting } from "./date-center";

export const player = new Player({ autoPlay: true });

function App() {
  const navi = useNavigate();

  const footerItems = [
    {
      key: "playlist",
      title: "Play List",
      icon: <BsMusicNoteList size={22} />,
      onClick: function (key: string | number) {
        console.log(key);
      },
    },
    {
      key: "albums",
      title: "Albums",
      icon: <BiAlbum size={25} />,
      onClick: function (key: string | number) {
        console.log(key);
      },
    },
    {
      key: "playing",
      title: "Playing",
      icon: <CgMusic size={23} />,
      onClick: function (key: string | number) {
        navi("/");
      },
    },
    {
      key: "favorite",
      title: "Favorite",
      icon: <MdOutlineFavoriteBorder size={26} />,
      onClick(key: string | number) {
        console.log(key);
      },
    },
    {
      key: "setting",
      title: "Setting",
      icon: <RiSettingsLine size={24} />,
      onClick(key: string | number) {
        console.log(key);
        navi("/setting");
      },
    },
  ];

  const dispatch = useDispatch<AppDispatch>();
  // const trackList = useSelector(selectTrackList);
  const prev = useSelector(selectPrev);
  const next = useSelector(selectNext);
  const isPlaying = useSelector(selectIsPlaying);

  React.useEffect(() => {
    (async () => {
      const result = await getSetting("musicLibraryPath");
      if (result.code === 1) {
        console.log("music library path: ", result.data);
        const musicFileList = await getMusicFileList(result.data);
        console.log("music file list: ", musicFileList);
        if (musicFileList.length > 0) {
          player.load(musicFileList);
          dispatch(addTracks(musicFileList));
          dispatch(setTrack(player.track));
        }
      }
    })();
  }, []);

  React.useEffect(() => {
    setInterval(() => {
      dispatch(setSeek(player.seek));
    }, 1000);
  }, []);

  React.useEffect(() => {
    player.next();
    dispatch(setTrack(player.track));
  }, [next]);

  React.useEffect(() => {
    player.prev();
    dispatch(setTrack(player.track));
  }, [prev]);

  React.useEffect(() => {
    player.playOrPause();
  }, [isPlaying]);

  return (
    <div className="my-app">
      <div className={"footer"}>
        <Footer items={footerItems} />
      </div>
      <div className={"main"}>
        <Routes>
          <Route element={<PageCover />} index />
          <Route element={<PageSetting />} path={"/setting"} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
