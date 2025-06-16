export interface ISequencesBuilderSchema {
  type: string;
  words: string[];
  setValue: (word: string) => void;
}
