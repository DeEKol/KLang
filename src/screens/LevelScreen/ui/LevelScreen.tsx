import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TRootStackParamList } from "app/providers/NavigationProvider";

type TLevelScreenProps = NativeStackScreenProps<TRootStackParamList, "LevelScreen">;

export const LevelScreen = ({ navigation }: TLevelScreenProps) => {
  const { t } = useTranslation("homeScreen");

  return <View />;
};
