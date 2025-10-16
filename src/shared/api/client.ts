import { API_BACKEND } from "@env";

import { SecureStore } from "../storage/secureStore";

export const apiClient = {
  async post(path: string, body: Record<string, unknown>, opts: { withAuth?: boolean } = {}) {
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (opts.withAuth) {
      const token = await SecureStore.getBackendToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BACKEND}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`API error ${res.status}`);
    }
  },
};
