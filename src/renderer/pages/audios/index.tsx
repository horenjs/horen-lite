import "./style.less";
import React from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setQueue,
  setAudioList,
  selectAudioList,
} from "@store/slices/player-status.slice";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { BiAlbum } from "react-icons/bi";
import { TbPlaylistAdd, TbUserCircle } from "react-icons/tb";
import { IoListCircleOutline } from "react-icons/io5";
import { Track } from "@plugins/player";
import { getAudios, getSettingItem } from "../../api";
import debug from "@plugins/debug";
import Favorite from "./favorites";
import Lists from "./lists";

const logger = debug("Page:Audios");

export default function PlayList() {
  const dispatch = useDispatch();
  const navi = useNavigate();
  const audios = useSelector(selectAudioList);

  const handlePlayAll = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(setQueue(audios));
  };
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>, key: string) => {
    e.preventDefault();
    navi(key);
  }

  React.useEffect(() => {
    getSettingItem("libraries").then((resp) => {
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
  }, []);

  return (
    <div className={"page page-audios electron-no-drag no-scrollbar"}>
      <div className={"page-content"}>
        <Routes>
          <Route index element={<Navigate to={"lists"} />} />
          <Route path={"lists"} element={<Lists />} />
          <Route path={"favorite"} element={<Favorite />} />
        </Routes>
      </div>
      <div className={"bottom-operate"}>
        <div className={"operate-item play-all"} onClick={handlePlayAll}>
          <TbPlaylistAdd size={24} />
          <span>Play All</span>
        </div>
        <div className={"operate-item spacer"}></div>
        <div
          className={"operate-item"}
          onClick={(e) => handleClick(e, "lists")}
        >
          <IoListCircleOutline size={20} />
        </div>
        <div
          className={"operate-item"}
          onClick={(e) => handleClick(e, "artist")}
        >
          <TbUserCircle size={20} />
        </div>
        <div
          className={"operate-item"}
          onClick={(e) => handleClick(e, "album")}
        >
          <BiAlbum size={20} />
        </div>
        <div
          className={"operate-item"}
          onClick={(e) => handleClick(e, "favorite")}
        >
          <MdOutlineFavoriteBorder size={20} />
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
