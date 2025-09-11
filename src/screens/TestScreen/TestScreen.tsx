import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TTestStackParamList } from "app/providers/NavigationProvider";
import CloseIcon from "assets/icons/CloseIcon.svg";
import { ButtonUI } from "shared/ui/atoms";
import { LangSwitcher } from "widgets/LangSwitcher";
import { ThemeSwitcher } from "widgets/ThemeSwitcher";

type TTestScreenProps = NativeStackScreenProps<TTestStackParamList, "Test">;

export const TestScreen = ({ navigation }: TTestScreenProps) => {
  // ? Hooks
  const { t } = useTranslation("homeScreen");

  // ? Render
  return (
    <View>
      <ButtonUI
        title={t("Go to UIScreen")}
        onPress={() => navigation.navigate("UIScreen")}
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
