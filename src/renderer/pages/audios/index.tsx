import "./style.less";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsPlaying,
  selectCurrent,
  selectQueue,
  addToQueue
} from "@store/slices/player-status.slice";
import { RiPlayListAddFill } from "react-icons/ri";
import { MdOutlineDownloadDone } from "react-icons/md";
import { Track } from "@plugins/player";
import { getAudioFileList, getSetting } from "../../data";
import { useTranslation } from "react-i18next";
import debug from "@plugins/debug";
import Loading from "@components/loading";
import { player } from "../../app/DataManager";

const logger = debug("Page:Audios");

export default function PlayList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const current = useSelector(selectCurrent);
  const queue = useSelector(selectQueue);
  const [trackListFull, setTrackListFull] = React.useState<Track[]>([]);

  React.useEffect(() => {
    getSetting("musicLibraryPath").then((result) => {
      if (result.code === 1) {
        getAudioFileList(result.data).then((res) => {
          if (res.code === 1) {
            logger("get the [full] music file list: ", res.data?.lists);
            setTrackListFull(res.data?.lists);
          }
        });
      }
    });
  }, []);

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

  const renderTrackItem = (track: Track, idx: number) => {
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
            <span>{idx + 1}</span>
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
    <div className={"page page-audio-list electron-no-drag perfect-scrollbar"}>
      {trackListFull.length ? (
        trackListFull.map(renderTrackItem)
      ) : (
        <div className={"loading"}>
          <Loading type={"square"} />
        </div>
      )}
    </div>
  );
}

export const queueIndexOf = (queue: Track[], track: Track) => {
  let idx = -1;
  for (let i = 0; i < queue.length; i++) {
    if (queue[i].src === track.src) idx = i;
  }
  return idx;
};
