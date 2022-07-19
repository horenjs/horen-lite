import React from "react";
import {
  MdSkipPrevious,
  MdPlayArrow,
  MdSkipNext,
  MdRepeat,
} from "react-icons/md";
import { GiPauseButton } from "react-icons/gi";
import { ImPlus } from "react-icons/im";
import Handler, { HandlerItem } from "../../components/handler";
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
import "./style.less";

export default function PageCover() {
  const seek = useSelector(selectSeek);
  const track = useSelector(selectTrack);
  const isPlaying = useSelector(selectIsPlaying);
  const dispatch = useDispatch<AppDispatch>();

  const handlerItems: HandlerItem[] = [
    {
      key: "more-action",
      icon: <ImPlus size={20} />,
      onClick(key: string | number) {
        console.log("press: ", key);
      },
    },
    {
      key: "prev-track",
      icon: <MdSkipPrevious size={32} />,
      onClick(key: string | number) {
        console.log("press: ", key);
        dispatch(setPrev());
      },
    },
    {
      key: "play-or-pause",
      icon: isPlaying ? <MdPlayArrow size={32} /> : <GiPauseButton size={24} />,
      onClick(key: string | number) {
        console.log("press: ", key);
        dispatch(setIsPlaying(!isPlaying));
      },
    },
    {
      key: "next-track",
      icon: <MdSkipNext size={32} />,
      onClick(key: string | number) {
        console.log("press: ", key);
        dispatch(setNext())
      },
    },
    {
      key: "play-mode",
      icon: <MdRepeat size={26} />,
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
      <div className={"cover"}></div>
      <div className={"title"}>
        <span>{ track?.duration ? seek / track?.duration : 0 }</span>
        <span>{ track?.title }</span>
      </div>
      <div className={"handlers"}>
        <Handler items={items} />
      </div>
    </div>
  );
}
