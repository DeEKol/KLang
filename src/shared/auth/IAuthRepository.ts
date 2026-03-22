import type { FirebaseAuthTypes } from "@react-native-firebase/auth";

// TCredential stays Firebase-typed — SSO providers produce AuthCredential and it's
// passed straight to signInWithCredential without ever touching Redux or the UI.
export type TCredential = FirebaseAuthTypes.AuthCredential;

// Serializable auth user — the single user type used across the app.
// Safe for Redux, UI, and cross-layer passing.
export type TAuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
};

export interface IAuthRepository {
  onAuthStateChanged(cb: (user: TAuthUser | null) => void): () => void;
  signInAnonymously(): Promise<TAuthUser>;
  signInWithEmail(email: string, password: string): Promise<TAuthUser>;
  signUpWithEmail(email: string, password: string): Promise<TAuthUser>;
  signInWithCredential(credential: TCredential): Promise<TAuthUser>;
  linkCredential(credential: TCredential): Promise<TAuthUser>;
  signOut(): Promise<void>;
  getIdToken(force?: boolean): Promise<string | null>;
}
