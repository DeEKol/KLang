export type TRootStackParamList = {
  Home: undefined;
  UIScreen: undefined;
  StudyScreen: undefined;
  LevelScreen: undefined;
  FirstScreen: { check: boolean };
  SecondScreen: undefined;
  ThirdScreen: { test: string } | undefined;
  FourthScreen: undefined;
};

export type TScreenNameAlias = keyof TRootStackParamList;
