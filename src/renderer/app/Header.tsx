import Footer from "@components/footer";
import React from "react";
import {MdOutlineFavoriteBorder, MdOutlineTextFields} from "react-icons/md";
import {BsMusicNoteList} from "react-icons/bs";
import {MdFormatListBulleted} from "react-icons/md";
import Loading from "@components/loading";
import {RiSettingsLine} from "react-icons/ri";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectIsPlaying} from "@store/slices/player-status.slice";
import debug from "@plugins/debug";

const logger = debug("App:Header");

export default function Header() {
  const navi = useNavigate();
  const isPlaying = useSelector(selectIsPlaying);

  const footerItems = [
    {
      key: "lyric",
      title: "Lyric",
      icon: <MdOutlineTextFields size={24} />,
      onClick(key: string | number) {
        logger("click: ", key);
        navi("/lyric");
      },
    },
    {
      key: "Queue",
      title: "Play Queue",
      icon: <BsMusicNoteList size={22} />,
      onClick: function (key: string | number) {
        logger("click: ", key);
        navi("/queue");
      },
    },
    {
      key: "playing",
      title: "Playing",
      icon: <Loading type={"dance"} stop={!isPlaying} />,
      onClick: function (key: string | number) {
        logger("click: ", key);
        navi("/");
      },
    },
    {
      key: "audio-list",
      title: "Audios",
      icon: <MdFormatListBulleted size={25} />,
      onClick: function (key: string | number) {
        logger("click: ", key);
        navi("/audios");
      },
    },
    {
      key: "favorites",
      title: "Favorites",
      icon: <MdOutlineFavoriteBorder size={26} />,
      onClick(key: string | number) {
        logger("click: ", key);
        navi("favorites");
      },
    },
    {
      key: "setting",
      title: "Setting",
      icon: <RiSettingsLine size={24} />,
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
  )
}