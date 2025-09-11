// ? Library Imports
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

// ? Экран настроек
export const SettingsScreen = () => {
  const { t } = useTranslation("settingsScreen");

  return (
    <View>
      <Text>{t("This is settings screen")}</Text>
    </View>
  );
};
