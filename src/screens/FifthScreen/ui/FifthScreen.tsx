import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const FifthScreen = () => {
  const { t } = useTranslation("fifthScreen");

  return (
    <View>
      <Text>{t("This is fourth screen")}</Text>
    </View>
  );
};
