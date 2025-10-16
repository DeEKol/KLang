// src/shared/lib/theme/model/slice/themeSlice.ts
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { IThemeSchema, TThemeMode } from "../../types/themeSchema";

const initialState: IThemeSchema = {
  mode: "light", // дефолт, реальное начальное значение установим в компоненте-инициализаторе
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeTheme: (state, action: PayloadAction<TThemeMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { actions: themeActions, reducer: themeReducer } = themeSlice;
