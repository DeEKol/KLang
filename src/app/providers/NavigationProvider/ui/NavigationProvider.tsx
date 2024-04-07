import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FirstScreen } from "screens/FirstScreen";
import { FourthScreen } from "screens/FourthScreen";
import { HomeScreen } from "screens/HomeScreen";
import { SecondScreen } from "screens/SecondScreen";
import { ThirdScreen } from "screens/ThirdScreen";
import { UIScreen } from "screens/UIScreen";
import { getThemeColor } from "shared/lib/theme/model/selectors/getThemeColor/getThemeColor";

import type { TRootStackParamList } from "../types";

export const NavigationProvider = () => {
  const Stack = createNativeStackNavigator<TRootStackParamList>();

  const { t } = useTranslation("navigation");

  //TODO: донастроить темы
  const theme = useSelector(getThemeColor) === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: t("Home"),
          }}
        />
        <Stack.Screen
          name="UIScreen"
          component={UIScreen}
          options={{
            title: t("UI Screen"),
          }}
        />
        <Stack.Screen
          name="FirstScreen"
          component={FirstScreen}
          initialParams={{ check: true }}
          options={{
            title: t("First Screen"),
          }}
        />
        <Stack.Screen
          name="SecondScreen"
          component={SecondScreen}
          options={{
            title: t("Second Screen"),
          }}
        />
        <Stack.Screen
          name="ThirdScreen"
          component={ThirdScreen}
          initialParams={{ test: "test" }}
          options={{
            title: t("Third Screen"),
          }}
        />
        <Stack.Screen
          name="FourthScreen"
          component={FourthScreen}
          options={{
            title: t("Fourth Screen"),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
