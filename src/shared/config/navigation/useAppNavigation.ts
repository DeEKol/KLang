import type { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type {
  TAllStackParamList,
  TPracticeStackParamList,
  TRootStackParamList,
} from "./types/navigation";
import type {
  ETabNavigation,
  TBottomTabNavigationProp,
  TBottomTabsParamList,
} from "./types/tab-navigation";

/** Nav props for concrete navigators */
export type RootStackNavProp<
  RouteName extends keyof TRootStackParamList = keyof TRootStackParamList,
> = NativeStackNavigationProp<TRootStackParamList, RouteName>;

export type BottomTabNavProp<
  RouteName extends keyof TBottomTabsParamList = keyof TBottomTabsParamList,
> = TBottomTabNavigationProp<TBottomTabsParamList, RouteName>;

export type PracticeStackNavProp<
  RouteName extends keyof TPracticeStackParamList = keyof TPracticeStackParamList,
> = NativeStackNavigationProp<TPracticeStackParamList, RouteName>;

/**
 * Composite navigation prop for a screen INSIDE the Practice stack:
 * PracticeStack (native stack) <- BottomTab (PracticeTab) <- RootStack
 *
 * Order: inner navigator first, then parent(s).
 */
export type PracticeCompositeNavProp<
  Screen extends keyof TPracticeStackParamList = keyof TPracticeStackParamList,
> = CompositeNavigationProp<
  PracticeStackNavProp<Screen>,
  CompositeNavigationProp<BottomTabNavProp<ETabNavigation.PRACTICE>, RootStackNavProp>
>;

/**
 * Generic app-wide composite: a screen that might live inside a tab (any tab)
 * and the root stack.
 */
export type AppCompositeNavProp = CompositeNavigationProp<
  TBottomTabNavigationProp<TBottomTabsParamList>,
  NativeStackNavigationProp<TRootStackParamList>
>;

/* -------------------- hooks -------------------- */

/**
 * useAppNavigation() — для большинства случаев, когда нужен навигатор на уровне tab+root
 * (например, навигация между табами).
 */
export function useAppNavigation() {
  return useNavigation<AppCompositeNavProp>();
}

/**
 * useTabNavigation<RouteName> — если вам нужно навигатор конкретного таба
 */
export function useTabNavigation<
  RouteName extends keyof TBottomTabsParamList = keyof TBottomTabsParamList,
>() {
  return useNavigation<BottomTabNavProp<RouteName>>();
}

/**
 * usePracticeNavigation<Screen> — типизированный хук для экранов внутри Practice stack.
 * Например: const nav = usePracticeNavigation<'Hangel'>(); nav.navigate('Hangel');
 */
export function usePracticeNavigation<
  Screen extends keyof TPracticeStackParamList = keyof TPracticeStackParamList,
>() {
  return useNavigation<PracticeCompositeNavProp<Screen>>();
}

/**
 * useAppRoute<Screen> — типизированный useRoute для любого route из TAllStackParamList.
 * Если вы используете конкретный screen, укажите generic.
 */
export function useAppRoute<
  RouteName extends keyof TAllStackParamList = keyof TAllStackParamList,
>() {
  return useRoute<RouteProp<TAllStackParamList, RouteName>>();
}

export default useAppNavigation;
