import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import PageCover from "./pages/cover";
import Player from "./plugins/player";
import { getMusicFileList } from "./date-center";
import "./App.less";

export const player = new Player({autoPlay: true});

function App() {
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
        console.log(key);
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
      }
    }
  ];

  const dispatch = useDispatch<AppDispatch>();
  // const trackList = useSelector(selectTrackList);
  const prev = useSelector(selectPrev);
  const next = useSelector(selectNext);
  const isPlaying = useSelector(selectIsPlaying);

  React.useEffect(() => {
    (async () => {
      const musicFileList = await getMusicFileList();
      console.log(musicFileList);
      if (musicFileList.length > 0) {
        player.load(musicFileList);
        dispatch(addTracks(musicFileList));
        dispatch(setTrack(player.track));
      }
    })();
  }, []);

  React.useEffect(() => {
    setInterval(() => {
      dispatch(setSeek(player.seek))
    }, 500);
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
