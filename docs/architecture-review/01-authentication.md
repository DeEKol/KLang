# 01 — Authentication & Authorization

> Audit date: 2026-03-11 | Last updated: 2026-03-22
> Status: **In progress** — auth refactored to Redux Thunks, Apple Sign-In implemented (needs native setup)

---

## Current Architecture

```
app/providers/AuthProvider/
  └── AuthProvider.tsx        ← lifecycle only: onAuthStateChanged → dispatch to Redux
app/providers/StoreProvider/
  └── globals.d.ts            ← declare global RootState / AppDispatch (FSD exception for Redux infra)

shared/auth/
  ├── IAuthRepository.ts      ← interface IAuthRepository, TAuthUser, TCredential
  ├── SessionService.ts       ← Firebase idToken ↔ Backend JWT exchange + refresh
  ├── authFetch.ts            ← fetch wrapper with Bearer token + 401 retry
  └── index.ts                ← public API: TAuthUser, TCredential, IAuthRepository, sessionService

shared/services/
  ├── firebase/
  │   ├── FirebaseAdapter.ts  ← implements IAuthRepository via RN Firebase
  │   └── index.ts            ← public API: firebaseAdapter
  └── sso/
      ├── ISsoProvider.ts      ← interface: { id, signIn, signInSilently, signOut? }
      ├── googleProvider.ts    ← Google Sign-In (GoogleSignin + GoogleAuthProvider)
      ├── appleProvider.ts     ← Apple Sign-In (appleAuth + OAuthProvider) ⚠️ needs native setup
      └── index.ts             ← public API: GoogleSSOProvider, AppleSSOProvider, ISsoProvider

entities/auth/
  ├── authSchema.ts            ← IAuthSchema, uses TAuthUser from shared/auth
  └── model/
      ├── slice/authSlice.ts   ← initializeAuth, loginSuccess, logout, setPendingLink, clearPendingLink
      ├── selectors/selectors.ts ← typed via { auth: IAuthSchema }, no RootState import
      └── thunks/authThunks.ts ← loginWithEmailThunk, loginWithGoogleThunk,
                                  loginWithAppleThunk, loginAnonymouslyThunk,
                                  signUpWithEmailThunk, logoutThunk

features/auth/
  └── hooks/useAuth.ts         ← dispatches thunks; public API for UI components

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

This follows the Firebase documentation pattern (`onAuthStateChanged` as single source of truth). Redux state updates are driven exclusively by `onAuthStateChanged` events in `AuthProvider`. `useAuth` methods dispatch Redux Thunks that trigger Firebase, which in turn fires `onAuthStateChanged`.

> **Dev bypass (active):** On `SessionService` failure, `initializeAuth()` is dispatched, marking the app as initialized without requiring login. Allows development without auth. **Must be removed before production.**

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
  → useAuth().loginWithEmail(email, pwd)   ← dispatch(loginWithEmailThunk)
  → FirebaseAdapter.signInWithEmail()      ← called directly from thunk
  → Firebase signs in → onAuthStateChanged fires → Redux updated

UI actions (Google / Apple)
  → useAuth().loginWithGoogle()            ← dispatch(loginWithGoogleThunk)
  → GoogleSSOProvider.signIn()             ← get credential
  → FirebaseAdapter.signInWithSso()        ← sign in with credential
  → onAuthStateChanged fires → Redux updated

Logout
  → useAuth().logout()                     ← dispatch(logoutThunk)
  → FirebaseAdapter.signOut()              ← clears Firebase session + keychain
  → GoogleSSOProvider.signInSilently()     ← check if Google session active
  → GoogleSSOProvider.signOut()            ← clear native Google session if needed
  → Apple: no explicit signOut (iOS manages session)
  → onAuthStateChanged fires with null → dispatch(logout())
```

### Redux auth state

