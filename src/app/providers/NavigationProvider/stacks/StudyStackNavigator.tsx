// ? Library Imports
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// ? Layer Imports
import { LessonScreen } from "screens/LessonScreen";
import { StudyScreen } from "screens/StudyScreen/StudyScreen";
// import { LevelScreen } from "screens/LevelScreen";
import { ENavigation, type TStudyStackParamList } from "shared/config/navigation";

// ? Components
const Stack = createNativeStackNavigator<TStudyStackParamList>();

/*
 * Компонент, стек навигация страницы обучения
 */
export const StudyStackNavigator = () => {
  // ? Render
  return (
    <Stack.Navigator
      initialRouteName={ENavigation.STUDY}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={ENavigation.STUDY}
        component={StudyScreen}
      />
      {/* <Stack.Screen
        name={ENavigation.LEVEL}
        component={LevelScreen}
      /> */}
      <Stack.Screen
        name={ENavigation.LESSON}
        component={LessonScreen}
      />
    </Stack.Navigator>
  );
};
