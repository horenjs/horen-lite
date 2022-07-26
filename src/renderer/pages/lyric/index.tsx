import "./style.less";
import React from "react";
import { useSelector } from "react-redux";
import { selectSeek, selectCurrent } from "@store/slices/player-status.slice";
import lyricParse from "@plugins/lyric-parser";
import { useTranslation } from "react-i18next";

export default function PageLyric() {
  const { t } = useTranslation();
  const current = useSelector(selectCurrent);
  const seek = useSelector(selectSeek);

  const [top, setTop] = React.useState(0);

  const isHit = (sk: number, st: number, en: number) => {
    return sk > st && sk < en;
  };

  return (
    <div className={"page page-lyric electron-no-drag perfect-scrollbar"}>
      <div
        className={"lyric-panel"}
        style={{ transform: `translateY(${-top}px)` }}
      >
        <div className={"spacer"}></div>
        {current?.lyric && lyricParse(current?.lyric).scripts.length ?
          lyricParse(current?.lyric).scripts.map((lyric, idx) => {
            const hit = isHit(seek, lyric.start, lyric.end);
            const color = hit ? "#71b15f" : "#a2a2a2";
            const size = hit ? 18 : 13;
            const margin = hit ? 12 : 8;
            const toTop = idx * 28;

            if (hit) {
              setTimeout(() => {
                setTop(toTop);
              }, 100);
            }

            return (
              <div
                className={"lyric-item"}
                key={lyric.start + idx}
                data-start={lyric.start}
                data-end={lyric.end}
                data-top={toTop}
                style={{ color, fontSize: size, margin: `${margin}px 0` }}
              >
                {lyric.text}
              </div>
            );
          }) : <div className={"no-lyric"}>{t("No Lyric")}</div> }
      </div>
    </div>
  );
}
