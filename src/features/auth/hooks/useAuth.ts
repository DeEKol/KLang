import { useCallback } from "react";
import { useAppDispatch } from "app/providers/StoreProvider";
import { loginSuccess, logout as logoutAction, setPendingLink } from "entities/auth";
import { useAuthContext } from "shared/auth/AuthContext";
import type { TFirebaseAuthUser } from "shared/auth/IAuthRepository";
import { GoogleSSOProvider } from "shared/services/sso/googleProvider";

/**
 * useAuth — публичный hook, который используют UI-компоненты (LoginScreen и т.д.)
 * Он скрывает детали реализации (Firebase, backend) и диспатчит состояние в entities/auth.
 */
export function useAuth() {
  const authCtx = useAuthContext();
  const dispatch = useAppDispatch();

  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      // const res = await authCtx.loginWithEmail(email, password);
      const user: TFirebaseAuthUser = await authCtx.signInWithEmail(email, password);

      return user;
    },
    [authCtx],
  );

  const loginAnonymously = useCallback(async () => {
    const user = await authCtx.signInAnonymously();
    const userInfo = {
      ...user,
      getIdToken: undefined,
    };
  }, [authCtx]);

  const signupWithEmail = useCallback(
    async (email: string, password: string) => {
      const user: TFirebaseAuthUser = await authCtx.signUpWithEmail(email, password);

      return user;
    },
    [authCtx],
  );

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleSSOProvider();

    const {
      raw: { idToken },
      credential,
    } = await provider.signIn();

    const user = await authCtx.signInWithSso("google", {
      credential,
    });

    return user;
  }, [authCtx]);

  const logout = useCallback(async () => {
    await authCtx.signOut();
    // TODO: sign out from all providers or need store current provider
    const provider = new GoogleSSOProvider();

    if (await provider.singInSilently()) {
      await provider.signOut();
    }
  }, [authCtx]);

  const setPending = useCallback(
    (url: string) => {
      dispatch(setPendingLink(url));
    },
    [dispatch],
  );

  return {
    loginWithEmail,
    signupWithEmail,
    loginAnonymously,
    loginWithGoogle,
    logout,
    setPending,
  };
}
