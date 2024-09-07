// ? Library Imports
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// ? Layer Imports
import { LessonScreen } from "screens/LessonScreen";
import { LevelScreen } from "screens/LevelScreen";

// ? Types
export type TLevelStackParamList = {
  Level: undefined;
  LessonScreen: undefined;
};

// ? Components
const Stack = createNativeStackNavigator<TLevelStackParamList>();

/*
 * Компонент, стек навигация страницы урока
 */
export const LevelStackNavigator = () => {
  // ? Render
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Level"
        component={LevelScreen}
      />
      <Stack.Screen
        name="LessonScreen"
        component={LessonScreen}
      />
    </Stack.Navigator>
  );
};
