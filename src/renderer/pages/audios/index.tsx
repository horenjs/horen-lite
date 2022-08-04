import "./style.less";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsPlaying,
  selectCurrent,
  selectQueue,
  addToQueue, setQueue, setAudioList, selectAudioList
} from "@store/slices/player-status.slice";
import { RiPlayListAddFill } from "react-icons/ri";
import { MdOutlineDownloadDone } from "react-icons/md";
import { BiAlbum } from "react-icons/bi";
import { TbPlaylistAdd, TbUserCircle } from "react-icons/tb";
import { IoListCircleOutline } from "react-icons/io5";
import { Track } from "@plugins/player";
import { getAudios, getSettingItem } from "../../api";
import { useTranslation } from "react-i18next";
import debug from "@plugins/debug";
import Loading from "@components/loading";
import { player } from "../../app/DataManager";
import {debounce, getLocalItem, setLocalItem} from "../../utils";
import VirtualList from "@components/virtual-list";

const logger = debug("Page:Audios");

export default function PlayList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const current = useSelector(selectCurrent);
  const queue = useSelector(selectQueue);
  const audios = useSelector(selectAudioList);

  const ref = React.useRef<any>();

  const [defaultTop, setT] = React.useState(0);
  const [defaultStart, setS] = React.useState(0);

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

  const handlePlayAll = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(setQueue(audios));
  }

  const _setLocalToTop = () => {
    const toTop = Number(getLocalItem("page-audios-to-top"));
    if (ref?.current) ref.current.scrollTo({top: toTop});
  }

  const handleScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as any;
    const toTop = target.scrollTop;
    debounce(setLocalItem)("page-audios-to-top", toTop);
  }

  React.useEffect(() => {
    getSettingItem("libraries").then(resp => {
      if (resp.code === 1) {
        const libraries = resp.data;
        getAudios(libraries).then((res) => {
          if (res.code === 1) {
            logger("get the audios success.");
            logger(res.data.lists);
            dispatch(setAudioList(res.data.lists));
          }
        });
      }
    });

    _setLocalToTop();

    setS(Number(getLocalItem("page-audios-start")));
    setT(Number(getLocalItem("page-audios-top")));
  }, []);

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
    <div
      className={"page page-audio-list electron-no-drag perfect-scrollbar"}
      onScroll={handleScroll}
      ref={ref}
    >
      <div className={"audio-list"}>
        {audios.length > 0 ? (
          <VirtualList
            defaultStart={defaultStart}
            defaultTop={defaultTop}
            data={audios}
            height={410}
            itemHeight={32}
            render={renderTrackItem}
            onScroll={(e, start, tt) => {
              setLocalItem("page-audios-start", start);
              setLocalItem("page-audios-top", tt);
            }}
          />
        ) : (
          <div className={"loading"}>
            <Loading type={"square"} />
          </div>
        )}
      </div>
      <div className={"bottom-operate"}>
        <div className={"operate-item play-all"} onClick={handlePlayAll}>
          <TbPlaylistAdd size={24} />
          <span>Play All</span>
        </div>
        <div className={"operate-item spacer"}></div>
        <div className={"operate-item"}>
          <IoListCircleOutline size={20} />
        </div>
        <div className={"operate-item"}>
          <TbUserCircle size={20} />
        </div>
        <div className={"operate-item"}>
          <BiAlbum size={20} />
        </div>
      </div>
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
