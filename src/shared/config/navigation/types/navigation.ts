import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export enum ENavigation {
  // * Root
  AUTH = "Auth",
  MAIN = "Main",
  MODAL = "Modal",
  NOT_FOUND = "NotFound",
  // * Auth
  LOGIN = "Login",
  SIGNUP = "Signup",
  FORGOT_PASSWORD = "ForgotPassword",
  EMAIL_CONFIRMATION = "EmailConfirmation",
  SMS_CONFIRMATION = "SMSConfirmation",
  // * Home
  HOME = "Home",
  PROFILE = "Profile",
  ROADMAP = "Roadmap",
  // * Practice
  PRACTICE = "Practice",
  HANGEL = "Hangel",
  WORD_MATCHER = "WordMatcher",
  SEQUENCES_BUILDER = "SequencesBuilder",
  // * Study
  STUDY = "Study",
  LEVEL = "Level",
  LESSON = "Lesson",
  // * Test
  TEST = "Test",
  UI_SCREEN = "UiScreen",
}

export type TAuthStackParamList = {
  [ENavigation.LOGIN]: { next?: string } | undefined;
  [ENavigation.SIGNUP]: undefined;
  [ENavigation.FORGOT_PASSWORD]: undefined;
  [ENavigation.EMAIL_CONFIRMATION]: undefined;
  [ENavigation.SMS_CONFIRMATION]: undefined;
};

export type THomeStackParamList = {
  [ENavigation.HOME]: undefined;
  // * subscreens
  [ENavigation.PROFILE]: undefined;
  [ENavigation.ROADMAP]: undefined;
};

export type TPracticeStackParamList = {
  [ENavigation.PRACTICE]: undefined;
  // * subscreens
  [ENavigation.HANGEL]: undefined;
  [ENavigation.WORD_MATCHER]: undefined;
  [ENavigation.SEQUENCES_BUILDER]: undefined;
};

export type TStudyStackParamList = {
  [ENavigation.STUDY]: undefined;
  // * subscreens
  [ENavigation.LEVEL]: undefined;
  [ENavigation.LESSON]: undefined;
};

export type TTestStackParamList = {
  [ENavigation.TEST]: undefined;
  // * subscreens
  [ENavigation.UI_SCREEN]: undefined;
};

export type TRootStackParamList = {
  [ENavigation.AUTH]: undefined;
  [ENavigation.MAIN]: undefined;
  [ENavigation.MODAL]?: { screen?: string } | undefined;
  [ENavigation.NOT_FOUND]: undefined;
};

export type TAllStackParamList = TRootStackParamList &
  TAuthStackParamList &
  THomeStackParamList &
  TPracticeStackParamList &
  TStudyStackParamList &
  TTestStackParamList;

// * Screen Props
export type TRootStackScreenProps<RouteName extends keyof TRootStackParamList> =
  NativeStackScreenProps<TRootStackParamList, RouteName>;

export type TAuthStackScreenProps<RouteName extends keyof TAuthStackParamList> =
  NativeStackScreenProps<TAuthStackParamList, RouteName>;

export type THomeStackScreenProps<RouteName extends keyof THomeStackParamList> =
  NativeStackScreenProps<THomeStackParamList, RouteName>;

export type TPracticeStackScreenProps<RouteName extends keyof TPracticeStackParamList> =
  NativeStackScreenProps<TPracticeStackParamList, RouteName>;

export type TStudyStackScreenProps<RouteName extends keyof TStudyStackParamList> =
  NativeStackScreenProps<TStudyStackParamList, RouteName>;

export type TTestStackScreenProps<RouteName extends keyof TTestStackParamList> =
  NativeStackScreenProps<TTestStackParamList, RouteName>;
