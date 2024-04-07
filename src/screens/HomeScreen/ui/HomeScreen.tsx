import React from "react";
import { useTranslation } from "react-i18next";
import { Button, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TRootStackParamList } from "app/providers/NavigationProvider";
import CloseIcon from "assets/icons/CloseIcon.svg";
import { ButtonUI } from "shared/ui";
import { LangSwitcher } from "widgets/LangSwitcher";
import { ThemeSwitcher } from "widgets/ThemeSwitcher";

type THomeScreenProps = NativeStackScreenProps<TRootStackParamList, "Home">;

export const HomeScreen = ({ navigation }: THomeScreenProps) => {
  const { t } = useTranslation("homeScreen");

  return (
    <View>
      <ButtonUI
        title={t("Go to UIScreen")}
        onPress={() => navigation.navigate("UIScreen")}
      />
      <Button
        title={t("Go to FirstScreen")}
        onPress={() =>
          navigation.navigate("FirstScreen", {
            check: true,
          })
        }
      />
      <Button
        title={t("Go to SecondScreen")}
        onPress={() => navigation.navigate("SecondScreen")}
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
