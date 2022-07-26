import Footer from "@components/footer";
import React from "react";
import { MdOutlineFavoriteBorder, MdOutlineTextFields } from "react-icons/md";
import { BsMusicNoteList } from "react-icons/bs";
import { MdFormatListBulleted } from "react-icons/md";
import Loading from "@components/loading";
import { RiSettingsLine } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsPlaying } from "@store/slices/player-status.slice";
import debug from "@plugins/debug";

const logger = debug("App:Header");

export default function Header() {
  const navi = useNavigate();
  const location = useLocation();
  const isPlaying = useSelector(selectIsPlaying);

  const isCurrentRoute = (p: string) => {
    return p === location.pathname;
  };

  const footerItems = [
    {
      key: "audio-list",
      title: "Audios",
      icon: (
        <MdFormatListBulleted
          size={25}
          color={isCurrentRoute("/audios") && "#71b15f"}
        />
      ),
      onClick: function (key: string | number) {
        logger("click: ", key);
        navi("/audios");
      },
    },
    {
      key: "Queue",
      title: "Play Queue",
      icon: (
        <BsMusicNoteList
          size={22}
          color={isCurrentRoute("/queue") && "#71b15f"}
        />
      ),
      onClick: function (key: string | number) {
        logger("click: ", key);
        navi("/queue");
      },
    },
    {
      key: "playing",
      title: "Playing",
      icon: (
        <Loading
          type={"dance"}
          stop={!isPlaying}
          color={isCurrentRoute("/playing") ? "#71b15f" : "#f6f6f6"}
        />
      ),
      onClick: function (key: string | number) {
        logger("click: ", key);
        navi("/playing");
      },
    },
    {
      key: "lyric",
      title: "Lyric",
      icon: (
        <MdOutlineTextFields
          size={24}
          color={isCurrentRoute("/lyric") && "#71b15f"}
        />
      ),
      onClick(key: string | number) {
        logger("click: ", key);
        navi("/lyric");
      },
    },
    {
      key: "favorites",
      title: "Favorites",
      icon: (
        <MdOutlineFavoriteBorder
          size={26}
          color={isCurrentRoute("/favorites") && "#71b15f"}
        />
      ),
      onClick(key: string | number) {
        logger("click: ", key);
        navi("favorites");
      },
    },
    {
      key: "setting",
      title: "Setting",
      icon: (
        <RiSettingsLine
          size={24}
          color={isCurrentRoute("/setting") && "#71b15f"}
        />
      ),
      onClick(key: string | number) {
        logger("click: ", key);
        navi("/setting");
      },
    },
  ];

  return (
    <div className={"footer"}>
      <Footer items={footerItems} />
    </div>
  );
}
