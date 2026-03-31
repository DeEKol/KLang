export interface ISequencesBuilderSchema {
  type: string;
  words: string[];
  setValue: (word: string) => void;
}

export type TBlankPos = { x: number; y: number; width: number; height: number };
