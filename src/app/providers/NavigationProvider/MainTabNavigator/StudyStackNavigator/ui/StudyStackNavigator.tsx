// ? Library Imports
import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// ? Layer Imports
import { LevelScreen } from "screens/LevelScreen";
import { StudyScreen } from "screens/StudyScreen/ui/StudyScreen";

// ? Types
export type TStudyStackParamList = {
  Study: undefined;
  LevelScreen: undefined;
};

export type TStudyStackScreenProps = NativeStackScreenProps<TStudyStackParamList>;

// ? Components
const Stack = createNativeStackNavigator<TStudyStackParamList>();

/*
 * Компонент, стек навигация страницы обучения
 */
export const StudyStackNavigator = () => {
  // ? Render
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Study"
        component={StudyScreen}
      />
      <Stack.Screen
        name="LevelScreen"
        component={LevelScreen}
      />
    </Stack.Navigator>
  );
};
