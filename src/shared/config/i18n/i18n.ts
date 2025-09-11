import { initReactI18next } from "react-i18next";
import RNLanguageDetector from "@os-team/i18next-react-native-language-detector";
import i18n from "i18next";

void i18n
  .use(RNLanguageDetector)
  .use(initReactI18next)
  .init({
    // compatibilityJSON: "v3",
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
        studyScreen: require("../../../../public/locales/en/studyScreen.json"),
        practiceScreen: require("../../../../public/locales/en/practiceScreen.json"),
        settingsScreen: require("../../../../public/locales/en/settingsScreen.json"),
        testScreen: require("../../../../public/locales/en/testScreen.json"),
        levelScreen: require("../../../../public/locales/en/levelScreen.json"),
      },
      ru: {
        translation: require("../../../../public/locales/ru/translation.json"),
        navigation: require("../../../../public/locales/ru/navigation.json"),
        homeScreen: require("../../../../public/locales/ru/homeScreen.json"),
        uiScreen: require("../../../../public/locales/ru/uiScreen.json"),
        studyScreen: require("../../../../public/locales/ru/studyScreen.json"),
        practiceScreen: require("../../../../public/locales/ru/practiceScreen.json"),
        settingsScreen: require("../../../../public/locales/ru/settingsScreen.json"),
        testScreen: require("../../../../public/locales/ru/testScreen.json"),
        levelScreen: require("../../../../public/locales/ru/levelScreen.json"),
      },
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
