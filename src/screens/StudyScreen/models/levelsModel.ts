// ? Layer Imports
import { ENavigation, type TStudyStackParamList } from "shared/config/navigation";

// ? Types
export type TLevelsModel = {
  key: string;
  title: string;
  // navigate: Extract<TStudyStackParamListKey, "LevelScreen">;
  // navigate: "LevelScreen";
  navigate: keyof TStudyStackParamList;
};

// ? Models
export const levelsModel: TLevelsModel[] = [
  {
    key: "level_1",
    title: "Level 1",
    navigate: ENavigation.LESSON,
  },
  {
    key: "level_2",
    title: "Level 2",
    navigate: ENavigation.LESSON,
  },
  {
    key: "level_3",
    title: "Level 3",
    navigate: ENavigation.LESSON,
  },
  {
    key: "level_4",
    title: "Level 4",
    navigate: ENavigation.LESSON,
  },
  {
    key: "level_5",
    title: "Level 5",
    navigate: ENavigation.LESSON,
  },
  {
    key: "level_6",
    title: "Level 6",
    navigate: ENavigation.LESSON,
  },
];
