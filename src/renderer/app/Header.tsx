import Footer from "@components/footer";
import React from "react";
import {MdOutlineFavoriteBorder, MdOutlineTextFields} from "react-icons/md";
import {BsMusicNoteList} from "react-icons/bs";
import {BiAlbum} from "react-icons/bi";
import Loading from "@components/loading";
import {RiSettingsLine} from "react-icons/ri";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectIsPlaying} from "@store/slices/player-status.slice";

export default function Header() {
  const navi = useNavigate();
  const isPlaying = useSelector(selectIsPlaying);

  const footerItems = [
    {
      key: "lyric",
      title: "Lyric",
      icon: <MdOutlineTextFields size={24} />,
      onClick(key: string | number) {
        console.log(key);
      },
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
      icon: <Loading type={"dance"} stop={!isPlaying} />,
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

  return (
    <div className={"footer"}>
      <Footer items={footerItems} />
    </div>
  )
}