// ? Library Imports
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// ? Layer Imports
import { HomeScreen } from "screens/HomeScreen";
import { UIScreen } from "screens/UIScreen";

// ? Types
export type THomeStackParamList = {
  Home: undefined;
  UIScreen: undefined;
};

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
