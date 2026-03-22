import appleAuth from "@invertase/react-native-apple-authentication";
import { OAuthProvider } from "@react-native-firebase/auth";

import type { ISsoProvider } from "./ISsoProvider";

// Apple Sign-In is only available on iOS 13+
export class AppleSSOProvider implements ISsoProvider {
  readonly id = "apple";

  async signIn() {
    if (!appleAuth.isSupported) {
      throw new Error("Apple Sign-In is not supported on this device");
    }

    const { identityToken, nonce } = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    if (!identityToken) throw new Error("Apple Sign-In: no identityToken returned");

    const provider = new OAuthProvider("apple.com");
    const credential = provider.credential({ idToken: identityToken, rawNonce: nonce });

    return { credential };
  }

  async signInSilently() {
    // Apple does not support silent sign-in.
    // getCredentialStateForUser requires a user identifier from a previous sign-in
    // that must be persisted — not available without storage. Return null.
    return null;
  }

  // Apple does not require explicit sign-out — session is managed by iOS
}
