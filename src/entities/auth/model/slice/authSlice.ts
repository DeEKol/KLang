import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { TAuthUser } from "shared/auth/IAuthRepository";

import type { IAuthSchema } from "../../authSchema";
import {
  loginAnonymouslyThunk,
  loginWithAppleThunk,
  loginWithEmailThunk,
  loginWithGoogleThunk,
  logoutThunk,
  signUpWithEmailThunk,
} from "../thunks/authThunks";

const initialState: IAuthSchema = {
  isInitialized: false,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  user: null,
  pendingLink: null,
};

const authActionThunks = [
  loginWithEmailThunk,
  signUpWithEmailThunk,
  loginWithGoogleThunk,
  loginWithAppleThunk,
  loginAnonymouslyThunk,
  logoutThunk,
];

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth(state) {
      state.isInitialized = true;
    },

    loginSuccess(state, action: PayloadAction<TAuthUser | null>) {
      state.isInitialized = true;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.user = action.payload;
    },

    logout(state) {
      state.isInitialized = true;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
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
  extraReducers: (builder) => {
    authActionThunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state) => {
          state.isLoading = false;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message ?? "Unknown error";
        });
    });
  },
});

export const { initializeAuth, loginSuccess, logout, setPendingLink, clearPendingLink } =
  authSlice.actions;
export default authSlice.reducer;
