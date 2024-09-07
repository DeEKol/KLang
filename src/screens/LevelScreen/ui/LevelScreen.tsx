// ? Library Imports
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
// ? Component Imports
import type { TLevelStackParamList } from "app/providers/NavigationProvider";
import { ButtonUI } from "shared/ui";

// ? Types
export type TLevelScreenProps = NativeStackScreenProps<TLevelStackParamList, "Level">;

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
        onPress={() => navigation.navigate("LessonScreen")}
      />
    </View>
  );
};
