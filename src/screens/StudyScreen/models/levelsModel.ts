// ? Layer Imports

// ? Types
export type TLevelsModel = {
  key: string;
  title: string;
  // navigate: Extract<TStudyStackParamListKey, "LevelScreen">;
  // navigate: "LevelScreen";
  navigate: "LessonScreen";
};

// ? Models
export const levelsModel: TLevelsModel[] = [
  {
    key: "level_1",
    title: "Level 1",
    navigate: "LessonScreen",
  },
  {
    key: "level_2",
    title: "Level 2",
    navigate: "LessonScreen",
  },
  {
    key: "level_3",
    title: "Level 3",
    navigate: "LessonScreen",
  },
  {
    key: "level_4",
    title: "Level 4",
    navigate: "LessonScreen",
  },
  {
    key: "level_5",
    title: "Level 5",
    navigate: "LessonScreen",
  },
  {
    key: "level_6",
    title: "Level 6",
    navigate: "LessonScreen",
  },
];
