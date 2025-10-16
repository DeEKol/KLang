import * as Keychain from "react-native-keychain";

const BACKEND_TOKEN_KEY = "app.backend.token";
const BACKEND_REFRESH_KEY = "app.backend.refresh";

export const SecureStore = {
  async setBackendToken(token: string) {
    await Keychain.setGenericPassword(BACKEND_TOKEN_KEY, token, { service: BACKEND_TOKEN_KEY });
  },
  async getBackendToken(): Promise<string | null> {
    const creds = await Keychain.getGenericPassword({ service: BACKEND_TOKEN_KEY });
    return creds ? creds.password : null;
  },
  async removeBackendToken() {
    await Keychain.resetGenericPassword({ service: BACKEND_TOKEN_KEY });
  },
  async setBackendRefresh(refresh: string) {
    await Keychain.setGenericPassword(BACKEND_REFRESH_KEY, refresh, {
      service: BACKEND_REFRESH_KEY,
    });
  },
  async getBackendRefresh(): Promise<string | null> {
    const creds = await Keychain.getGenericPassword({ service: BACKEND_REFRESH_KEY });
    return creds ? creds.password : null;
  },
  async removeBackendRefresh() {
    await Keychain.resetGenericPassword({ service: BACKEND_REFRESH_KEY });
  },
  async clearAll() {
    await Promise.all([this.removeBackendToken(), this.removeBackendRefresh()]);
  },
};

export default SecureStore;

// TODO: реализовать flow Biometric:
// - запросить биометрию (react-native-keychain / LocalAuthentication)
// - при успехе извлечь сохранённые creds из secure storage и вызвать repo.loginWithStoredCreds()
