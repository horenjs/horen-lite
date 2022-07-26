import "./style.less";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsPlaying,
  selectCurrent,
  setCurrent, setQueue,
} from "@store/slices/player-status.slice";
import { Track } from "@plugins/player";
import { getAudioFileList, getSetting } from "../../data";
import { useTranslation } from "react-i18next";
import debug from "@plugins/debug";
import Loading from "@components/loading";

const logger = debug("Page:Audios");

export default function PlayList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const current = useSelector(selectCurrent);
  const [trackListFull, setTrackListFull] = React.useState<Track[]>([]);

  React.useEffect(() => {
    getSetting("musicLibraryPath").then(result => {
      if (result.code === 1) {
        getAudioFileList(result.data).then(res => {
          if (res.code === 1) {
            logger("get the [full] music file list: ", res.data?.lists);
            setTrackListFull(res.data?.lists);
          }
        })
      }
    })
  }, []);

  const handleDoubleClick = (
    e: React.MouseEvent<HTMLDivElement>,
    src: string
  ) => {
    logger("to play the select track: ", src);
    dispatch(setCurrent({src}));
  };

  return (
    <div className={"page page-playlist electron-no-drag perfect-scrollbar"}>
      {trackListFull.length ?
        trackListFull.map((tt: Track, idx) => {
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
              <div
                className={"info"}
                style={{ color: isCurrent && "#71b15f" }}
              >
                <span>{tt.title || t("No Title")}</span>
              </div>
            </div>
          );
        }) : <div className={"loading"}><Loading type={"square"}/></div>
      }
    </div>
  );
}
