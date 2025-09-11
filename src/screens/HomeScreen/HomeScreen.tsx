// ? Library Imports
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
// ? Layer Imports
import type { THomeStackParamList } from "app/providers/NavigationProvider";
import CloseIcon from "assets/icons/CloseIcon.svg";
import { ButtonUI, RoadMapButtonUi } from "shared/ui/atoms";
import { LangSwitcher } from "widgets/LangSwitcher";
import { ThemeSwitcher } from "widgets/ThemeSwitcher";

// ? Types
type THomeScreenProps = NativeStackScreenProps<THomeStackParamList, "Home">;

/*
 * Главный экран
 */
export const HomeScreen = ({ navigation }: THomeScreenProps) => {
  // ? Hooks
  const { t } = useTranslation("homeScreen");

  // ? Render
  return (
    <View>
      {/*<RoadMapButtonUi text={t("Alphabet")} />*/}
      {/*<RoadMapButtonUi text="btn" />*/}
      {/*<RoadMapButtonUi text="btn" />*/}
    </View>
  );
};
