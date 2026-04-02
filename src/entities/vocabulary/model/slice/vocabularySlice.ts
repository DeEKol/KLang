import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { IVocabularySchema, IWordPair } from "../../types/vocabularySchema";

// Static seed data — will be replaced by lesson API data (GAME-02)
const initialState: IVocabularySchema = {
  pairs: [
    { native: "Cat", learning: "고양이" },
    { native: "Dog", learning: "개" },
    { native: "Fish", learning: "물고기" },
    { native: "Elephant", learning: "코끼리" },
  ],
};

export const vocabularySlice = createSlice({
  name: "vocabulary",
  initialState,
  reducers: {
    setPairs: (state, action: PayloadAction<IWordPair[]>) => {
      state.pairs = action.payload;
    },
  },
});

export const { actions: vocabularyActions, reducer: vocabularyReducer } = vocabularySlice;
