# 01 — Authentication & Authorization

> Audit date: 2026-03-11
> Status: **In progress** — Firebase flow stable, backend integration incomplete

---

## Current Architecture

```
app/providers/AuthProvider/
  └── AuthProvider.tsx        ← creates singletons, listens to onAuthStateChanged

shared/auth/
  ├── IAuthRepository.ts      ← interface + TFirebaseAuthUser, TCredential
  ├── AuthContext.tsx          ← Context with methods only (no user/isLoading)
  ├── SessionService.ts        ← Firebase idToken ↔ Backend JWT exchange + refresh
  └── authFetch.ts             ← fetch wrapper with Bearer token + 401 retry

shared/services/
  ├── firebase/FirebaseAdapter.ts   ← implements IAuthRepository via RN Firebase
  └── sso/
      ├── ISsoProvider.ts      ← interface for SSO providers
      ├── googleProvider.ts    ← Google Sign-In implementation
      └── appleProvider.ts     ← empty (not implemented)

entities/auth/
  ├── authSchema.ts            ← IAuthSchema, TAuthUser (unused)
  └── model/
      ├── slice/authSlice.ts   ← initializeAuth, loginSuccess, logout, setPendingLink
      └── selectors/selectors.ts

features/auth/
  └── hooks/useAuth.ts         ← public hook for UI: loginWithEmail, loginWithGoogle, logout...

screens/Auth/
  ├── LoginScreen.tsx
  ├── SignupScreen.tsx          ← form only, no backend call
  ├── ForgotPasswordScreen.tsx  ← mock setTimeout, no real API
  ├── EmailConfirmationScreen.tsx ← no real verification
  └── SMSConfirmationScreen.tsx   ← no real verification
```

### Architectural intent (Firebase vs Backend)

**Separation of concerns (intentional design):**
- **Firebase** = Authentication — verifies identity, manages sessions, issues idTokens
- **Backend** = Authorization — verifies Firebase idToken, manages its own JWT session, stores user profiles and permissions

This follows the Firebase documentation pattern (`onAuthStateChanged` as single source of truth) and is the correct approach. Redux state updates are driven by `onAuthStateChanged` events in `AuthProvider`, not by direct dispatches in `useAuth` — this is intentional and correct.

> **Dev bypass (active):** `AuthProvider.catch` dispatches `initializeAuth()` on session exchange failure, which marks the app as initialized without requiring login. This allows development without filling in login forms. **Must be removed before production.**

---

### Auth flow (as implemented)

```
App start
  → AuthProvider mounts
  → authRepo.onAuthStateChanged() registered

Firebase state change (user signed in)
  → SessionService.syncForUser(u)        ← exchange idToken for backend JWT
  → dispatch(loginSuccess(userInfo))
  → NavigationProvider reads isInitialized + isAuthenticated → route to Main

Firebase state change (user signed out)
  → SessionService.clearSession()
  → dispatch(logout())
  → NavigationProvider → route to Auth stack

UI actions (LoginScreen)
  → useAuth().loginWithEmail(email, pwd)
  → authCtx.signInWithEmail(email, pwd)  ← calls FirebaseAdapter
  → Firebase signs in → onAuthStateChanged fires → Redux updated (indirectly)
```

### Redux auth state

```ts
interface IAuthSchema {
  isInitialized: boolean;   // true after first onAuthStateChanged resolves
  isAuthenticated: boolean;
  user: Partial<TFirebaseAuthUser> | null;  // Firebase-shaped user in Redux
  pendingLink: string | null;
}
```

---

## Problems

### 🟡 AUTH-ARCH-01 — Registration works, but profile fields (firstName, lastName, phone) are dropped

**The registration flow actually works correctly.** Backend uses `createOrUpdateFromFirebase` (upsert). `POST /auth/firebase` handles both login and first-time registration transparently — when `signUpWithEmail` creates a Firebase account, `onAuthStateChanged` fires → `SessionService.syncForUser` → backend auto-creates user record.

