export interface IWordPair {
  native: string;
  learning: string;
}

export interface IVocabularySchema {
  pairs: IWordPair[];
}
