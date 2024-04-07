import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TRootStackParamList } from "app/providers/NavigationProvider/types";
import { Counter } from "entities/Counter";
import { Posts } from "entities/PostsTestApi";

type TSecondScreenProps = NativeStackScreenProps<TRootStackParamList, "SecondScreen">;

export const SecondScreen = ({ navigation }: TSecondScreenProps) => {
  const { t } = useTranslation("secondScreen");

  return (
    <View>
      <Text>{t("This is second screen")}</Text>
      <Posts />
      <Button
        title={t("Go to ThirdScreen")}
        onPress={() => navigation.navigate("ThirdScreen")}
      />
      <Counter />
    </View>
  );
};
