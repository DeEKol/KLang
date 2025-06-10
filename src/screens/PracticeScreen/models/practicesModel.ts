// ? Types
export type TPracticesModel = {
  key: string;
  title: string;
  navigate: "HangelScreen" | "WordMatcherScreen" | "UIScreen";
};

// ? Models
export const practicesModel: TPracticesModel[] = [
  {
    key: "hangel_board",
    title: "Hangman Board",
    navigate: "HangelScreen",
  },
  {
    key: "word_matcher",
    title: "Word Matcher",
    navigate: "WordMatcherScreen",
  },
];
