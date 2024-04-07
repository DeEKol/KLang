import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TRootStackParamList } from "app/providers/NavigationProvider/types";
import { ButtonUI } from "shared/ui";

type TUIScreenProps = NativeStackScreenProps<TRootStackParamList, "UIScreen">;

export const UIScreen = ({ route }: TUIScreenProps) => {
  const { t } = useTranslation("uiScreen");

  return (
    <View>
      <Text>{t("This is UI screen")}</Text>
      <View>
        <Text>{t("Buttons")}</Text>
        <ButtonUI title={t("Button UI")} />
        <ButtonUI title={t("Button UI")} />
      </View>
    </View>
  );
};