**However**, `SignupScreen` collects `firstName`, `lastName`, `phone` that currently go nowhere:

| Field | Firebase | Backend DB | Status |
|-------|----------|------------|--------|
| `email` | ✅ | ✅ `email` column | synced via decoded token |
| `displayName` | via `updateProfile()` | ✅ `displayName` column | synced, but never set after signup |
| `firstName` | ❌ no field | ❌ no column | **collected in form, then dropped** |
| `lastName` | ❌ no field | ❌ no column | **collected in form, then dropped** |
| `phone` | via linkWithPhoneNumber | ❌ no column | **collected in form, then dropped** |

**Resolution options (decision needed):**
1. Quick: call `auth().currentUser.updateProfile({ displayName: firstName + ' ' + lastName })` after Firebase signup — backend will pick it up via decoded token on next `syncForUser`
2. Full: add `firstName`, `lastName`, `phone` columns to backend + `PUT /users/profile` endpoint
3. Simplify: remove `firstName`/`lastName` from `SignupScreen` for now, collect later in onboarding

---

### 🟡 AUTH-ARCH-02 — `TAuthUser` type defined but never used

`authSchema.ts` defines `TAuthUser = { id: string; name?: string } | null` but:
- `IAuthSchema.user` is typed as `Partial<TFirebaseAuthUser>`, not `TAuthUser`
- `TAuthUser` is exported but imported nowhere

The Redux user stores a Firebase-shaped object. Eventually it should store a **backend user** (with `id` from the database, not Firebase `uid`). This is the right direction but needs to be formalized.

---

### 🟡 AUTH-ARCH-03 — `useAuth` has dead imports and dead code

```ts
// useAuth.ts line 3 — loginSuccess and logoutAction are imported but never dispatched
import { loginSuccess, logout as logoutAction, setPendingLink } from "entities/auth";

// loginAnonymously — creates userInfo but never dispatches or returns it
const loginAnonymously = useCallback(async () => {
  const user = await authCtx.signInAnonymously();
  const userInfo = { ...user, getIdToken: undefined }; // ← dead variable
}, [authCtx]);
```

Redux is only updated via `onAuthStateChanged` in `AuthProvider` — this works, but the dead code is confusing and suggests the pattern wasn't intentional.

---

### 🟡 AUTH-ARCH-04 — `GoogleSSOProvider` instantiated on every call

```ts
// loginWithGoogle — new instance + configure() on every press
const loginWithGoogle = useCallback(async () => {
  const provider = new GoogleSSOProvider(); // ← new every call
  ...
}, [authCtx]);

// logout — new instance again, calls singInSilently() for ALL users
const logout = useCallback(async () => {
  await authCtx.signOut();
  const provider = new GoogleSSOProvider(); // ← new every call
  if (await provider.singInSilently()) {    // ← runs even for email users
    await provider.signOut();
  }
}, [authCtx]);
```

Problems:
1. `GoogleSignin.configure()` runs on every call
2. `logout` calls `singInSilently()` even when user logged in with email (unnecessary noise)
3. No way to know which provider the user authenticated with

---

### 🟢 AUTH-ARCH-05 — `singInSilently` typo in `ISsoProvider`

```ts
interface ISsoProvider {
  singInSilently(): Promise<...>; // ← missing 'g', should be signInSilently
}
```
Typo propagated to `GoogleSSOProvider.singInSilently()` and `useAuth.logout()`.

---

### 🟢 AUTH-ARCH-06 — `raw` destructuring can throw in `loginWithGoogle`

```ts
const { raw: { idToken }, credential } = await provider.signIn();
//           ↑ throws if raw is undefined
```

`ISsoProvider.signIn()` declares `raw?` as optional. If the provider returns without `raw`, this destructuring throws an unhandled error instead of a meaningful message.

---

### 🟢 AUTH-ARCH-07 — `appleProvider.ts` is an empty file

File exists but contains only 1 line. Either implement or delete.

---

