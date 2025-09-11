// ? Library Imports
import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// ? Layer Imports
import {
  HangelScreen,
  PracticeScreen,
  SequencesBuilderScreen,
  WordMatcherScreen,
} from "screens/PracticeScreen";
// ? Types
export type TPracticeStackParamList = {
  PracticeScreen: undefined;
  HangelScreen: undefined;
  WordMatcherScreen: undefined;
  SequencesBuilderScreen: undefined;
  StudyScreen: undefined;
};

export type TStudyStackScreenProps = NativeStackScreenProps<TPracticeStackParamList, "StudyScreen">;

// ? Components
const Stack = createNativeStackNavigator<TPracticeStackParamList>();

/*
 * Компонент, стек навигация страницы обучения
 */
export const PracticeStackNavigator = () => {
  // ? Render
  return (
    <Stack.Navigator
      initialRouteName="PracticeScreen"
      screenOptions={{
        title: "Practice Screen",
        headerShown: true,
      }}>
      <Stack.Screen
        name="PracticeScreen"
        component={PracticeScreen}
      />
      <Stack.Screen
        name="HangelScreen"
        component={HangelScreen}
        options={{
          title: "Hangel Board",
        }}
      />
      <Stack.Screen
        name="SequencesBuilderScreen"
        component={SequencesBuilderScreen}
        options={{
          title: "Sequences Builder",
        }}
      />
      <Stack.Screen
        name="WordMatcherScreen"
        component={WordMatcherScreen}
        options={{
          title: "Word Matcher",
        }}
      />
    </Stack.Navigator>
  );
};
