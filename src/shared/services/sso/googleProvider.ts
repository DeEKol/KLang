import { WEB_CLIENT_ID } from "@env";
import { GoogleAuthProvider } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import type { ISsoProvider } from "./ISsoProvider";

export class GoogleSSOProvider implements ISsoProvider {
  readonly id = "google";

  constructor() {
    GoogleSignin.configure({ webClientId: WEB_CLIENT_ID });
  }

  async signIn() {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const user = await GoogleSignin.signIn();
    const { idToken } = user.data ?? {};

    if (!idToken) throw new Error("Google Sign-In: no idToken returned");

    const credential = GoogleAuthProvider.credential(idToken);

    return { credential };
  }

  async signInSilently() {
    const user = await GoogleSignin.signInSilently();

    if (!user) return null;

    const { idToken } = user.data ?? {};
    const credential = GoogleAuthProvider.credential(idToken);

    return { credential };
  }

  async signOut() {
    await GoogleSignin.signOut();
  }
}
