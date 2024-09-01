import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TRootStackParamList } from "app/providers/NavigationProvider";
import { ButtonUI } from "shared/ui";

type TStudyScreenProps = NativeStackScreenProps<TRootStackParamList, "StudyScreen">;

export const StudyScreen = ({ navigation }: TStudyScreenProps) => {
  const { t } = useTranslation("studyScreen");

  return (
    <View>
      <Text>{t("Levels")}</Text>
      <ButtonUI
        title={t("Level 1")}
        onPress={() => navigation.navigate("LevelScreen")}
      />
      <ButtonUI
        title={t("Level 2")}
        onPress={() => navigation.navigate("LevelScreen")}
      />
      <ButtonUI
        title={t("Level 3")}
        onPress={() => navigation.navigate("LevelScreen")}
      />
      <ButtonUI
        title={t("Level 4")}
        onPress={() => navigation.navigate("LevelScreen")}
      />
      <ButtonUI
        title={t("Level 5")}
        onPress={() => navigation.navigate("LevelScreen")}
      />
      <ButtonUI
        title={t("Level 6")}
        onPress={() => navigation.navigate("LevelScreen")}
      />
    </View>
  );
};
