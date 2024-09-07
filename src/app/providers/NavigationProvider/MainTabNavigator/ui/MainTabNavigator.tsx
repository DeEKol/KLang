// ? Library Imports
import React from "react";
import { useTranslation } from "react-i18next";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// ? Layer Imports
import { PracticeScreen } from "screens/PracticeScreen";
import { SettingsScreen } from "screens/SettingsScreen";
import { TestScreen } from "screens/TestScreen";

// ? Slice Imports
import { HomeStackNavigator } from "../HomeStackNavigator/ui/HomeStackNavigator";
import { StudyStackNavigator } from "../StudyStackNavigator/ui/StudyStackNavigator";

// ? Components
const Tab = createBottomTabNavigator<TMainTabParamList>();

// ? Types
export type TMainTabParamList = {
  HomeScreen: undefined;
  Study: undefined;
  PracticeScreen: undefined;
  SettingsScreen: undefined;
  TestScreen: undefined;
};

/*
 * Компонент, основная таб навигация
 */
export const MainTabNavigator = () => {
  // ? Hooks
  const { t } = useTranslation("navigation");

  // ? Render
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeStackNavigator}
        options={{
          title: t("Home"),
        }}
      />
      <Tab.Screen
        name="Study"
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
