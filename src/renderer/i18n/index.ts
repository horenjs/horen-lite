import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "No Title": "No Title",
      "Music Library Path": "Music Library Path",
      "Auto Play": "Auto Play",
    },
  },
  cn: {
    translation: {
      "No Title": "没有标题",
      "Music Library Path": "音乐库路径",
      "Auto Play": "自动播放",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
