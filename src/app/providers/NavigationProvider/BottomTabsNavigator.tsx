// ? Library Imports
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurMask } from "@shopify/react-native-skia";
// ? Layer Imports
import { SettingsScreen } from "screens/SettingsScreen";
import { BounceInView } from "shared/animations/Animated";
import { ETabNavigation, type TBottomTabsParamList } from "shared/config/navigation";

// ? Slice Imports
import { HomeStackNavigator } from "./stacks/HomeStackNavigator";
import { PracticeStackNavigator } from "./stacks/PracticeStackNavigator";
import { StudyStackNavigator } from "./stacks/StudyStackNavigator";
import { TestStackNavigator } from "./stacks/TestStackNavigator";
import AnimatedIcon from "./AnimatedIcon";
import PaperBottomTabs from "./PaperBottomTabs";

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
      }}
      initialRouteName={ETabNavigation.HOME}
      tabBar={(props) => <PaperBottomTabs {...props} />}>
      <Tab.Screen
        name={ETabNavigation.HOME}
        component={HomeStackNavigator}
        options={{
          title: t("Home"),
          tabBarBadgeStyle: { backgroundColor: "red" },
          tabBarStyle: { backgroundColor: "red" },
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              focused={focused}
              name="home"
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name={ETabNavigation.STUDY}
        component={StudyStackNavigator}
        options={{
          title: t("Study"),
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              focused={focused}
              name="book"
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name={ETabNavigation.PRACTICE}
        component={PracticeStackNavigator}
        options={{
          title: t("Practice"),
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              focused={focused}
              name="school"
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name={ETabNavigation.SETTINGS}
        component={SettingsScreen}
        options={{
          title: t("Settings"),
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon
              focused
              name="function"
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name={ETabNavigation.TEST}
        component={TestStackNavigator}
        options={{
          title: t("Test"),
          tabBarIcon: ({ color }) => (
            <MaterialDesignIcons
              name="test-tube"
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
