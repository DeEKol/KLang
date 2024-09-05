import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "screens/HomeScreen";
import { LevelScreen } from "screens/LevelScreen";
import { PracticeScreen } from "screens/PracticeScreen";
import { SettingsScreen } from "screens/SettingsScreen";
import { StudyScreen } from "screens/StudyScreen";
import type { TStudyStackParamList } from "screens/StudyScreen/ui/StudyScreen";
import { TestScreen } from "screens/TestScreen";
import { UIScreen } from "screens/UIScreen";
import { getThemeColor } from "shared/lib/theme/model/selectors/getThemeColor/getThemeColor";

import type { RootStackParamList, TMainTabParamList } from "../types";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TMainTabParamList>();

export type THomeStackParamList = {
  Home: undefined;
  UIScreen: undefined;
};

const HomeStackNavigator = () => {
  const Stack = createNativeStackNavigator<THomeStackParamList>();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        name="UIScreen"
        component={UIScreen}
      />
    </Stack.Navigator>
  );
};

const StudyStackNavigator = () => {
  const Stack = createNativeStackNavigator<TStudyStackParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Study"
        component={StudyScreen}
      />
      <Stack.Screen
        name="LevelScreen"
        component={LevelScreen}
      />
    </Stack.Navigator>
  );
};

const MainTabNavigator = () => {
  const { t } = useTranslation("navigation");

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Скрыть заголовок, если не нужен
        tabBarActiveTintColor: "tomato", // Цвет активной вкладки
        tabBarInactiveTintColor: "gray", // Цвет неактивной вкладки
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeStackNavigator}
        options={{
          title: t("Home"),
        }}
      />
      <Tab.Screen
        name="StudyScreen"
        component={StudyStackNavigator}
        options={{
          title: t("Study Screen"),
        }}
      />
      <Tab.Screen
        name="PracticeScreen"
        component={PracticeScreen}
        options={{
          title: t("Practice Screen"),
        }}
      />
      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: t("Settings Screen"),
        }}
      />
      <Tab.Screen
        name="TestScreen"
        component={TestScreen}
        options={{
          title: t("Test Screen"),
        }}
      />
    </Tab.Navigator>
  );
};

export const NavigationProvider = () => {
  //TODO: донастроить темы
  const theme = useSelector(getThemeColor) === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen
          name="Main"
          component={MainTabNavigator}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
