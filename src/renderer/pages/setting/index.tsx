import React from "react";
import { useTranslation } from "react-i18next";
import { BsPlusSquare } from "react-icons/bs";
import { saveSetting, getAllSetting, openDir } from "../../data-transfer";
import "./style.less";

export default function SettingPage() {
  const { t } = useTranslation();

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
          <span>{ t("Music Library Path")}</span>
        </div>
        <div className={"item-content"}>
          <span style={{fontSize: 12, color: "#dfdfdf"}}>{ form.musicLibraryPath }</span>
          <div
            style={{display:"flex",alignItems:"center",margin:"0 4px"}}
            role={"button"}
            onClick={e => {
              e.preventDefault();
              (async () => {
                const result = await openDir();
                if (result.code === 1) {
                  setForm({...form, musicLibraryPath: result.data[0]});
                  console.log(await saveSetting("musicLibraryPath", result.data[0]));
                }
              })();
            }}
          >
            <BsPlusSquare size={18} fill={"#f1f1f1"} />
          </div>
        </div>
      </div>
      <div className={"setting-item"}>
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