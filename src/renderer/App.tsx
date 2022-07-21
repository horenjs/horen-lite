import React from "react";
import "./App.less";
// i18n
import "@i18n";
import { Routes, Route, useNavigate } from "react-router-dom";
// icons
import { BsMusicNoteList } from "react-icons/bs";
import { BiAlbum } from "react-icons/bi";
import { MdOutlineFavoriteBorder, MdOutlineTextFields } from "react-icons/md";
import { RiSettingsLine } from "react-icons/ri";
import { IoMdPulse } from "react-icons/io";
// store
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@store/index";
import {
  addTracks,
  setTrack,
  setSeek,
  setIsPlaying,
  selectTrack,
  selectPrev,
  selectNext,
  selectIsPlaying,
  selectPlayMode,
} from "@store/slices/player-status.slice";
import {
  selectRefreshMusicLibraryTimeStamp
} from "@store/slices/setting.slice";
// components
import Footer from "@components/footer";
// pages
import PageCover from "@pages/cover";
import PageSetting from "@pages/setting";
// plugins
import Player from "@plugins/player";
// data transfer
import {
  getSetting,
  getMusicFileList,
  setTitle,
  setProgress
} from "./data-transfer";
// static
import DefaultCover from "@static/default-cover";
// data-transfer
import { getMusicFile } from "./data-transfer";

export const player = new Player({ autoPlay: true });

function App() {
  const navi = useNavigate();

  const footerItems = [
    {
      key: "lyric",
      title: "Lyric",
      icon: <MdOutlineTextFields size={24} />,
      onClick(key: string | number) {
        console.log(key);
      }
    },
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
      icon: <IoMdPulse size={24} />,
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
  const track = useSelector(selectTrack);
  const prev = useSelector(selectPrev);
  const next = useSelector(selectNext);
  const isPlaying = useSelector(selectIsPlaying);
  const playMode = useSelector(selectPlayMode);
  const refreshMusicLibraryTimeStamp =
    useSelector(selectRefreshMusicLibraryTimeStamp);

  React.useEffect(() => {
    (async () => {
      await setIsAutoPlayBoth();
      await setTrackListBoth();
    })();
  }, [refreshMusicLibraryTimeStamp]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      dispatch(setSeek(player.seek));
      setProgress(player.seek / player.track?.duration).then();
      if (player.seek >= 0 && player.seek <= 1.5) {
        setTitle(`${player.track.title} - ${player.track.artist}`).then();
        dispatch(setTrack(player.track));
      }
    }, 1000);
    return () => clearInterval(timer);
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

  React.useEffect(() => {
    player.playMode = playMode;
    // console.log("[App] play mode: ", playMode);
  }, [playMode]);

  React.useEffect(() => {
    (async () => {
      // console.log("[App] player track ", player.track);
      const res = await getMusicFile(player.track?.src);
      if (res.code === 1) {
        // console.log("[App] current track: ", res.data);
        dispatch(setTrack(res.data));
        player.track = res.data;
      } else {
        console.error(res);
      }
    })();
  }, [player.track?.src]);

  const setIsAutoPlayBoth = async () => {
    const res = await getSetting("autoPlay");
    if (res.code === 1) {
      // console.log("set the autoplay");
      player.isAutoPlay = res.data;
      dispatch(setIsPlaying(res.data));
    }
  };

  const setTrackListBoth = async () => {
    const result = await getSetting("musicLibraryPath");
    if (result.code === 1) {
      // console.log("music library path: ", result.data);
      const res = await getMusicFileList(result.data);
      // console.log(res);
      if (res.code === 1) {
        const musicFileList = res.data.lists;
        // console.log("music file list: ", musicFileList);
        if (musicFileList.length > 0) {
          player.load(musicFileList);
          dispatch(addTracks(musicFileList));
          dispatch(setTrack(player.track));
        }
      } else {
        console.error(res.err);
      }
    }
  };

  return (
    <div className="my-app">
      <div
        className={"app-mask electron-drag"}
        style={{
          backgroundImage: `url(data:image/png;base64,${
            track?.picture || DefaultCover
          })`,
        }}
      ></div>
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
