import type { FirebaseAuthTypes } from "@react-native-firebase/auth";

export type TCredential = FirebaseAuthTypes.AuthCredential;

export interface IAuthRepository {
  onAuthStateChanged(cb: (user: TFirebaseAuthUser | null) => void): () => void;
  signInAnonymously(): Promise<TFirebaseAuthUser>;
  signInWithEmail(email: string, password: string): Promise<TFirebaseAuthUser>;
  signUpWithEmail(email: string, password: string): Promise<TFirebaseAuthUser>;
  // ! providerResult and credential is same type?
  signInWithSso(
    providerId: string,
    providerResult: { credential: TCredential },
  ): Promise<TFirebaseAuthUser>;
  linkCredential(credential: TCredential): Promise<TFirebaseAuthUser>;
  signOut(): Promise<void>;
  getIdToken(force?: boolean): Promise<string | null>;
}

// * TFirebaseAuthUser is a lightweight typing to avoid depending on the Firebase SDK types here.
export type TFirebaseAuthUser = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
  getIdToken: (force?: boolean) => Promise<string>;
} | null;
