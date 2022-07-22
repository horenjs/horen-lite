import "./style.less";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsPlaying,
  selectTrack,
  selectTrackList,
  setTrack,
} from "@store/slices/player-status.slice";
import { Track } from "@plugins/player";
import { getMusicFile } from "../../data-transfer";
import { useTranslation } from "react-i18next";
import debug from "@plugins/debug";
import Loading from "@components/loading";

const logger = debug("Page:PlayList");

export default function PlayList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const track = useSelector(selectTrack);
  const trackList: Track[] = useSelector(selectTrackList);
  const [trackListMore, setTrackListMore] = React.useState<Track[]>([]);

  const lists = [];

  React.useEffect(() => {
    const tmp = trackList;
    for (const track of tmp) {
      (async () => {
        const meta = (await getMusicFile(track.src)).data;
        lists.push(meta);
        if (tmp.length === lists.length) {
          setTrackListMore(lists);
        }
      })();
    }
  }, []);

  const handleDoubleClick = (
    e: React.MouseEvent<HTMLDivElement>,
    src: string
  ) => {
    // e.preventDefault();
    logger("double click: ", src);
    dispatch(setTrack({ src }));
  };

  return (
    <div className={"page-playlist electron-no-drag perfect-scrollbar"}>
      {trackListMore &&
        trackListMore.map((tt: Track, idx) => {
          const isCurrent = track.src === tt.src;
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
        })}
    </div>
  );
}
