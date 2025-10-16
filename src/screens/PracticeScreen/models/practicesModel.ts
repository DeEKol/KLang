import { ENavigation, type TPracticeStackParamList } from "shared/config/navigation";
// ? Types
export type TPracticesModel = {
  key: string;
  title: string;
  navigate: keyof TPracticeStackParamList;
};

// ? Models
export const practicesModel: TPracticesModel[] = [
  {
    key: "hangel_board",
    title: "Hangman Board",
    navigate: ENavigation.HANGEL,
  },
  {
    key: "word_matcher",
    title: "Word Matcher",
    navigate: ENavigation.WORD_MATCHER,
  },
  {
    key: "sequences_builder",
    title: "Sequences Builder",
    navigate: ENavigation.SEQUENCES_BUILDER,
  },
];