### 🟢 AUTH-03 — `console.log` in AuthProvider (existing issue)

```ts
console.log("[FIREBASE Auth Callback] User signed in!");
console.warn("[FIREBASE Auth Callback] Session exchange failed: ", e);
console.log("[FIREBASE Auth Callback] User signed out!");
```
Should use a logger service or be removed before production.

---

### 🟢 AUTH-04 — `signUpWithEmail` has no try/catch (existing issue)

`FirebaseAdapter.signUpWithEmail` throws unhandled errors unlike `signInWithEmail` which has proper error mapping.

---

### 🟡 AUTH-ARCH-08 — `SessionService` failure leaves user in inconsistent state

When `syncForUser` fails (backend unreachable), `initializeAuth()` is dispatched:
- `isInitialized: true`, `isAuthenticated: false`
- But Firebase session IS valid — the user is authenticated with Firebase
- NavigationProvider will push to Auth screens while Firebase has a valid session

---

## Best Practices

### `onAuthStateChanged` as single source of truth ✅

Using `onAuthStateChanged` to drive Redux state (not direct dispatches from `useAuth`) is the **correct Firebase pattern**:
- It handles all auth events: initial load, sign-in, sign-out, token refresh, session expiry
- UI methods in `useAuth` fire-and-forget — they trigger Firebase state changes, which propagate to Redux
- This means `useAuth.loginWithEmail()` doesn't need to dispatch `loginSuccess` — Firebase will call `onAuthStateChanged` which does it

---

### Firebase + Custom Backend pattern ✅ (as implemented)

The backend has a single endpoint `POST /auth/firebase` that handles both login and registration via upsert:

```
Any Firebase auth event (signIn, signUp, Google, etc.)
  → onAuthStateChanged fires in AuthProvider
  → SessionService.syncForUser(firebaseUser)
      → firebaseUser.getIdToken()
      → POST /auth/firebase { idToken }
      → Backend: verifyIdToken → createOrUpdateFromFirebase(uid, { email, displayName, ... })
      → Returns { accessToken, refreshToken, expiresIn }
  → Tokens stored securely (react-native-keychain)
  → dispatch(loginSuccess(firebaseUser))

Backend user fields populated automatically from Firebase decoded token:
  uid, email, displayName, photoURL, provider — all from Firebase IdToken claims
```

**Note:** Backend does NOT return user profile data in the auth response — only tokens. User identity in Redux comes from Firebase, not from the backend DB.

### Missing: refresh token endpoint

`SessionService` has `refreshAccessTokenIfNeeded()` logic, but the backend currently only has `POST /auth/firebase`. There is no `POST /auth/refresh` endpoint. When the access token expires, the service should re-exchange the Firebase idToken (which auto-refreshes) rather than storing a long-lived refresh token separately.

### Auth provider tracking

Track which provider was used:
```ts
interface IAuthSchema {
  provider: 'email' | 'google' | 'apple' | 'anonymous' | null;
}
```
This allows `logout` to only sign out from the relevant provider.

---

## Proposed Architecture

### Registration flow (actual, no changes needed to SessionService)

```
SignupScreen
  → useAuth().signupWithEmail(email, pwd)
  → authCtx.signUpWithEmail(email, pwd)        ← Firebase creates auth record
  → onAuthStateChanged fires automatically
  → SessionService.syncForUser(u)              ← POST /auth/firebase → backend upserts user
  → dispatch(loginSuccess(firebaseUser))

After signup, optionally set displayName in Firebase:
  → auth().currentUser.updateProfile({ displayName: firstName + ' ' + lastName })
  → next syncForUser will propagate it to backend via decoded token
```

### Profile fields (firstName, lastName, phone) — **DECISION: postpone to onboarding**

`SignupScreen` упрощается до `email` + `password`. Профиль (`firstName`, `lastName`, `phone`) будет собираться в onboarding-экране после первого входа. Backend User entity не трогаем пока.

### Refresh token strategy — **DECISION: Firebase getIdToken(force)**

