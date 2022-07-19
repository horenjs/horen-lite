import React from "react";
import { IoIosPause } from "react-icons/io";
import { RiMenuAddFill, RiShuffleLine } from "react-icons/ri";
import { CgPlayTrackPrevO, CgPlayTrackNextO } from "react-icons/cg";
import { FiPlay } from "react-icons/fi";
import Handler, { HandlerItem } from "../../components/handler";
import Slider from "../../components/slider";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import {
  setPrev,
  setNext,
  setIsPlaying,
  selectIsPlaying,
  selectTrack,
  selectSeek,
} from "../../store/slices/player-status.slice";
import CoverFrame from "../../static/cover-frame.png";
import "./style.less";

export default function PageCover() {
  const seek = useSelector(selectSeek);
  const track = useSelector(selectTrack);
  const isPlaying = useSelector(selectIsPlaying);
  const dispatch = useDispatch<AppDispatch>();

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
      icon: <RiShuffleLine size={20} />,
      onClick(key: string | number) {
        console.log("press: ", key);
        console.log(key);
      },
    },
  ];

  const [items, setItems] = React.useState(handlerItems);

  React.useEffect(() => {
    setItems(handlerItems);
  }, [isPlaying]);

  return (
    <div className={"page-cover"}>
      <div className={"cover"}>
        <img alt={"cover-frame"} src={CoverFrame} />
      </div>
      <div className={"title"}>
        <span>{track?.title  || "No Title"}</span>
      </div>
      <div className={"handlers"}>
        <Handler items={items} />
      </div>
      <div className={"progress"}>
        <Slider percent={track?.duration ? seek / track?.duration : 0} />
      </div>
    </div>
  );
}
