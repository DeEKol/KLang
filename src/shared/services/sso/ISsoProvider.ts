import type { TCredential } from "shared/services/firebase";

export interface ISsoProvider {
  readonly id: string;
  signIn(): Promise<{ credential: TCredential }>;
  signInSilently(): Promise<{ credential: TCredential } | null>;
  signOut?(): Promise<void>;
}
