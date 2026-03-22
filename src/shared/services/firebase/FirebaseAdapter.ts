import type { ReactNativeFirebase } from "@react-native-firebase/app";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  createUserWithEmailAndPassword,
  getAuth,
  getIdToken as firebaseGetIdToken,
  linkWithCredential,
  onAuthStateChanged as onAuthStateChangedFn,
  signInAnonymously,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "@react-native-firebase/auth";
import type { IAuthRepository, TAuthUser } from "shared/auth/IAuthRepository";
import { SecureStore } from "shared/storage/secureStore";

type NativeFirebaseError = ReactNativeFirebase.NativeFirebaseError;

export class FirebaseAdapter implements IAuthRepository {
  private auth;

  constructor() {
    this.auth = getAuth();
  }

  onAuthStateChanged(cb: (user: TAuthUser | null) => void) {
    const unsubscribe = onAuthStateChangedFn(this.auth, (u: FirebaseAuthTypes.User | null) => {
      cb(this.normalize(u));
    });

    return unsubscribe;
  }

  async signInAnonymously() {
    const cred = await signInAnonymously(this.auth);

    return this.normalize(cred.user)!;
  }

  async signInWithEmail(email: string, password: string) {
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);

      return this.normalize(cred.user)!;
    } catch (error) {
      throw new Error(this._mapFirebaseError((error as NativeFirebaseError).code));
    }
  }

  async signUpWithEmail(email: string, password: string) {
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, email, password);

      return this.normalize(cred.user)!;
    } catch (error) {
      throw new Error(this._mapFirebaseError((error as NativeFirebaseError).code));
    }
  }

  async signInWithCredential(credential: FirebaseAuthTypes.AuthCredential) {
    const cred = await signInWithCredential(this.auth, credential);

    return this.normalize(cred.user)!;
  }

  async linkCredential(credential: FirebaseAuthTypes.AuthCredential) {
    const user = this.auth.currentUser;

    if (!user) throw new Error("No current user to link to");

    const linked = await linkWithCredential(user, credential);

    return this.normalize(linked.user)!;
  }

  async signOut() {
    await firebaseSignOut(this.auth);
    await SecureStore.clearAll();
  }

  async getIdToken(force = false) {
    const user = this.auth.currentUser;

    if (!user) return null;

    return firebaseGetIdToken(user, force);
  }

  private _mapFirebaseError(code: string): string {
    switch (code) {
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Incorrect email or password";
      case "auth/email-already-in-use":
        return "Email is already in use";
      case "auth/weak-password":
        return "Password is too weak";
      case "auth/too-many-requests":
        return "Too many attempts. Try again later";
      case "auth/network-request-failed":
        return "Network error. Check your connection";
      default:
        return "Authentication failed";
    }
  }

  private normalize(u: FirebaseAuthTypes.User | null): TAuthUser | null {
    if (!u) return null;

    return {
      uid: u.uid,
      email: u.email ?? null,
      displayName: u.displayName ?? null,
      phoneNumber: u.phoneNumber ?? null,
      photoURL: u.photoURL ?? null,
    };
  }
}

export const firebaseAdapter = new FirebaseAdapter();
