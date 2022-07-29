import React from "react";
import "./style.less";
import { getFavorites, removeFavorite } from "../../api";
import { Favorite } from "../../../main/handlers/audio.handler";
import {RiHeart3Fill, RiPlayListAddFill} from "react-icons/ri";
import Loading from "@components/loading";
import {useDispatch, useSelector} from "react-redux";
import {
  addToQueue,
  selectCurrent,
  selectIsPlaying, selectQueue,
} from "@store/slices/player-status.slice";
import {player} from "../../app/DataManager";
import {MdOutlineDownloadDone} from "react-icons/md";
import {queueIndexOf} from "../audios";
import {Track} from "@plugins/player";

export default function PageFavorites() {
  const dispatch = useDispatch();
  const queue = useSelector(selectQueue);
  const current = useSelector(selectCurrent);
  const isPlaying = useSelector(selectIsPlaying);
  const [favorites, setFavorites] = React.useState<Favorite[]>([]);

  React.useEffect(() => {
    getFavorites().then((res) => {
      if (res.code === 1) {
        setFavorites(res.data.lists);
      }
    });
  }, []);

  const handleAddTo = (e: React.MouseEvent<HTMLDivElement>, t: Track) => {
    e.preventDefault();
    if (queueIndexOf(queue, t) < 0) {
      dispatch(addToQueue([t]));
    }
  }
  
  const renderFavoriteItem = (favorite: Favorite, idx: number) => {
    const {src, title} = favorite;
    return (
      <div className={"favorite-item"} key={src || idx}>
        <span
          className={"add-or-cancel"}
          onClick={(e) => {
            e.preventDefault();
            const i = favoritesIndexOf(favorites, favorite);
            const tmp = [...favorites];
            removeFavorite(src).then();
            tmp.splice(i, 1);
            setFavorites(tmp);
          }}
        >
          <RiHeart3Fill fill={"#ec4242"} size={19}/>
        </span>
        <span
          className={"title"}
          style={{
            color: current?.src === src ? "#71b15f" : "#cacaca",
          }}
          onDoubleClick={(e) => {
            e.preventDefault();
            player.track = {src};
          }}
        >
          {title}
        </span>
        <div className={"add-to-queue"} onClick={e => handleAddTo(e, favorite as Track)}>
          {queueIndexOf(queue, favorite as Track) > -1 ? (
            <MdOutlineDownloadDone size={19} />
          ) : (
            <RiPlayListAddFill size={19} title={"add to queue"} />
          )}
        </div>
        <span className={"is-playing"}>
          {current?.src === src && (
            <Loading
              type={"dance"}
              stop={!isPlaying}
              color={current?.src === src ? "#71b15f" : "#cacaca"}
            />
          )}
        </span>
      </div>
    );
  }

  return (
    <div className={"page page-favorites electron-no-drag perfect-scrollbar"}>
      <div className={"favorites-content"}>
        {favorites && favorites.map(renderFavoriteItem)}
      </div>
    </div>
  );
}

const favoritesIndexOf = (arr, a) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].src === a.src) {
      return i;
    }
  }
};
