import type { TFirebaseAuthUser } from "shared/auth/IAuthRepository";

export type TAuthUser = { id: string; name?: string } | null;
export interface IAuthSchema {
  isAuthenticated: boolean;
  user?: Partial<TFirebaseAuthUser>;
  pendingLink: string | null;
}
