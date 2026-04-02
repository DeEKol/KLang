import { ENavigation, type TPracticeStackParamList } from "shared/config/navigation";
// ? Types
export type TPracticesModel = {
  key: string;
  titleKey: string;
  navigate: keyof TPracticeStackParamList;
};

// ? Models
export const practicesModel: TPracticesModel[] = [
  {
    key: "hangel_board",
    titleKey: "hangelBoard",
    navigate: ENavigation.HANGEL,
  },
  {
    key: "word_matcher",
    titleKey: "wordMatcher",
    navigate: ENavigation.WORD_MATCHER,
  },
  {
    key: "sequences_builder",
    titleKey: "sequencesBuilder",
    navigate: ENavigation.SEQUENCES_BUILDER,
  },
];
