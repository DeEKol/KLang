import { createAsyncThunk } from "@reduxjs/toolkit";
import { firebaseAdapter } from "shared/services/firebase";
import { AppleSSOProvider, GoogleSSOProvider } from "shared/services/sso";

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------

export const loginWithEmailThunk = createAsyncThunk<void, { email: string; password: string }>(
  "auth/loginWithEmail",
  async ({ email, password }) => {
    await firebaseAdapter.signInWithEmail(email, password);
  },
);

export const signUpWithEmailThunk = createAsyncThunk<void, { email: string; password: string }>(
  "auth/signUpWithEmail",
  async ({ email, password }) => {
    await firebaseAdapter.signUpWithEmail(email, password);
  },
);

// ---------------------------------------------------------------------------
// SSO
// ---------------------------------------------------------------------------

export const loginWithGoogleThunk = createAsyncThunk<void, void>(
  "auth/loginWithGoogle",
  async () => {
    const provider = new GoogleSSOProvider();
    const { credential } = await provider.signIn();

    await firebaseAdapter.signInWithCredential(credential);
  },
);

export const loginWithAppleThunk = createAsyncThunk<void, void>("auth/loginWithApple", async () => {
  const provider = new AppleSSOProvider();
  const { credential } = await provider.signIn();

  await firebaseAdapter.signInWithCredential(credential);
});

// ---------------------------------------------------------------------------
// Anonymous
// ---------------------------------------------------------------------------

export const loginAnonymouslyThunk = createAsyncThunk<void, void>(
  "auth/loginAnonymously",
  async () => {
    await firebaseAdapter.signInAnonymously();
  },
);

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------

export const logoutThunk = createAsyncThunk<void, void>("auth/logout", async () => {
  const googleProvider = new GoogleSSOProvider();

  await firebaseAdapter.signOut();

  // Clear the native Google session so silent sign-in doesn't auto-restore it
  if (await googleProvider.signInSilently()) {
    await googleProvider.signOut();
  }

  // Apple: no explicit signOut needed — iOS manages the session
});
