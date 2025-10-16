import { apiClient } from "../api/client";
import { SecureStore } from "../storage/secureStore";

import type { TFirebaseAuthUser } from "./IAuthRepository";

type ExchangeResult = {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
};

export class SessionService {
  private currentExchangePromise: Promise<ExchangeResult | null> | null = null;
  private currentRefreshPromise: Promise<string | null> | null = null;
  private exchangeForUid: string | null = null;
  // backoff config
  private maxRetries = 2;
  private baseDelay = 1000; // ms

  async syncForUser(user: TFirebaseAuthUser | null) {
    if (!user) {
      // * user signed out -> clear session
      await this.clearSession();
      return;
    }

    // * If a user is present, get idToken and exchange
    const uid = user.uid;

    // * Do single-flight exchange for this uid
    try {
      await this._exchangeIdTokenAndStoreSingleFlight(() => user.getIdToken(), uid);
    } catch (e) {
      console.error("session exchange failed: ", e);
      // optionally notify UI via event/dispatch
    }
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
  private async _exchangeIdTokenAndStoreSingleFlight(
    getIdTokenFn: () => Promise<string>,
    uid: string,
  ): Promise<ExchangeResult | null> {
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
        // * attempt to get idToken
        idToken = await getIdTokenFn();
      } catch (e) {
        throw new Error("Failed to get idToken: " + String(e));
      }

      // * perform network exchange with retries/backoff
      let lastErr: unknown = null;

      for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
        try {
          const resp = await apiClient.post("/auth/firebase", { idToken });
          console.log("Firebase exchange result:", resp);

          const result: ExchangeResult = {
            accessToken: resp.accessToken || resp.token || resp.token, // adapt payload
            refreshToken: resp.refreshToken,
            expiresIn: resp.expiresIn,
          };
          // * stale result protection**
          // * only store if currently still exchanging for this uid
          if (this.exchangeForUid === uid) {
            if (result.accessToken) {
              await SecureStore.setBackendToken(result.accessToken);
            }

            if (result.refreshToken) {
              await SecureStore.setBackendRefresh(result.refreshToken);
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
    const refreshToken = await SecureStore.getBackendRefresh();

    if (!refreshToken) return null;

    // * retry logic
    let lastErr: unknown = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const resp = await apiClient.post("/auth/refresh", { refreshToken });

        if (resp?.accessToken) {
          await SecureStore.setBackendToken(resp.accessToken);
        }

        if (resp?.refreshToken) {
          await SecureStore.setBackendRefresh(resp.refreshToken);
        }

        return resp.accessToken || null;
      } catch (err) {
        lastErr = err;
        const delay = this.baseDelay * Math.pow(2, attempt);

        await this.sleep(delay);
      }
    }
    // refresh failed: clear session to force re-auth at next onAuthStateChanged
    await this.clearSession();

    return null;
  }

  private sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }
}

export const sessionService = new SessionService();
