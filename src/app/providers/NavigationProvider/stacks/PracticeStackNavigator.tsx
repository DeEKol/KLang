// ? Library Imports
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// ? Layer Imports
import {
  HangelScreen,
  PracticeScreen,
  SequencesBuilderScreen,
  WordMatcherScreen,
} from "screens/PracticeScreen";
import { ENavigation, type TPracticeStackParamList } from "shared/config/navigation";

// ? Components
const Stack = createNativeStackNavigator<TPracticeStackParamList>();

/*
 * Компонент, стек навигация страницы обучения
 */
export const PracticeStackNavigator = () => {
  // ? Render
  return (
    <Stack.Navigator
      initialRouteName={ENavigation.PRACTICE}
      screenOptions={{
        title: "Practice Screen",
        headerShown: true,
      }}>
      <Stack.Screen
        name={ENavigation.PRACTICE}
        component={PracticeScreen}
      />
      <Stack.Screen
        name={ENavigation.HANGEL}
        component={HangelScreen}
        options={{
          title: "Hangel Board",
        }}
      />
      <Stack.Screen
        name={ENavigation.SEQUENCES_BUILDER}
        component={SequencesBuilderScreen}
        options={{
          title: "Sequences Builder",
        }}
      />
      <Stack.Screen
        name={ENavigation.WORD_MATCHER}
        component={WordMatcherScreen}
        options={{
          title: "Word Matcher",
        }}
      />
    </Stack.Navigator>
  );
};
