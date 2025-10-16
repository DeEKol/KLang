export interface ISsoProvider {
  id: string; // * 'google' | 'apple' | ...
  signIn(): Promise<{ credential: { accessToken: string }; raw?: { idToken: string } }>;
  singInSilently(): Promise<{ credential: { accessToken: string } } | null>;
  signUp?: () => Promise<{ credential: { accessToken: string } }>; // optional
}
