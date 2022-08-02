import React from "react";
import { useTranslation } from "react-i18next";
import {
  saveSettingItem,
  getAllSettingItems,
  openDir,
  rebuildMsg,
} from "../../api";
import { RiRefreshLine } from "react-icons/ri";
import "./style.less";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { refreshMusicLibrary } from "@store/slices/setting.slice";
import debug from "@plugins/debug";
import Slider from "@components/slider";

const logger = debug("Page:Setting");

export default function SettingPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [progressIdx, setProgressIdx] = React.useState(0);
  const [progressSrc, setProgressSrc] = React.useState("");
  const [totals, setTotals] = React.useState(1);
  const [isSlider, setIsSlider] = React.useState(false);

  const [form, setForm] = React.useState({
    musicLibraryPath: "",
    autoPlay: true,
    language: "Chinese",
  });

  React.useEffect(() => {
    (async () => {
      logger("try to get all setting.");
      const result = await getAllSettingItems();
      if (result.code === 1) {
        logger("get all setting success: ", result.data);
        const { musicLibraryPath, autoPlay, language } = result.data;
        setForm({ musicLibraryPath, autoPlay, language });
      } else {
        window.alert(result.err);
      }
    })();
  }, []);

  React.useEffect(() => {
    rebuildMsg().then((result: [number, number, string]) => {
      logger("save progress: ", result);
      setProgressIdx(result[0]);
      setProgressSrc(result[2]);
      setTotals(result[1]);
      setIsSlider((result[1] - result[0]) > 3);
    });
  }, [progressIdx]);

  const handleChangeLibrary = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    (async () => {
      const result = await openDir();
      if (result.code === 1 && result.data[0] !== form.musicLibraryPath) {
        logger("new music library path: ", result.data[0]);

        if (isSlider) {
          window.alert(t("Dont Change Music Library When Saving"));
        } else {
          setForm({ ...form, musicLibraryPath: result.data[0] });
          const res = await saveSettingItem("musicLibraryPath", result.data[0]);
          if (res.code === 1) {
            if (window.confirm(t("Refresh Music Library"))) {
              // set the lastIndex and lastSeek to 0 when refresh
              saveSettingItem("lastIndex", 0).then();
              saveSettingItem("lastSeek", 0).then();
              dispatch(refreshMusicLibrary());
            }
          }
        }
      }
    })();
  };

  return (
    <div className={"page page-setting"}>
      <div className={"setting-item electron-no-drag"}>
        <div className={"item-label"}>
          <span>{t("Music Library Path")}</span>
        </div>
        <div className={"item-content"}>
          <div
            style={{
              fontSize: 12,
              color: "#2483ff",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={handleChangeLibrary}
          >
            {form.musicLibraryPath || (
              <span>{t("Change Music Library Path")}</span>
            )}
          </div>
        </div>
      </div>
      <div className={"setting-item electron-no-drag"}>
        <div className={"item-label"}>
          <span>{t("Rebuild Audio Cache")}</span>
        </div>
        <div className={"item-content"}>
          <RiRefreshLine onClick={e => {
            e.preventDefault();
            if (window.confirm(t("Rebuild Audio Cache") + "?")) {
              logger("rebuild the audio cache.");
              dispatch(refreshMusicLibrary());
            }
          }} />
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
              (async () => await saveSettingItem("autoPlay", e.target.checked))();
            }}
          />
        </div>
      </div>
      <div className={"setting-item electron-no-drag"}>
        <div className={"item-label"}>{t("Choose Language")}</div>
        <div className={"item-content"}>
          <select
            id={"lang-change-select"}
            value={form.language}
            onChange={e => {
              const value = e.target.value;
              setForm({...form, language: value});
              i18n.changeLanguage(value).then();
              saveSettingItem("language", value).then();
            }}
          >
            <option value={"cn"}>中文</option>
            <option value={"en"}>English</option>
          </select>
        </div>
      </div>
      <div
        className={"save-progress"}
        style={{
          display: isSlider ? "block" : "none",
        }}
      >
        <span className={"save-prompt"}>
          <span>{t("Saving")}</span>
          <span>{progressSrc}</span>
        </span>
        <div className={"save-slider"}>
          <Slider percent={progressIdx / totals} />
        </div>
      </div>
    </div>
  );
}
