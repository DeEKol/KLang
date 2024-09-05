import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Counter } from "entities/Counter";

export const FirstScreen = () => {
  const { t } = useTranslation("firstScreen");

  return (
    <View>
      <Text>{t("This is First screen")}</Text>
      <Counter />
      <Text>{process.env.TEST}</Text>
    </View>
  );
};
