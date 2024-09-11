import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { WordMatcher } from "features/WordMatcher";

export const PracticeScreen = () => {
  const { t } = useTranslation("practiceScreen");

  return (
    // <View>
    //   <Text>{t("This is practice screen")}</Text>
    // </View>
    <WordMatcher />
  );
};
