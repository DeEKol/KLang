import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TRootStackParamList } from "app/providers/NavigationProvider/types";
import { Counter } from "entities/Counter";

type TFirstScreenProps = NativeStackScreenProps<TRootStackParamList, "FirstScreen">;

export const FirstScreen = ({ route }: TFirstScreenProps) => {
  const { t } = useTranslation("firstScreen");

  return (
    <View>
      <Text>{t("This is First screen")}</Text>
      <Counter />
      <Text>{process.env.TEST}</Text>
    </View>
  );
};
