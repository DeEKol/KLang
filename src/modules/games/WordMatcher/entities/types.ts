export type TWordsPair = [string, string];

export interface IWordMatcherSchema {
  type: string;
  words: string[];
  setValue: (word: string) => void;
}
