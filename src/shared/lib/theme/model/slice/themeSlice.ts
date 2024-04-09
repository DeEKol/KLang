import { useColorScheme } from "react-native";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { IThemeSchema, TThemeColors } from "../../../theme";

const initialState: IThemeSchema = {
  color: useColorScheme() || "light",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeTheme: (state, action: PayloadAction<TThemeColors>) => {
      state.color = action.payload;
    },
  },
});

export const { actions: themeActions, reducer: themeReducer } = themeSlice;
