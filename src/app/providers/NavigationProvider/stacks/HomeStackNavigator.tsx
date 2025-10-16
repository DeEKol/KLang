// ? Library Imports
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// ? Layer Imports
import { HomeScreen } from "screens/HomeScreen";
import { ProfileScreen } from "screens/ProfileScreen";
import { RoadmapScreen } from "screens/RoadmapScreen";
import { ENavigation, type THomeStackParamList } from "shared/config/navigation";

// ? Components
const Stack = createNativeStackNavigator<THomeStackParamList>();

/*
 * Компонент, стек навигация домашней страницы
 */
export const HomeStackNavigator = () => {
  // ? Render
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ENavigation.HOME}
        component={HomeScreen}
      />
      <Stack.Screen
        name={ENavigation.PROFILE}
        component={ProfileScreen}
      />
      <Stack.Screen
        name={ENavigation.ROADMAP}
        component={RoadmapScreen}
      />
    </Stack.Navigator>
  );
};
