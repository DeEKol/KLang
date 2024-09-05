import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const TestScreen = () => {
  const { t } = useTranslation("testScreen");

  return (
    <View>
      <Text>{t("This is test screen")}</Text>
    </View>
  );
};
