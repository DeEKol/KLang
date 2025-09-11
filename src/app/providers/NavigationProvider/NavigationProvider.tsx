// ? Library Imports
import React from "react";
import { useSelector } from "react-redux";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// ? Slice Imports
import { getThemeColor } from "shared/lib/theme/model/selectors/getThemeColor/getThemeColor";

// ? Layer Imports
import { MainTabNavigator } from "./MainTabNavigator/MainTabNavigator";

// ? Components
const RootStack = createNativeStackNavigator<RootStackParamList>();

// ? Types
export type RootStackParamList = {
  Main: undefined; // * Главный экран с табами
};

/*
 * Компонент, провайдер навигации
 */
export const NavigationProvider = () => {
  // ? Hooks
  //TODO: донастроить темы
  const theme = useSelector(getThemeColor) === "dark" ? DarkTheme : DefaultTheme;

  // ? Render
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
