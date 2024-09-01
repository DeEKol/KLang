// ? Layer Imports
import type { TScreenNameAlias } from "app/providers/NavigationProvider/types";

// ? Types
type TLevelsModel = {
  [key: string]: {
    title: string;
    navigate: Extract<TScreenNameAlias, "LevelScreen">;
  };
};

// ? Models
export const levelsModel: TLevelsModel = {
  level_1: {
    title: "Level 1",
    navigate: "LevelScreen",
  },
  level_2: {
    title: "Level 2",
    navigate: "LevelScreen",
  },
  level_3: {
    title: "Level 3",
    navigate: "LevelScreen",
  },
  level_4: {
    title: "Level 4",
    navigate: "LevelScreen",
  },
  level_5: {
    title: "Level 5",
    navigate: "LevelScreen",
  },
  level_6: {
    title: "Level 6",
    navigate: "LevelScreen",
  },
};
