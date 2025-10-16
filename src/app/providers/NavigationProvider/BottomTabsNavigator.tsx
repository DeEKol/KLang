// ? Library Imports
import React from "react";
import { useTranslation } from "react-i18next";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// ? Layer Imports
import { SettingsScreen } from "screens/SettingsScreen";
import { ETabNavigation, type TBottomTabsParamList } from "shared/config/navigation";

// ? Slice Imports
import { HomeStackNavigator } from "./stacks/HomeStackNavigator";
import { PracticeStackNavigator } from "./stacks/PracticeStackNavigator";
import { StudyStackNavigator } from "./stacks/StudyStackNavigator";
import { TestStackNavigator } from "./stacks/TestStackNavigator";

// ? Components
const Tab = createBottomTabNavigator<TBottomTabsParamList>();

/*
 * Компонент, основная таб навигация
 */
export const BottomTabsNavigator = () => {
  // ? i18n
  const { t } = useTranslation("navigation");

  // ? Render
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name={ETabNavigation.HOME}
        component={HomeStackNavigator}
        options={{
          title: t("Home"),
        }}
      />
      <Tab.Screen
        name={ETabNavigation.STUDY}
        component={StudyStackNavigator}
        options={{
          title: t("Study Screen"),
        }}
      />
      <Tab.Screen
        name={ETabNavigation.PRACTICE}
        component={PracticeStackNavigator}
        options={{
          title: t("Practice Screen"),
        }}
      />
      <Tab.Screen
        name={ETabNavigation.SETTINGS}
        component={SettingsScreen}
        options={{
          title: t("Settings Screen"),
        }}
      />
      <Tab.Screen
        name={ETabNavigation.TEST}
        component={TestStackNavigator}
        options={{
          title: t("Test Screen"),
        }}
      />
    </Tab.Navigator>
  );
};
