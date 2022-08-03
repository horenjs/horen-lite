import "./style.less";
import React from "react";
import { useSelector } from "react-redux";
import { selectSeek, selectCurrent } from "@store/slices/player-status.slice";
import lyricParse, { LyricScript } from "@plugins/lyric-parser";
import { useTranslation } from "react-i18next";

export default function PageLyric() {
  const { t } = useTranslation();
  const current = useSelector(selectCurrent);
  const seek = useSelector(selectSeek);

  const [lyrics, setLyrics] = React.useState<LyricScript[]>();
  const [isScrolling, setIsScrolling] = React.useState(false);

  // page-lyric reference
  /* eslint-disable */
  const ref = React.useRef<any>();

  /**
   * does seek hit the lyric item
   * @param sk seek
   * @param st start time
   * @param en end time
   */
  const isHit = (sk: number, st: number, en: number) => {
    return sk > st && sk < en;
  };

  // when scroll the lyric panel
  // disable the scroll auto.
  const handleScroll = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsScrolling(true);
    },
    [isScrolling]
  );

  // parse the lyric from current track
  React.useEffect(() => {
    const lyric = current?.lyric;
    if (lyric) {
      const lyricScripts = lyricParse(lyric).scripts;
      setLyrics(lyricScripts);
    }
  }, [current?.src]);

  // recovery the scroll status when seek is changing
  React.useEffect(() => {
    setIsScrolling(false);
  }, [seek]);

  // render the lyric panel item
  const renderLyricItem = React.useCallback((lyric, idx: number) => {
    const hit = isHit(seek, lyric.start, lyric.end);
    const cls = hit ? "lyric-item hit" : "lyric-item";
    const toTop = idx * 28;

    // when hit, scroll the element
    if (hit && !isScrolling) {
      setTimeout(() => {
        ref?.current?.scrollTo({top: toTop, behavior: "smooth"});
      }, 250); // set timeout 250ms for smooth
    }

    return (
      <div className={cls} key={lyric.start + idx}>
        <span>{lyric.text}</span>
      </div>
    );
  }, [seek]); // only render item when seek is changing

  return (
    <div
      className={"page page-lyric electron-no-drag perfect-scrollbar"}
      ref={ref}
      onScroll={handleScroll}
    >
      <div className={"lyric-panel"}>
        <div className={"spacer"}></div>
        {lyrics
          ? lyrics.map(renderLyricItem)
          : <div className={"no-lyric"}>{t("lyric.no-lyric")}</div>
        }
        <div className={"spacer"}></div>
      </div>
    </div>
  );
}
