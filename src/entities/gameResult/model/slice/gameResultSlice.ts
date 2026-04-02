import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { IGameResult, IGameResultSchema } from "../../types/gameResultSchema";

const initialState: IGameResultSchema = {
  lastResult: null,
  gameName: null,
};

export const gameResultSlice = createSlice({
  name: "gameResult",
  initialState,
  reducers: {
    setLastResult: (state, action: PayloadAction<{ result: IGameResult; gameName: string }>) => {
      state.lastResult = action.payload.result;
      state.gameName = action.payload.gameName;
    },
    clearLastResult: (state) => {
      state.lastResult = null;
      state.gameName = null;
    },
  },
});

export const { actions: gameResultActions, reducer: gameResultReducer } = gameResultSlice;