Firebase SDK автоматически обновляет свой idToken каждые ~50 минут (до истечения 1 часа). При 401 от бэкенда:

```
authFetch: 401 received
  → SessionService.refreshAccessTokenIfNeeded()
  → firebase.getIdToken(force: true)   ← Firebase тихо обновляет токен через сеть
  → POST /auth/firebase { idToken: freshToken }
  → Store new accessToken (replace old)
  → Retry original request once

Если и retry → 401: throw AuthError, dispatch logout()
```

Следствие: **`refreshToken` из бэкенда можно не хранить** — он нигде не используется. Можно убрать из `TokenService`, миграции БД и `SessionService.secureStore`. Бэкенд возвращает только `{ accessToken, expiresIn }`.

Firebase также предоставляет `onIdTokenChanged` — listener, который срабатывает при каждом обновлении токена. Можно использовать для проактивного обновления backend accessToken (до 401).

### SSO provider management

```ts
// shared/services/sso/SSORegistry.ts — singleton map
const providers: Record<string, ISsoProvider> = {};
export const getProvider = (id: string): ISsoProvider => {
  if (!providers[id]) providers[id] = createProvider(id);
  return providers[id];
};
```
Track `provider` in Redux auth state (`'email' | 'google' | 'apple' | 'anonymous' | null`) so `logout` only signs out from the right provider.

---

## Task Breakdown

### 🔴 Large

| ID | Task |
|----|------|
| AUTH-L1 | Implement Apple Sign-In: `appleProvider.ts`, link Apple credential, add to `useAuth.loginWithApple()` |
| AUTH-L2 | Implement onboarding screen(s) for profile collection after first login (firstName, lastName, phone) + `PUT /users/profile` backend endpoint |
| AUTH-L3 | Implement biometric auth: `useBiometric` hook, `LocalAuthentication` from expo or `react-native-biometrics`, integrate with `LoginScreen` |

### 🟡 Medium

| ID | Task |
|----|------|
| AUTH-M1 | Refactor `SessionService.refreshAccessTokenIfNeeded` → use `firebase.getIdToken(force: true)` + re-POST to `/auth/firebase`; remove `refreshToken` storage |
| AUTH-M2 | Add `provider` field to Redux auth state; fix `logout` to only sign out from current SSO provider |
| AUTH-M3 | Implement real `EmailConfirmationScreen`: Firebase `sendEmailVerification` + polling/deep link for `checkActionCode` |
| AUTH-M4 | Implement `ForgotPasswordScreen`: Firebase `sendPasswordResetEmail` (1 line, no backend needed) |
| AUTH-M5 | Handle `SessionService.syncForUser` failure: retry 1x, then mark as authenticated-but-offline instead of unauth |
| AUTH-M6 | Implement `onIdTokenChanged` listener for proactive backend token refresh (instead of reactive 401 retry) |

### 🟢 Small

| ID | Task |
|----|------|
| AUTH-S1 | Simplify `SignupScreen` — remove `firstName`, `lastName`, `phone` fields; only `email` + `password` + terms checkbox |
| AUTH-S2 | Remove dead imports in `useAuth.ts` (`loginSuccess`, `logoutAction`) |
| AUTH-S3 | Remove dead `userInfo` variable in `loginAnonymously` |
| AUTH-S4 | Fix `singInSilently` → `signInSilently` typo in `ISsoProvider`, `GoogleSSOProvider`, `useAuth` |
| AUTH-S5 | Add optional chaining: `raw?.idToken` in `loginWithGoogle` |
| AUTH-S6 | Delete or stub `appleProvider.ts` with a `NotImplementedError` comment |
| AUTH-S7 | Remove `console.log`/`console.warn` from `AuthProvider` and `FirebaseAdapter` |
| AUTH-S8 | Add try/catch to `FirebaseAdapter.signUpWithEmail` |
| AUTH-S9 | Remove backend's `refreshToken` field — it's stored but never used; return only `{ accessToken, expiresIn }` |
