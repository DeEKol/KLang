// ? Library Imports
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// ? Layer Imports
import {
  GameResultScreen,
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
        headerShown: false,
      }}>
      <Stack.Screen
        name={ENavigation.PRACTICE}
        component={PracticeScreen}
      />
      <Stack.Screen
        name={ENavigation.HANGEL}
        component={HangelScreen}
      />
      <Stack.Screen
        name={ENavigation.SEQUENCES_BUILDER}
        component={SequencesBuilderScreen}
      />
      <Stack.Screen
        name={ENavigation.WORD_MATCHER}
        component={WordMatcherScreen}
      />
      <Stack.Screen
        name={ENavigation.GAME_RESULT}
        component={GameResultScreen}
      />
    </Stack.Navigator>
  );
};
