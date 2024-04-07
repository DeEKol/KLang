import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TRootStackParamList } from "app/providers/NavigationProvider/types";

type IFourthScreenProps = NativeStackScreenProps<TRootStackParamList, "FourthScreen">;

export const FourthScreen = ({ navigation }: IFourthScreenProps) => {
  const { t } = useTranslation("fourthScreen");

  return (
    <View>
      <Text>{t("This is fourth screen")}</Text>
      <Button
        title={t("Go to FourthScreen")}
        onPress={() => navigation.push("FourthScreen")}
      />
    </View>
  );
};