```ts
interface IAuthSchema {
  isInitialized: boolean;   // true after first onAuthStateChanged resolves
  isAuthenticated: boolean;
  isLoading: boolean;       // true while a thunk is in-flight
  error: string | null;
  user: TAuthUser | null;   // serializable Firebase-shaped user { uid, email, displayName, phoneNumber, photoURL }
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

### ✅ AUTH-ARCH-02 — `TAuthUser` type — FIXED

`IAuthSchema.user` is now typed as `TAuthUser | null` (serializable: `uid, email, displayName, phoneNumber, photoURL`).
`TAuthUser` is defined in `shared/auth/IAuthRepository.ts` and exported via `shared/auth/index.ts`.
When a backend user type is needed (with DB `id`), a separate `TBackendUser` should be introduced.

---

### ✅ AUTH-ARCH-03 — `useAuth` dead code — FIXED

Removed `AuthContext` entirely. `useAuth` now dispatches Redux Thunks directly. No dead imports.

---

### ✅ AUTH-ARCH-04 — `GoogleSSOProvider` instantiated on every call — partially mitigated

Providers are now instantiated inside thunks (one level deeper). `GoogleSignin.configure()` still runs on every call — acceptable since `configure()` is idempotent. Root fix is AUTH-M2 (store active provider in Redux).

---

### ✅ AUTH-ARCH-05 — `singInSilently` typo — FIXED

Renamed to `signInSilently` in `ISsoProvider`, `GoogleSSOProvider`, and `authThunks`.

---

### ✅ AUTH-ARCH-06 — `raw` destructuring — FIXED

`raw` removed from `ISsoProvider.signIn()` return type. Thunks use only `{ credential }`.

---

### ✅ AUTH-ARCH-07 — `appleProvider.ts` empty — FIXED

`AppleSSOProvider` implemented with `@invertase/react-native-apple-authentication` + Firebase `OAuthProvider`.

> **⚠️ Native setup required before Apple Sign-In will work:**
> 1. `bundle exec pod install` — link the new native pod
> 2. Xcode → target → **Signing & Capabilities** → `+` → **Sign in with Apple**
> 3. In Apple Developer Console — enable Sign In with Apple capability for the App ID
>
> Without step 2, the `appleAuth.performRequest()` call will throw at runtime on a real device.

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

### ✅ AUTH-ARCH-08 — `SessionService` failure — FIXED

`syncForUser` no longer swallows errors. If `_exchangeIdTokenAndStoreSingleFlight` throws (all retries exhausted), the error propagates to `AuthProvider`, which catches it and dispatches `initializeAuth()`:

- `isInitialized: true`, `isAuthenticated: false` → NavigationProvider routes to Auth stack
- Firebase session remains valid — user can retry login

Longer-term fix (AUTH-M5): retry 1x, then mark `authenticated-but-offline` instead of unauthenticated.

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

| ID | Task | Status |
|----|------|--------|
| AUTH-L1 | Apple Sign-In native setup: `pod install` + Xcode capability + Apple Dev Console | ⏳ pending (native) |
| AUTH-L2 | Implement onboarding screen(s) for profile collection after first login (firstName, lastName, phone) + `PUT /users/profile` backend endpoint | ⏳ pending |
| AUTH-L3 | Implement biometric auth: `useBiometric` hook, `react-native-biometrics`, integrate with `LoginScreen` | ⏳ pending |

### 🟡 Medium

| ID | Task | Status |
|----|------|--------|
| AUTH-M1 | Refactor `SessionService.refreshAccessTokenIfNeeded` → `firebase.getIdToken(force: true)` + re-POST to `/auth/firebase`; remove `refreshToken` storage | ⏳ pending |
| AUTH-M2 | Add `provider` field to Redux auth state; `logoutThunk` signs out only from the active provider | ⏳ pending |
| AUTH-M3 | Real `EmailConfirmationScreen`: Firebase `sendEmailVerification` + deep link for `checkActionCode` | ⏳ pending |
| AUTH-M4 | Real `ForgotPasswordScreen`: Firebase `sendPasswordResetEmail` | ⏳ pending |
| AUTH-M5 | `SessionService.syncForUser` failure → retry 1x, then mark authenticated-but-offline instead of unauth | ⏳ pending |
| AUTH-M6 | `onIdTokenChanged` listener for proactive backend token refresh (before 401) | ⏳ pending |

### 🟢 Small

| ID | Task | Status |
|----|------|--------|
| AUTH-S1 | Simplify `SignupScreen` — remove `firstName`, `lastName`, `phone`; only `email` + `password` | ⏳ pending |
| AUTH-S2 | Remove dead imports in `useAuth.ts` | ✅ done |
| AUTH-S3 | Remove dead `userInfo` variable in `loginAnonymously` | ✅ done |
| AUTH-S4 | Fix `singInSilently` typo in `ISsoProvider`, `GoogleSSOProvider`, `authThunks` | ✅ done |
| AUTH-S5 | Remove `raw` from `ISsoProvider.signIn()` return type | ✅ done |
| AUTH-S6 | Implement `appleProvider.ts` | ✅ done |
| AUTH-S7 | Remove `console.log`/`console.warn` from `AuthProvider` and `FirebaseAdapter` | ⏳ pending |
| AUTH-S8 | Add try/catch to `FirebaseAdapter.signUpWithEmail` | ✅ done |
| AUTH-S9 | Remove backend's `refreshToken` field — stored but never used | ✅ done |
| AUTH-S10 | Add `index.ts` for `shared/services/firebase/` and `shared/services/sso/`; fix all direct sub-folder imports | ✅ done |
| AUTH-S11 | Fix FSD: `shared/lib/redux/hooks.ts` — global `RootState`/`AppDispatch` via `globals.d.ts`; `selectors.ts` — typed via `{ auth: IAuthSchema }` | ✅ done |
