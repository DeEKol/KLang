import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { TFirebaseAuthUser } from "shared/auth/IAuthRepository";

import type { IAuthSchema } from "../../authSchema";

const initialState: IAuthSchema = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  pendingLink: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth(state) {
      state.isInitialized = true;
    },

    loginSuccess(state, action: PayloadAction<Partial<TFirebaseAuthUser> | null>) {
      state.isInitialized = true;
      state.isAuthenticated = true;
      state.user = action.payload;
    },

    logout(state) {
      state.isInitialized = true;
      state.isAuthenticated = false;
      state.user = null;
      state.pendingLink = null;
    },

    setPendingLink(state, action: PayloadAction<string>) {
      state.pendingLink = action.payload;
    },

    clearPendingLink(state) {
      state.pendingLink = null;
    },
  },
});

export const { initializeAuth, loginSuccess, logout, setPendingLink, clearPendingLink } =
  authSlice.actions;
export default authSlice.reducer;
