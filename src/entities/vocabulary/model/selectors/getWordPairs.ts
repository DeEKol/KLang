import type { IStateSchema } from "app/providers/StoreProvider";

import type { IWordPair } from "../../types/vocabularySchema";

export const getWordPairs = (state: IStateSchema): IWordPair[] => state.vocabulary.pairs;
