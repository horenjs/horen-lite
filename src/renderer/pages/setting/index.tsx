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
  const [isProgress, setIsProgress] = React.useState(false);

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
      rebuildMsg().then((result: [number, number, string]) => {
        logger("save progress: ", result);
        const [i, t, s] = result;
        setProgressIdx(i);
        setTotals(t);
        setProgressSrc(s);
        setIsProgress((t - i) > 10);
      });
    }, 100);
    return () => clearInterval(timer);
  }, [progressIdx]);

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

          if (isProgress) {
            window.alert(t("Dont Change Music Library When Saving"));
          } else {
            const libs = [...form.libraries, p];

            setForm({ ...form, libraries: libs});
            const res = await saveSettingItem("libraries", libs);

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
      }
    })();
  };

  return (
    <div className={"page page-setting"}>
      <SettingItem
        label={t("Music Library Path")}
        content={
          <div
            id={"change-libraries"}
            style={{
              fontSize: 12,
              color: "#2483ff",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={handleChangeLibrary}
          >
            {form?.libraries?.length ? (
              form.libraries.map((lib) => {
                return <div key={lib}>{lib}</div>;
              })
            ) : (
              <span>{t("Change Music Library Path")}</span>
            )}
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
                if (isProgress) {
                  window.alert(t("Dont Change Music Library When Saving"));
                } else {
                  dispatch(refreshMusicLibrary());
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
          display: isProgress ? "block" : "none",
        }}
      >
        <span className={"save-prompt"}>
          <span>【{ progressIdx + " / " + totals }】</span>
          <span>{t("Saving")}</span>
          <span>{progressSrc}</span>
        </span>
      </div>
    </div>
  );
}
