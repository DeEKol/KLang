// ? Library Imports
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// ? Layer Imports
import { TestScreen } from "screens/TestScreen";
import { UIScreen } from "screens/UIScreen";
import { ENavigation, type TTestStackParamList } from "shared/config/navigation";

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
        name={ENavigation.TEST}
        component={TestScreen}
      />
      <Stack.Screen
        name={ENavigation.UI_SCREEN}
        component={UIScreen}
      />
    </Stack.Navigator>
  );
};
