import type { TAuthProvider, TAuthUser } from "shared/auth/IAuthRepository";

export interface IAuthSchema {
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: TAuthUser | null;
  provider: TAuthProvider;
  pendingLink: string | null;
}
