import React from "react";
import { useTranslation } from "react-i18next";
import { IoIosPause } from "react-icons/io";
import { ImLoop2 } from "react-icons/im";
import {
  RiMenuAddFill,
  RiShuffleLine,
  RiRepeatOneFill,
  RiOrderPlayLine,
  RiHeart3Line,
  RiHeart3Fill
} from "react-icons/ri";
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
  selectSeek,
  selectPlayMode,
} from "@store/slices/player-status.slice";
import CoverFrame from "@static/cover-frame";
import DefaultCover from "@static/default-cover";
import "./style.less";
import { PlayMode } from "@plugins/player";
import debug from "@plugins/debug";
import { saveSetting, getFavorites, addFavorite, removeFavorite } from "../../data";

const logger = debug("Page:Cover");

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
  };

  const handlerItems: HandlerItem[] = [
    {
      key: "more-action",
      icon: <RiMenuAddFill size={22} />,
      onClick(key: string | number) {
        logger("press: ", key);
      },
    },
    {
      key: "prev-track",
      icon: <CgPlayTrackPrevO size={22} />,
      onClick(key: string | number) {
        logger("press: ", key);
        dispatch(setPrev());
      },
    },
    {
      key: "play-or-pause",
      icon: isPlaying ? <IoIosPause size={26} /> : <FiPlay size={22} />,
      onClick(key: string | number) {
        logger("press: ", key);
        dispatch(setIsPlaying(!isPlaying));
      },
    },
    {
      key: "next-track",
      icon: <CgPlayTrackNextO size={22} />,
      onClick(key: string | number) {
        logger("press: ", key);
        dispatch(setNext());
      },
    },
    {
      key: "play-mode",
      icon: renderIcon(playMode),
      onClick(key: string | number) {
        logger("press: ", key);
        const playModes: PlayMode[] = [
          "in-turn",
          "in-turn-loop",
          "repeat",
          "random",
        ];
        const idx = playModes.indexOf(playMode);
        let newPlayMode: PlayMode;
        if (idx < playModes.length - 1) {
          newPlayMode = playModes[idx + 1];
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
  const [favorites, setFavorites] = React.useState();
  const [isFavorite, setIsFavorite] = React.useState(false);
  const ref: any = React.useRef();

  React.useEffect(() => {
    logger("set the handler items.")
    setItems(handlerItems);
  }, [isPlaying, playMode]);

  React.useEffect(() => {
    if (ref.current) {
      setW(ref.current.offsetWidth);
    }
  }, [ref?.current]);

  React.useEffect(() => {
    getFavorites().then(res => {
      if (res.code === 1) {
        setFavorites(res.data.lists);
        setIsFavorite(favoritesIncludes(res.data.lists, track));
      }
    })
  }, [track?.src]);

  return (
    <div className={"page page-cover"}>
      <div className={"album"}>
        <span>{track?.album}</span>
      </div>
      <div
        className={"cover"}
        ref={ref}
        style={{
          height: w,
          animationPlayState: isPlaying ? "running" : "paused",
        }}
      >
        <img
          className={"cover-album"}
          alt={"cover-album"}
          src={generateCover(track?.picture)}
          style={{ height: w }}
        />
        <img
          className={"cover-frame"}
          alt={"cover-frame"}
          src={CoverFrame}
          style={{ height: w }}
        />
      </div>
      <div className={"title electron-no-drag"}>
        <span>{track?.title || t("No Title")}</span>
        <span className={"add-to-favorite"} onClick={e => {
          e.preventDefault();
          if (!isFavorite) {
            addFavorite(track?.src).then();
            setIsFavorite(true);
          } else {
            removeFavorite(track?.src).then(res => {
              console.log(res);
            });
            setIsFavorite(false);
          }
        }}>
          {isFavorite ? <RiHeart3Fill fill={"#e32c2c"} /> : <RiHeart3Line />}
        </span>
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

function favoritesIncludes(arr: any[], favo: any) {
  if (arr) {
    for (const a of arr) {
      if (a?.src === favo?.src) return true;
    }
  }
  return false;
}

export function generateCover(pic: string) {
  const httpPattern = /https?:\/\/.*/i;
  const filePattern = /file:\/\/\/.*/i;
  if (httpPattern.test(pic)) {
    return pic;
  } else if (filePattern.test(pic)) {
    return pic;
  } else {
    return `data:image/png;base64,${pic || DefaultCover}`;
  }
}
