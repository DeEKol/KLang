import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Counter } from "entities/Counter";
import { Posts } from "entities/PostsTestApi";

export const SecondScreen = () => {
  const { t } = useTranslation("secondScreen");

  return (
    <View>
      <Text>{t("This is second screen")}</Text>
      <Posts />
      <Counter />
    </View>
  );
};
