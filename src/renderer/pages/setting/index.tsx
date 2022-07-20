import React from "react";
import { useTranslation } from "react-i18next";
import {
  saveSetting,
  getAllSetting,
  openDir,
  getMusicFileListProgress,
} from "../../data-transfer";
import "./style.less";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { refreshMusicLibrary } from "@store/slices/setting.slice";
import Slider from "@components/slider";

export default function SettingPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = React.useState({
    musicLibraryPath: "",
    autoPlay: true,
  });

  const [musicFileListProgress, setMusicFileListProgress] =
    React.useState<number>();

  React.useEffect(() => {
    (async () => {
      const result = await getAllSetting();
      if (result.code === 1) {
        const { musicLibraryPath, autoPlay } = result.data;
        setForm({ musicLibraryPath, autoPlay });
      } else {
        window.alert(result.err);
      }
    })();
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      getMusicFileListProgress().then(([progress, totals]) => {
        const ratio = progress / totals;
        console.log(totals, ratio);
        if (totals >= 10) {
          setMusicFileListProgress(ratio);

          if (totals < 30 && ratio > 0.3) {
            setMusicFileListProgress(undefined);
          } else if (totals < 50 && ratio > 0.75) {
            setMusicFileListProgress(undefined);
          } else if (totals < 100 && ratio > 0.80) {
            setMusicFileListProgress(undefined);
          } else if (totals < 200 && ratio > 0.85) {
            setMusicFileListProgress(undefined);
          } else if (totals < 500 && ratio > 0.92) {
            setMusicFileListProgress(undefined);
          } else if (ratio > 0.98) {
            setMusicFileListProgress(undefined);
          }
        }
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [musicFileListProgress]);

  return (
    <div className={"page page-setting"}>
      <div className={"progress-bar"}>
        {musicFileListProgress ? <Slider percent={musicFileListProgress} /> : ""}
      </div>
      <div className={"setting-item electron-no-drag"}>
        <div className={"item-label"}>
          <span>{t("Music Library Path")}</span>
        </div>
        <div className={"item-content"}>
          <div
            style={{ fontSize: 12, color: "#2483ff", cursor: "pointer", textDecoration: "underline" }}
            onClick={(e) => {
              e.preventDefault();
              (async () => {
                const result = await openDir();
                if (
                  result.code === 1 &&
                  result.data[0] !== form.musicLibraryPath
                ) {
                  setForm({ ...form, musicLibraryPath: result.data[0] });
                  const res = await saveSetting(
                    "musicLibraryPath",
                    result.data[0]
                  );
                  if (res.code === 1) {
                    if (window.confirm(t("Refresh Music Library"))) {
                      dispatch(refreshMusicLibrary());
                    }
                  }
                }
              })();
            }}
          >
            {form.musicLibraryPath || (
              <span>{t("Change Music Library Path")}</span>
            )}
          </div>
        </div>
      </div>
      <div className={"setting-item electron-no-drag"}>
        <div className={"item-label"}>
          <span>{t("Auto Play")}</span>
        </div>
        <div className={"item-content"}>
          <input
            type={"checkbox"}
            checked={form.autoPlay}
            onChange={(e) => {
              // e.preventDefault();
              setForm({ ...form, autoPlay: e.target.checked });
              (async () => await saveSetting("autoPlay", e.target.checked))();
            }}
          />
        </div>
      </div>
    </div>
  );
}
