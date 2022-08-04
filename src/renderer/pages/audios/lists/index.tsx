import VirtualList from "@components/virtual-list";
import Loading from "@components/loading";
import React from "react";
import {Track} from "@plugins/player";
import {MdOutlineDownloadDone} from "react-icons/md";
import {RiPlayListAddFill} from "react-icons/ri";
import {queueIndexOf} from "@pages/audios";
import {useDispatch, useSelector} from "react-redux";
import {
  addToQueue, selectAudioList,
  selectCurrent,
  selectIsPlaying, selectQueue
} from "@store/slices/player-status.slice";
import {player} from "../../../app/DataManager";
import debug from "@plugins/debug";
import {useTranslation} from "react-i18next";
import "./style.less";

const logger = debug("Page:Audios:List");

export default function AudioList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const queue = useSelector(selectQueue);
  const isPlaying = useSelector(selectIsPlaying);
  const current = useSelector(selectCurrent);
  const audios = useSelector(selectAudioList);

  const handleDoubleClick = (
    e: React.MouseEvent<HTMLDivElement>,
    src: string
  ) => {
    logger("to play the select track: ", src);
    player.track = { src };
  };

  const handleAddTo = (e: React.MouseEvent<HTMLDivElement>, t: Track) => {
    e.preventDefault();
    logger("add to queue: ", t?.src);
    if (queueIndexOf(queue, t) < 0) {
      dispatch(addToQueue([t]));
    }
  }

  const renderTrackItem = (track: Track, idx: number, start: number) => {
    const isCurrent = current.src === track.src;
    return (
      <div
        className={"audio-list-item"}
        key={track.src || idx}
        data-src={track.src || idx}
        onDoubleClick={(e) => handleDoubleClick(e, track.src)}
      >
        <div className={"index"}>
          {isCurrent ? (
            <Loading scale={0.8} stop={!isPlaying} color={"#71b15f"} />
          ) : (
            <span>{start + idx + 1}</span>
          )}
        </div>
        <div className={"info"} style={{ color: isCurrent && "#71b15f" }}>
          <span>{track.title || t("No Title")}</span>
        </div>
        <div className={"more-actions"}>
          <div className={"add-to"} onClick={e => handleAddTo(e, track)}>
            {queueIndexOf(queue, track) > -1 ? (
              <MdOutlineDownloadDone size={19} />
            ) : (
              <RiPlayListAddFill size={19} title={"add to queue"} />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={"audios-list no-scrollbar"}>
      {audios.length > 0 ? (
        <VirtualList
          data={audios}
          height={410}
          itemHeight={32}
          render={renderTrackItem}
        />
      ) : (
        <div className={"loading"}>
          <Loading type={"square"} />
        </div>
      )}
    </div>
  )
}