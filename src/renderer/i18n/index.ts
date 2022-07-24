import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import cn from "./cn.json";
import en from "./en.json";

const resources = {
  en: {
    translation: en,
  },
  cn: {
    translation: cn,
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
