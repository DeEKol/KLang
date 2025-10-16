import React, { useEffect, useMemo, useState } from "react";
import { loginSuccess, logout } from "entities/auth";
import { AuthContextProvider } from "shared/auth/AuthContext";
import type { IAuthRepository, TCredential, TFirebaseAuthUser } from "shared/auth/IAuthRepository";
import { SessionService } from "shared/auth/SessionService";
import { FirebaseAdapter } from "shared/services/firebase/FirebaseAdapter";

import { useAppDispatch } from "../StoreProvider";

// ? Provider
const authRepo: IAuthRepository = new FirebaseAdapter();
const sessionService = new SessionService();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ? Redux
  const dispatch = useAppDispatch();

  // ? State
  const [user, setUser] = useState<TFirebaseAuthUser>(null);
  const [isLoading, setLoading] = useState(true);

  // ? Derived state
  const value = useMemo(
    () => ({
      user,
      isLoading,
      signInAnonymously: async () => {
        const u = await authRepo.signInAnonymously();
        return u;
      },
      signInWithEmail: async (email: string, password: string) => {
        const u = await authRepo.signInWithEmail(email, password);
        return u;
      },
      signUpWithEmail: async (email: string, password: string) => {
        const u = await authRepo.signUpWithEmail(email, password);
        return u;
      },
      signInWithSso: async (providerId: string, providerResult: { credential: TCredential }) => {
        const u = await authRepo.signInWithSso(providerId, providerResult);
        return u;
      },
      linkCredential: async (credential: TCredential) => {
        const u = await authRepo.linkCredential(credential);
        return u;
      },
      signOut: async () => {
        await authRepo.signOut();
      },
    }),
    [user, isLoading],
  );

  // ? Lifecycle
  useEffect(() => {
    const unsubscribe = authRepo.onAuthStateChanged(async (u) => {
      setUser(u);
      setLoading(false);

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
