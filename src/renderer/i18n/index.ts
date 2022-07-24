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
      "Confirm Exit": "The App will exit, confirm it?",
      "No Lyric": "There is no lyric for this song.",
      "Saving": "Saving: ",
      "Dont Change Music Library When Saving": "Saving, No Change Music" +
        " Library.",
      "Choose Language": "Choose Language",
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
      "Confirm Exit": "确定要退出应用吗？",
      "No Lyric": "这首歌曲没有歌词",
      "Saving": "正在保存：",
      "Dont Change Music Library When Saving": "正在刷新音乐库，无法选择新的音乐库",
      "Choose Language": "选择语言",
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
