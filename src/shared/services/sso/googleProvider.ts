import { WEB_CLIENT_ID } from "@env";
import { GoogleAuthProvider } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import type { ISsoProvider } from "./ISsoProvider";

export class GoogleSSOProvider implements ISsoProvider {
  constructor() {
    this.id = "google";
    this.configure();
  }

  id: string;
  private configure() {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
    });
  }

  async signIn() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const user = await GoogleSignin.signIn();

    const { idToken } = user.data ?? {};

    if (!idToken) {
      throw new Error("No ID token found");
    }

    // Create a Google credential with the token
    const credential = GoogleAuthProvider.credential(idToken);

    return { raw: { idToken }, credential };
  }

  async singInSilently() {
    const user = await GoogleSignin.signInSilently();

    if (!user) return null;

    const { idToken } = user.data ?? {};

    const credential = GoogleAuthProvider.credential(idToken);

    return { raw: { idToken }, credential };
  }

  async signOut() {
    await GoogleSignin.signOut();
  }
}
