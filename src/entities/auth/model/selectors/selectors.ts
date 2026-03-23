import type { IAuthSchema } from "../../types/authSchema";

type StateWithAuth = { auth: IAuthSchema };

export const getIsInitialized = (state: StateWithAuth) => state.auth.isInitialized;
export const getIsAuthenticated = (state: StateWithAuth) => state.auth.isAuthenticated;
export const getAuthUser = (state: StateWithAuth) => state.auth.user;
export const getAuthProvider = (state: StateWithAuth) => state.auth.provider;
export const getPendingLink = (state: StateWithAuth) => state.auth.pendingLink;
export const getAuthIsLoading = (state: StateWithAuth) => state.auth.isLoading;
export const getAuthError = (state: StateWithAuth) => state.auth.error;
