import React, { useEffect, useMemo } from "react";
import { initializeAuth, loginSuccess, logout } from "entities/auth";
import { AuthContextProvider } from "shared/auth/AuthContext";
import type { IAuthRepository, TCredential } from "shared/auth/IAuthRepository";
import { SessionService } from "shared/auth/SessionService";
import { FirebaseAdapter } from "shared/services/firebase/FirebaseAdapter";

import { useAppDispatch } from "../StoreProvider";

// ? Provider
const authRepo: IAuthRepository = new FirebaseAdapter();
const sessionService = new SessionService();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ? Redux
  const dispatch = useAppDispatch();

  // ? Derived state — только методы, без user/isLoading (они в Redux)
  const value = useMemo(
    () => ({
      signInAnonymously: async () => {
        return authRepo.signInAnonymously();
      },
      signInWithEmail: async (email: string, password: string) => {
        return authRepo.signInWithEmail(email, password);
      },
      signUpWithEmail: async (email: string, password: string) => {
        return authRepo.signUpWithEmail(email, password);
      },
      signInWithSso: async (providerId: string, providerResult: { credential: TCredential }) => {
        return authRepo.signInWithSso(providerId, providerResult);
      },
      linkCredential: async (credential: TCredential) => {
        return authRepo.linkCredential(credential);
      },
      signOut: async () => {
        await authRepo.signOut();
      },
    }),
    [],
  );

  // ? Lifecycle
  useEffect(() => {
    const unsubscribe = authRepo.onAuthStateChanged(async (u) => {
      if (u) {
        try {
          await sessionService.syncForUser(u);

          const userInfo = {
            ...u,
            getIdToken: undefined,
          };

          dispatch(loginSuccess(userInfo));

          console.log("[FIREBASE Auth Callback] User signed in!");
        } catch (e) {
          console.warn("[FIREBASE Auth Callback] Session exchange failed: ", e);
          dispatch(initializeAuth());
        }
      } else {
        console.log("[FIREBASE Auth Callback] User signed out!");

        await sessionService.clearSession();

        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, []);

  // ? Render
  return <AuthContextProvider value={value}>{children}</AuthContextProvider>;
};
