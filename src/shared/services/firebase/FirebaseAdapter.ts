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
import { apiClient } from "shared/api/client";
import type { IAuthRepository, TFirebaseAuthUser } from "shared/auth/IAuthRepository";
import { SecureStore } from "shared/storage/secureStore";

export class FirebaseAdapter implements IAuthRepository {
  private unsub?: () => void;
  private auth;

  constructor() {
    this.auth = getAuth();
  }

  onAuthStateChanged(cb: (user: TFirebaseAuthUser) => void) {
    this.unsub = onAuthStateChangedFn(this.auth, async (u: FirebaseAuthTypes.User | null) => {
      cb(this.normalize(u));
    });

    return () => {
      if (this.unsub) this.unsub();
    };
  }

  async signInAnonymously() {
    const cred = await signInAnonymously(this.auth);

    return this.normalize(cred.user);
  }

  async signInWithEmail(email: string, password: string) {
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);

      console.log("User account created & signed in!");
      return this.normalize(cred.user);
      // eslint-disable-next-line
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        console.log("That email address is already in use!");
      }

      if (error.code === "auth/invalid-email") {
        console.log("That email address is invalid!");
      }

      console.error(error);
      return null;
    }
  }

  async signUpWithEmail(email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);

    return this.normalize(cred.user);
  }

  async signInWithSso(
    providerId: string,
    providerResult: { credential: FirebaseAuthTypes.AuthCredential },
  ) {
    // providerResult expected: { credential }
    const cred = await signInWithCredential(this.auth, providerResult.credential);

    return this.normalize(cred.user);
  }

  async linkCredential(credential: FirebaseAuthTypes.AuthCredential) {
    const user = this.auth.currentUser;

    if (!user) throw new Error("No current user to link to");

    const linked = await linkWithCredential(user, credential);

    return this.normalize(linked.user);
  }

  async signOut() {
    await firebaseSignOut(this.auth);
    await SecureStore.clearAll();
  }

  async getIdToken(force = false) {
    const user = this.auth.currentUser;

    if (!user) return null;

    return await firebaseGetIdToken(user, force);
  }

  private normalize(u: FirebaseAuthTypes.User | null) {
    if (!u) return null;

    const normalized: TFirebaseAuthUser = {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      phoneNumber: u.phoneNumber,
      photoURL: u.photoURL,
      getIdToken: (force?: boolean) => firebaseGetIdToken(u, force),
    };

    return normalized;
  }
}
