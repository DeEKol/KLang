import type { TCredential } from "shared/auth/IAuthRepository";

export interface ISsoProvider {
  readonly id: string;
  signIn(): Promise<{ credential: TCredential }>;
  signInSilently(): Promise<{ credential: TCredential } | null>;
  signOut?(): Promise<void>;
}
