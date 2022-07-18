import React from "react";
import { MdSkipPrevious, MdPlayArrow, MdSkipNext, MdRepeat } from "react-icons/md";
import { ImPlus } from "react-icons/im";
import Handler, {HandlerItem} from "../../components/handler";
import "./style.less";

export default function PageCover() {
  const handlerItems: HandlerItem[] = [
    {
      key: "more-action",
      icon: <ImPlus size={20} />,
      onClick(key: string | number) {
        console.log(key);
      }
    },
    {
      key: "play-mode",
      icon: <MdRepeat size={26} />,
      onClick(key: string | number) {
        console.log(key);
      }
    },
    {
      key: "prev-track",
      icon: <MdSkipPrevious size={32} />,
      onClick(key: string | number) {
        console.log(key);
      }
    },
    {
      key: "play-or-pause",
      icon: <MdPlayArrow size={32}/>,
      onClick(key: string | number) {
        console.log(key);
      }
    },
    {
      key: "next-track",
      icon: <MdSkipNext size={32} />,
      onClick(key: string | number) {
        console.log(key);
      }
    }
  ]
  return (
    <div className={"page-cover"}>
      <div className={"cover"}></div>
      <div className={"handlers"}>
        <Handler items={handlerItems} />
      </div>
    </div>
  )
}