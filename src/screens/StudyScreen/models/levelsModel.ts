// ? Layer Imports
import type { TStudyStackParamListKey } from "screens/StudyScreen/ui/StudyScreen";

// ? Types
export type TLevelsModel = {
  key: string;
  title: string;
  navigate: Extract<TStudyStackParamListKey, "LevelScreen">;
};

// ? Models
export const levelsModel: TLevelsModel[] = [
  {
    key: "level_1",
    title: "Level 1",
    navigate: "LevelScreen",
  },
  {
    key: "level_2",
    title: "Level 2",
    navigate: "LevelScreen",
  },
  {
    key: "level_3",
    title: "Level 3",
    navigate: "LevelScreen",
  },
  {
    key: "level_4",
    title: "Level 4",
    navigate: "LevelScreen",
  },
  {
    key: "level_5",
    title: "Level 5",
    navigate: "LevelScreen",
  },
  {
    key: "level_6",
    title: "Level 6",
    navigate: "LevelScreen",
  },
];
