import type {
  BottomTabNavigationProp as TBottomTabNavigationProp,
  BottomTabScreenProps as TBottomTabScreenProps,
} from "@react-navigation/bottom-tabs";

export enum ETabNavigation {
  HOME = "HomeTab",
  STUDY = "StudyTab",
  PRACTICE = "PracticeTab",
  SETTINGS = "SettingsTab",
  TEST = "TestTab",
}

export type TBottomTabsParamList = {
  [ETabNavigation.HOME]: undefined;
  [ETabNavigation.STUDY]: undefined;
  [ETabNavigation.PRACTICE]: undefined;
  [ETabNavigation.SETTINGS]: undefined;
  [ETabNavigation.TEST]: undefined;
};

export type { TBottomTabNavigationProp };
export type TMainTabScreenProps<RouteName extends keyof TBottomTabsParamList> =
  TBottomTabScreenProps<TBottomTabsParamList, RouteName>;
