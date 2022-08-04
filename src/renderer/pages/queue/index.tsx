import "./style.less";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  selectIsPlaying,
  selectCurrent, selectQueue, setQueue
} from "@store/slices/player-status.slice";
import { Track } from "@plugins/player";
import { useTranslation } from "react-i18next";
import { IoMdClose } from "react-icons/io";
import { MdOutlineVerticalAlignTop } from "react-icons/md";
import debug from "@plugins/debug";
import Loading from "@components/loading";
import {player} from "../../app/DataManager";
import {queueIndexOf} from "@pages/audios";

const logger = debug("Page:PlayList");

export default function PlayQueue() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const current = useSelector(selectCurrent);
  const queue = useSelector(selectQueue);

  const handleDoubleClick = (
    e: React.MouseEvent<HTMLDivElement>,
    src: string
  ) => {
    // e.preventDefault();
    logger("double click: ", src);
    // dispatch(setTrack({ src }));
    logger("to play the select track: ", src);
    player.track = {src};
  };

  const handleRemove = (e: React.MouseEvent<HTMLDivElement>, t: Track) => {
    const idx = queueIndexOf(queue, t);
    const q = [...queue];
    q.splice(idx, 1);
    dispatch(setQueue(q));
  }

  const handleInsert = (e: React.MouseEvent<HTMLDivElement>, t: Track) => {
    const idx = queueIndexOf(queue, t);
    const q = [...queue];
    q.splice(idx, 1);
    dispatch(setQueue([t, ...q.slice(0)]))
  }

  return (
    <div
      className={"page page-playlist electron-no-drag perfect-scrollbar"}
    >
      {queue?.length ?
        queue.map((tt: Track, idx) => {
          const isCurrent = current.src === tt.src;
          return (
            <div
              className={"playlist-item"}
              key={tt.src || idx}
              data-src={tt.src || idx}
              onDoubleClick={(e) => handleDoubleClick(e, tt.src)}
            >
              <div className={"index"}>
                {isCurrent ? (
                  <Loading scale={0.8} stop={!isPlaying} color={"#71b15f"} />
                ) : (
                  idx + 1
                )}
              </div>
              <div className={"info"} style={{ color: isCurrent && "#71b15f" }}>
                <span>{tt.title || t("No Title")}</span>
              </div>
              {idx > 0 && (
                <div
                  className={"insert-to-top"}
                  onClick={(e) => handleInsert(e, tt)}
                >
                  <MdOutlineVerticalAlignTop size={18} />
                </div>
              )}
              <div className={"remove"} onClick={(e) => handleRemove(e, tt)}>
                <IoMdClose fill={"#df3636"} size={18} />
              </div>
            </div>
          );
        }) : <div className={"loading"}><Loading type={"square"}/></div>
      }
    </div>
  );
}
