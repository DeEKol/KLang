import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import CloseIcon from "assets/icons/CloseIcon.svg";
import {
  ENavigation,
  type TTestStackParamList,
  type TTestStackScreenProps,
} from "shared/config/navigation";
import { ButtonUI } from "shared/ui/atoms";
import { LangSwitcher } from "widgets/LangSwitcher";
import { ThemeSwitcher } from "widgets/ThemeSwitcher";

export const TestScreen = ({ navigation }: TTestStackScreenProps<ENavigation.TEST>) => {
  // ? Hooks
  const { t } = useTranslation("homeScreen");

  // ? Render
  return (
    <View>
      <ButtonUI
        title={t("Go to UIScreen")}
        onPress={() => navigation.navigate(ENavigation.UI_SCREEN)}
      />
      <LangSwitcher />
      <ThemeSwitcher />
      <Svg
        height="50%"
        width="50%"
        viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r="50"
          stroke="purple"
          strokeWidth=".5"
          fill="violet"
        />
      </Svg>
      <CloseIcon
        width={120}
        height={40}
      />
    </View>
  );
};
