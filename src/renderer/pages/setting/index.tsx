import React from "react";
import { useTranslation } from "react-i18next";
import { BsPlusSquare } from "react-icons/bs";
import { saveSetting, getAllSetting, openDir } from "../../data-transfer";
import "./style.less";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { refreshMusicLibrary } from "@store/slices/setting.slice";

export default function SettingPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = React.useState({
    musicLibraryPath: "",
    autoPlay: true,
  });

  React.useEffect(() => {
    (async () => {
      const result = await getAllSetting();
      if (result.code === 1) {
        const { musicLibraryPath, autoPlay } = result.data;
        setForm({musicLibraryPath, autoPlay});
      } else {
        window.alert(result.err);
      }
    })();
  }, []);

  return (
    <div className={"page page-setting"}>
      <div className={"setting-item electron-no-drag"}>
        <div className={"item-label"}>
          <span>{ t("Music Library Path") }</span>
        </div>
        <div className={"item-content"}>
          <div
            style={{fontSize: 12, color: "#2483ff", cursor: "pointer"}}
            onClick={e => {
              e.preventDefault();
              (async () => {
                const result = await openDir();
                if (result.code === 1 && result.data[0] !== form.musicLibraryPath) {
                  setForm({...form, musicLibraryPath: result.data[0]});
                  const res = await saveSetting("musicLibraryPath", result.data[0]);
                  if (res.code === 1) {
                    if (window.confirm(t("Refresh Music Library"))) {
                      dispatch(refreshMusicLibrary());
                    }
                  }
                }
              })();
            }}
          >
            { form.musicLibraryPath || <span>{t("Change Music Library Path")}</span> }
          </div>
        </div>
      </div>
      <div className={"setting-item electron-no-drag"}>
        <div className={"item-label"}>
          <span>{ t("Auto Play") }</span>
        </div>
        <div className={"item-content"}>
          <input
            type={"checkbox"}
            checked={form.autoPlay}
            onChange={e => {
              // e.preventDefault();
              setForm({...form, autoPlay: e.target.checked});
              (async () => await saveSetting("autoPlay", e.target.checked))();
            }}
          />
        </div>
      </div>
    </div>
  )
}