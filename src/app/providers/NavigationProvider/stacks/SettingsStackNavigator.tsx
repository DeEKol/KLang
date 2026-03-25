// ? Library Imports
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// ? Layer Imports
import { SettingsScreen } from "screens/SettingsScreen";
import { ENavigation, type TSettingsStackParamList } from "shared/config/navigation";

// ? Components
const Stack = createNativeStackNavigator<TSettingsStackParamList>();

/*
 * Компонент, стек навигация настроек
 */
export const SettingsStackNavigator = () => {
  // ? Render
  return (
    <Stack.Navigator
      initialRouteName={ENavigation.SETTINGS}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={ENavigation.SETTINGS}
        component={SettingsScreen}
      />
    </Stack.Navigator>
  );
};
