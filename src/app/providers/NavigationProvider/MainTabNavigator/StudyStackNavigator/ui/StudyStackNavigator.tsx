// ? Library Imports
import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LessonScreen } from "screens/LessonScreen";
import { LevelScreen } from "screens/LevelScreen";
// ? Layer Imports
import { StudyScreen } from "screens/StudyScreen/ui/StudyScreen";

// ? Slice Imports
import { LevelStackNavigator } from "../LevelStackNavigator/ui/LevelStackNavigator";

// ? Types
export type TStudyStackParamList = {
  StudyScreen: undefined;
  LevelScreen: undefined;
  LessonScreen: undefined;
};

export type TStudyStackScreenProps = NativeStackScreenProps<TStudyStackParamList, "StudyScreen">;

// ? Components
const Stack = createNativeStackNavigator<TStudyStackParamList>();

/*
 * Компонент, стек навигация страницы обучения
 */
export const StudyStackNavigator = () => {
  // ? Render
  return (
    <Stack.Navigator
      initialRouteName="StudyScreen"
      screenOptions={{
        headerShown: true,
      }}>
      <Stack.Screen
        name="StudyScreen"
        component={StudyScreen}
      />
      <Stack.Screen
        name="LevelScreen"
        component={LevelScreen}
      />
      <Stack.Screen
        name="LessonScreen"
        component={LessonScreen}
      />
    </Stack.Navigator>
  );
};
