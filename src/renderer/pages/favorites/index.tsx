import React from "react";
import "./style.less";
import { getFavorites, removeFavorite } from "../../data";
import { Favorite } from "../../../main/handlers/audio.handler";
import { RiHeart3Fill } from "react-icons/ri";
import Loading from "@components/loading";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrent,
  selectIsPlaying,
  setCurrent,
} from "@store/slices/player-status.slice";
import { Track } from "@plugins/player";

export default function PageFavorites() {
  const dispatch = useDispatch();
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

  return (
    <div className={"page page-favorites electron-no-drag perfect-scrollbar"}>
      <div className={"favorites-content"}>
        {favorites &&
          favorites.map((favorite, idx) => {
            const { src, title } = favorite;
            return (
              <div className={"favorite-item"} key={src || idx}>
                <span className={"is-playing"}>
                  {current?.src === src && (
                    <Loading
                      type={"dance"}
                      stop={!isPlaying}
                      color={current?.src === src ? "#71b15f" : "#cacaca"}
                    />
                  )}
                </span>
                <span
                  className={"title"}
                  style={{
                    color: current?.src === src ? "#71b15f" : "#cacaca",
                  }}
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    dispatch(setCurrent({ src }));
                  }}
                >
                  {title}
                </span>
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
                  <RiHeart3Fill fill={"#ec4242"} />
                </span>
              </div>
            );
          })}
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
