// src/features/auth/selectors.ts
import type { RootState } from "app/providers/StoreProvider/StoreProvider"; // см. ниже — как экспортируется

export const getIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const getAuthUser = (state: RootState) => state.auth.user;
export const getPendingLink = (state: RootState) => state.auth.pendingLink;
