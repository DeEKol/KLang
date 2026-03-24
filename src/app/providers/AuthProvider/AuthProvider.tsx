import React, { useEffect } from "react";
import { initializeAuth, loginSuccess, logout } from "entities/auth";
import { firebaseAdapter } from "shared/services/firebase";
import { sessionService } from "shared/services/session";

import { useAppDispatch } from "../StoreProvider";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = firebaseAdapter.onAuthStateChanged(async (u) => {
      if (u) {
        console.log(u);

        try {
          await sessionService.syncForUser(u);
          dispatch(loginSuccess(u));
        } catch (e) {
          console.warn("[Auth] Session exchange failed: ", e);
          dispatch(initializeAuth());
        }
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
};
