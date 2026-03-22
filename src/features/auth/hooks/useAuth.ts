import { useCallback } from "react";
import {
  loginAnonymouslyThunk,
  loginWithAppleThunk,
  loginWithEmailThunk,
  loginWithGoogleThunk,
  logoutThunk,
  setPendingLink,
  signUpWithEmailThunk,
} from "entities/auth";
import { useAppDispatch } from "shared/lib/redux";

export function useAuth() {
  const dispatch = useAppDispatch();

  const loginWithEmail = useCallback(
    (email: string, password: string) => dispatch(loginWithEmailThunk({ email, password })),
    [dispatch],
  );

  const signupWithEmail = useCallback(
    (email: string, password: string) => dispatch(signUpWithEmailThunk({ email, password })),
    [dispatch],
  );

  const loginAnonymously = useCallback(() => dispatch(loginAnonymouslyThunk()), [dispatch]);

  const loginWithGoogle = useCallback(() => dispatch(loginWithGoogleThunk()), [dispatch]);

  const loginWithApple = useCallback(() => dispatch(loginWithAppleThunk()), [dispatch]);

  const logout = useCallback(() => dispatch(logoutThunk()), [dispatch]);

  const setPending = useCallback((url: string) => dispatch(setPendingLink(url)), [dispatch]);

  return {
    loginWithEmail,
    signupWithEmail,
    loginAnonymously,
    loginWithGoogle,
    loginWithApple,
    logout,
    setPending,
  };
}
