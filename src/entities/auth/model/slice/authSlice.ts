import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { TFirebaseAuthUser } from "shared/auth/IAuthRepository";

import type { IAuthSchema } from "../../authSchema";

const initialState: IAuthSchema = {
  isAuthenticated: false,
  user: null,
  pendingLink: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<Partial<TFirebaseAuthUser> | null>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },

    logout(state) {
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

export const { loginSuccess, logout, setPendingLink, clearPendingLink } = authSlice.actions;
export default authSlice.reducer;
