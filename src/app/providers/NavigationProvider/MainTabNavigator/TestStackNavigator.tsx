// ? Library Imports
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// ? Layer Imports
import { TestScreen } from "screens/TestScreen";
import { UIScreen } from "screens/UIScreen";

// ? Types
export type TTestStackParamList = {
  Test: undefined;
  UIScreen: undefined;
};

// ? Components
const Stack = createNativeStackNavigator<TTestStackParamList>();

/*
 * Компонент, стек навигация домашней страницы
 */
export const TestStackNavigator = () => {
  // ? Render
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Test"
        component={TestScreen}
      />
      <Stack.Screen
        name="UIScreen"
        component={UIScreen}
      />
    </Stack.Navigator>
  );
};
