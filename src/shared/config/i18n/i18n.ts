import { initReactI18next } from "react-i18next";
import RNLanguageDetector from "@os-team/i18next-react-native-language-detector";
import i18n from "i18next";

void i18n
  .use(RNLanguageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    fallbackLng: "ru",
    debug: __DEV__,
    lng: "ru",
    supportedLngs: ["en", "ru"],
    ns: ["translation", "homeScreen"],
    defaultNS: "translation",

    resources: {
      en: {
        translation: require("../../../../public/locales/en/translation.json"),
        navigation: require("../../../../public/locales/en/navigation.json"),
        homeScreen: require("../../../../public/locales/en/homeScreen.json"),
        uiScreen: require("../../../../public/locales/en/uiScreen.json"),
        firstScreen: require("../../../../public/locales/en/firstScreen.json"),
        secondScreen: require("../../../../public/locales/en/secondScreen.json"),
        thirdScreen: require("../../../../public/locales/en/thirdScreen.json"),
        fourthScreen: require("../../../../public/locales/en/fourthScreen.json"),
      },
      ru: {
        translation: require("../../../../public/locales/ru/translation.json"),
        navigation: require("../../../../public/locales/ru/navigation.json"),
        homeScreen: require("../../../../public/locales/ru/homeScreen.json"),
        uiScreen: require("../../../../public/locales/ru/uiScreen.json"),
        firstScreen: require("../../../../public/locales/ru/firstScreen.json"),
        secondScreen: require("../../../../public/locales/ru/secondScreen.json"),
        thirdScreen: require("../../../../public/locales/ru/thirdScreen.json"),
        fourthScreen: require("../../../../public/locales/ru/fourthScreen.json"),
      },
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
