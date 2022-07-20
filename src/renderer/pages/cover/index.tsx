import React from "react";
import { useTranslation } from "react-i18next";
import { IoIosPause } from "react-icons/io";
import { ImLoop2 } from "react-icons/im";
import { RiMenuAddFill, RiShuffleLine, RiRepeatOneFill, RiOrderPlayLine } from "react-icons/ri";
import { CgPlayTrackPrevO, CgPlayTrackNextO } from "react-icons/cg";
import { FiPlay } from "react-icons/fi";
import Handler, { HandlerItem } from "../../components/handler";
import Slider from "../../components/slider";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import {
  setPrev,
  setNext,
  setPlayMode,
  setIsPlaying,
  selectIsPlaying,
  selectTrack,
  selectSeek, selectPlayMode,
} from "@store/slices/player-status.slice";
import CoverFrame from "@static/cover-frame.png";
import DefaultCover from "@static/default-cover";
import "./style.less";
import {PlayMode} from "@plugins/player";
import { saveSetting } from "../../data-transfer";

export default function PageCover() {
  const { t } = useTranslation();
  const seek = useSelector(selectSeek);
  const track = useSelector(selectTrack);
  const isPlaying = useSelector(selectIsPlaying);
  const playMode = useSelector(selectPlayMode);
  const dispatch = useDispatch<AppDispatch>();

  const percent = Number(
    (track?.duration ? seek / track?.duration : 0).toFixed(3)
  );
  // console.log("seek: ", seek);
  // console.log("percent: ", percent);

  const renderIcon = (m: PlayMode) => {
    let el;
    switch (m) {
    case "random":
      el = <RiShuffleLine size={20} />;
      break;
    case "in-turn":
      el = <RiOrderPlayLine size={19} />;
      break;
    case "in-turn-loop":
      el = <ImLoop2 size={17} />;
      break;
    case "repeat":
      el = <RiRepeatOneFill size={21} />;
      break;
    }
    return el;
  }

  const handlerItems: HandlerItem[] = [
    {
      key: "more-action",
      icon: <RiMenuAddFill size={22} />,
      onClick(key: string | number) {
        console.log("press: ", key);
      },
    },
    {
      key: "prev-track",
      icon: <CgPlayTrackPrevO size={22} />,
      onClick(key: string | number) {
        console.log("press: ", key);
        dispatch(setPrev());
      },
    },
    {
      key: "play-or-pause",
      icon: isPlaying ? <IoIosPause size={26} /> : <FiPlay size={22} />,
      onClick(key: string | number) {
        console.log("press: ", key);
        dispatch(setIsPlaying(!isPlaying));
      },
    },
    {
      key: "next-track",
      icon: <CgPlayTrackNextO size={22} />,
      onClick(key: string | number) {
        console.log("press: ", key);
        dispatch(setNext());
      },
    },
    {
      key: "play-mode",
      icon: renderIcon(playMode),
      onClick(key: string | number) {
        console.log("press: ", key);
        console.log("play mode: ", playMode);
        const playModes: PlayMode[] = [
          "in-turn",
          "in-turn-loop",
          "repeat",
          "random",
        ];
        const idx = playModes.indexOf(playMode);
        let newPlayMode: PlayMode;
        if (idx < playModes.length - 1) {
          newPlayMode = playModes[idx+1];
        } else {
          newPlayMode = playModes[0];
        }
        dispatch(setPlayMode(newPlayMode));
        (async () => {
          await saveSetting("playMode", newPlayMode);
        })();
      },
    },
  ];

  const [items, setItems] = React.useState(handlerItems);
  const [w, setW] = React.useState(0);
  const ref: any = React.useRef();

  React.useEffect(() => {
    setItems(handlerItems);
  }, [isPlaying, playMode]);

  React.useEffect(() => {
    if (ref.current) {
      console.log(ref);
      setW(ref.current.offsetWidth);
    }
  }, [ref?.current]);

  return (
    <div className={"page page-cover"}>
      <div className={"cover"} ref={ref} style={{ height: w }}>
        <img
          className={"cover-album"}
          alt={"cover-album"}
          src={`data:image/png;base64,${track?.picture || DefaultCover}`}
          style={{ height: w }}
        />
        <img
          className={"cover-frame"}
          alt={"cover-frame"}
          src={CoverFrame}
          style={{ height: w }}
        />
      </div>
      <div className={"title"}>
        <span>{track?.title || t("No Title")}</span>
      </div>
      <div className={"artist"}>
        <span>{track?.artist || track?.artists || t("No Artist")}</span>
      </div>
      <div className={"handlers electron-no-drag"}>
        <Handler items={items} />
      </div>
      <div className={"progress"}>
        <Slider percent={percent} />
      </div>
    </div>
  );
}
