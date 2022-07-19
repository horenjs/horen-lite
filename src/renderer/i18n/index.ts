import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "No Title": "No Title",
    }
  },
  cn: {
    translation: {
      "No Title": "没有标题",
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false,
    }
  })

export default i18n;