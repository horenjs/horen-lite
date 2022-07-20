import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "No Title": "No Title",
      "No Artist": "No Artist",
      "Music Library Path": "Music Library Path",
      "Auto Play": "Auto Play",
      "Language": "Language",
      "Change Music Library Path": "Change Music Library Path",
      "Refresh Music Library": "Detecting you change the Music Library Path," +
        " refresh it?",
    },
  },
  cn: {
    translation: {
      "No Title": "没有标题",
      "No Artist": "没有歌手",
      "Music Library Path": "音乐库路径",
      "Auto Play": "自动播放",
      "Language": "语言",
      "Change Music Library Path": "变更音乐库地址",
      "Refresh Music Library": "检测到您修改了音乐库地址，刷新音乐库吗？",
    },
  },
};

const opts = {
  resources,
  lng: "cn",
  interpolation: {
    escapeValue: false,
  },
}

export default i18n.use(initReactI18next).init(opts);
