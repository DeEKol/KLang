import { apiClient } from "../api/client";
import { firebaseAdapter } from "../services/firebase";
import { SecureStore } from "../storage/secureStore";

import type { TAuthUser } from "./IAuthRepository";

type ExchangeResult = {
  accessToken: string;
  expiresIn?: number;
};

export class SessionService {
  private currentExchangePromise: Promise<ExchangeResult | null> | null = null;
  private currentRefreshPromise: Promise<string | null> | null = null;
  private exchangeForUid: string | null = null;
  // backoff config
  private maxRetries = 2;
  private baseDelay = 1000; // ms

  async syncForUser(user: TAuthUser | null) {
    if (!user) {
      await this.clearSession();
      return;
    }

    await this._exchangeIdTokenAndStoreSingleFlight(user.uid);
  }

  // Get stored access token, or attempt refresh if missing/expired
  async getAccessToken(): Promise<string | null> {
    const token = await SecureStore.getBackendToken();

    if (token) return token;

    return this.refreshAccessTokenIfNeeded();
  }

  // * Force refresh flow (called by apiClient on 401)
  async refreshAccessTokenIfNeeded(): Promise<string | null> {
    if (this.currentRefreshPromise) return this.currentRefreshPromise;

    this.currentRefreshPromise = this._refreshAccessTokenInternal().finally(() => {
      this.currentRefreshPromise = null;
    });

    return this.currentRefreshPromise;
  }

  async clearSession() {
    this.exchangeForUid = null;

    await SecureStore.clearAll();
  }

  // * internal helpers
  private async _exchangeIdTokenAndStoreSingleFlight(uid: string): Promise<ExchangeResult | null> {
    // If there is already an exchange in flight:
    if (this.currentExchangePromise) {
      // If it's for the same uid, reuse it
      if (this.exchangeForUid === uid) return this.currentExchangePromise;
      // If it's for a different uid, we prefer to start a new exchange but mark existing one as stale
      // So we "invalidate" existing by bumping exchangeForUid below
    }

    // mark that exchange is for this uid
    this.exchangeForUid = uid;

    const localPromise = (async () => {
      let idToken: string;

      try {
        const token = await firebaseAdapter.getIdToken();
        if (!token) throw new Error("No Firebase user");
        idToken = token;
      } catch (e) {
        throw new Error("Failed to get idToken: " + String(e));
      }

      // * perform network exchange with retries/backoff
      let lastErr: unknown = null;

      for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
        try {
          const resp = await apiClient.post("/mob/users/auth", { idToken });

          const result: ExchangeResult = {
            accessToken: resp.accessToken || resp.token, // adapt payload
            expiresIn: resp.expiresIn,
          };
          // * stale result protection
          // * only store if currently still exchanging for this uid
          if (this.exchangeForUid === uid) {
            if (result.accessToken) {
              await SecureStore.setBackendToken(result.accessToken);
            }

            return result;
          } else {
            // Stale: someone else started exchange for different uid — ignore storing
            return null;
          }
        } catch (err) {
          lastErr = err;
          const delay = this.baseDelay * Math.pow(2, attempt);

          await this.sleep(delay);

          continue;
        }
      }
      throw lastErr;
    })();

    this.currentExchangePromise = localPromise;

    try {
      return await localPromise;
    } finally {
      // * clear only if it still points to this local promise (no overlapping reset)
      if (this.currentExchangePromise === localPromise) this.currentExchangePromise = null;
    }
  }

  private async _refreshAccessTokenInternal(): Promise<string | null> {
    // Firebase auto-refreshes its own token — use it to get a fresh backend JWT
    let idToken: string | null = null;

    try {
      idToken = await firebaseAdapter.getIdToken(true);
    } catch {
      return null;
    }

    if (!idToken) return null;

    let lastErr: unknown = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const resp = await apiClient.post("/mob/users/auth", { idToken });

        if (resp?.accessToken) {
          await SecureStore.setBackendToken(resp.accessToken);
          return resp.accessToken;
        }

        return null;
      } catch (err) {
        lastErr = err;
        const delay = this.baseDelay * Math.pow(2, attempt);

        await this.sleep(delay);
      }
    }

    // refresh failed: clear session to force re-auth at next onAuthStateChanged
    await this.clearSession();
    console.error("SessionService: refresh failed", lastErr);

    return null;
  }

  private sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }
}

export const sessionService = new SessionService();
