import React from "react";
import { useTranslation } from "react-i18next";
import {
  saveSettingItem,
  getAllSettingItems,
  openDir,
  rebuildMsg,
} from "../../api";
import { RiRefreshLine } from "react-icons/ri";
import { MdOutlineDeleteOutline, MdAddCircleOutline } from "react-icons/md";
import "./style.less";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { refreshMusicLibrary } from "@store/slices/setting.slice";
import debug from "@plugins/debug";

const logger = debug("Page:Setting");

interface SettingItemProps {
  label: string;
  content: React.ReactNode;
}

function SettingItem(props: SettingItemProps) {
  const { label, content } = props;
  return (
    <div className={"setting-item electron-no-drag"}>
      <div className={"item-label"}>
        <span>{label}</span>
      </div>
      <div className={"item-content"}>
        {content}
      </div>
    </div>
  )
}

interface SettingForm {
  libraries: string[];
  autoPlay: boolean;
  language: string;
}

export default function SettingPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [progressIdx, setProgressIdx] = React.useState(0);
  const [progressSrc, setProgressSrc] = React.useState("");
  const [totals, setTotals] = React.useState(1);

  const isFinished = (totals - progressIdx) < 20;

  const [form, setForm] = React.useState<SettingForm>({
    libraries: [],
    autoPlay: false,
    language: "",
  });

  React.useEffect(() => {
    (async () => {
      const result = await getAllSettingItems();
      if (result.code === 1) {
        logger("get all setting success");
        const {
          libraries = [],
          autoPlay = false,
          language = "Chinese",
        } = result.data;
        setForm({
          libraries,
          autoPlay,
          language,
        });
      } else {
        logger(result.err);
      }
    })();
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      rebuildMsg().then((result) => {
        console.log(result);
        setProgressIdx(result[0]);
        setTotals(result[1]);
        setProgressSrc(result[2]);
      });
    }, 100);
    return () => clearInterval(timer);
  }, [progressIdx]);

  const refresh = () => {
    saveSettingItem("lastIndex", 0).then();
    saveSettingItem("lastSeek", 0).then();
    dispatch(refreshMusicLibrary());
  }

  const handleChangeLibrary = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    (async () => {
      const result = await openDir();

      if (result.code === 1) {
        const p = result.data[0];
        if (form.libraries.includes(p)) {
          logger("library: ", p, " exists");
          // do nothing;
        } else {
          logger("add music library path: ", p);

          if (!isFinished) {
            window.alert(t("Dont Change Music Library When Saving"));
          } else {
            const libs = [...form.libraries, p];

            setForm({ ...form, libraries: libs});
            const res = await saveSettingItem("libraries", libs);

            if (res.code === 1) {
              if (window.confirm(t("Refresh Music Library"))) {
                refresh();
              }
            }
          }
        }
      }
    })();
  };

  const handleDeleteLib = (e: React.MouseEvent<HTMLDivElement>, lib: string) => {
    e.preventDefault();
    const libs = form.libraries;
    const idx = libs.indexOf(lib);
    if (idx >= 0) libs.splice(idx, 1);
    setForm({...form, libraries: libs});
    saveSettingItem("libraries", libs).then();
    if (window.confirm(t("Refresh Music Library"))) {
      refresh();
    }
  }

  return (
    <div className={"page page-setting"}>
      <SettingItem
        label={t("Music Library Path")}
        content={
          <div id={"change-libraries"}>
            {form?.libraries?.length ? (
              form.libraries.map((lib) => {
                return (
                  <div key={lib} className={"path-name"}>
                    <div className={"path"}>{lib}</div>
                    <div className={"delete"} onClick={e => handleDeleteLib(e, lib)}>
                      <MdOutlineDeleteOutline size={16} color={"#da3b3b"} />
                    </div>
                  </div>
                )
              })
            ) : (
              <span>{t("Change Music Library Path")}</span>
            )}
            <div className={"add"} onClick={handleChangeLibrary}>
              <MdAddCircleOutline color={"#a9d89f"} size={18} className={"icon"} />
              <span className={"text"}>{t("setting.add-new-lib")}</span>
            </div>
          </div>
        }
      />
      <SettingItem
        label={t("Rebuild Audio Cache")}
        content={
          <RiRefreshLine
            fill={"#b7b7b7"}
            onClick={(e) => {
              e.preventDefault();
              if (window.confirm(t("Rebuild Audio Cache") + "?")) {
                logger("rebuild the audio cache.");
                if (!isFinished) {
                  window.alert(t("Dont Change Music Library When Saving"));
                } else {
                  refresh();
                }
              }
            }}
          />
        }
      />
      <SettingItem
        label={t("Auto Play")}
        content={
          <input
            type={"checkbox"}
            checked={form?.autoPlay}
            onChange={(e) => {
              // e.preventDefault();
              setForm({ ...form, autoPlay: e.target.checked });
              (async () =>
                await saveSettingItem("autoPlay", e.target.checked))();
            }}
          />
        }
      />
      <SettingItem
        label={t("Choose Language")}
        content={
          <select
            id={"lang-change-select"}
            value={form?.language}
            onChange={(e) => {
              const value = e.target.value;
              setForm({ ...form, language: value });
              i18n.changeLanguage(value).then();
              saveSettingItem("language", value).then();
            }}
          >
            <option value={"cn"}>中文</option>
            <option value={"en"}>English</option>
          </select>
        }
      />
      {/* progress of the saving status */}
      <div
        className={"save-progress"}
        style={{
          display: !isFinished ? "block" : "none",
        }}
      >
        <div className={"save-prompt"}>
          <span>【{ `${progressIdx} / ${totals}` }】</span>
          <span>{t("Saving")}</span>
          <span>{progressSrc}</span>
        </div>
      </div>
    </div>
  );
}
