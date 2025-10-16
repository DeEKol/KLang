// ? Library Imports
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
// ? Component Imports
import { ENavigation, type TStudyStackParamList } from "shared/config/navigation";
import { ButtonUI } from "shared/ui/atoms";

// ? Types
export type TLevelScreenProps = NativeStackScreenProps<TStudyStackParamList, ENavigation.LEVEL>;

/*
 * Экран уровня
 */
export const LevelScreen = (props: TLevelScreenProps) => {
  // ? Props
  const { navigation } = props;

  // ? Hooks
  const { t } = useTranslation("levelScreen");

  // ? Render
  return (
    <View>
      <ButtonUI
        title={t("Lesson")}
        onPress={() => navigation.navigate(ENavigation.LESSON)}
      />
    </View>
  );
};
