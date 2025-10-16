import { createContext, useContext } from "react";
import type { TCredential, TFirebaseAuthUser } from "shared/auth/IAuthRepository";

type TAuthContextShape = {
  user: TFirebaseAuthUser;
  isLoading: boolean;
  signInAnonymously: () => Promise<TFirebaseAuthUser | null>;
  signInWithEmail: (email: string, password: string) => Promise<TFirebaseAuthUser | null>;
  signUpWithEmail: (email: string, password: string) => Promise<TFirebaseAuthUser | null>;
  signInWithSso: (
    providerId: string,
    providerResult: { credential: TCredential },
  ) => Promise<TFirebaseAuthUser | null>;
  linkCredential: (credential: TCredential) => Promise<TFirebaseAuthUser | null>;
  signOut: () => Promise<void>;
};

const defaultCtx: TAuthContextShape = {
  user: null,
  isLoading: true,
  signInAnonymously: async () => null,
  signInWithEmail: async () => null,
  signUpWithEmail: async () => null,
  signInWithSso: async () => null,
  linkCredential: async () => null,
  signOut: async () => {},
};

export const AuthContext = createContext<TAuthContextShape>(defaultCtx);

export const AuthContextProvider = AuthContext.Provider;

export function useAuthContext(): TAuthContextShape {
  const ctx = useContext(AuthContext);

  if (!ctx) throw new Error("AuthRepository not provided - wrap app with provider");

  return ctx;
}
