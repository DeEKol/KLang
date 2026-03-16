# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm start                  # Start Metro bundler
npm run android            # Run on Android
npm run ios                # Run on iOS

# Testing
npm test                   # Run all tests
npm test -- path/to/test   # Run a single test file
npm test -- --testNamePattern="test name"  # Run tests by name

# Linting & Formatting
npm run lint               # ESLint check
npm run lint:fix           # ESLint auto-fix
npm run format             # Prettier write
npm run fix-all            # lint:fix + format
npm run validate           # lint + format:check (CI-ready)

# iOS CocoaPods (when native dependencies change)
bundle exec pod install    # Install pods
npm run pod-clean          # Full pod reset (deintegrate + cache clean + rm)

# Utilities
npm run dump               # Dump src/ file structure for AI analysis
npm run dump:mini          # Dump with minified content
npm run check-styles       # Find unused styles in *.styles.ts files
```

## Architecture

Korean language learning React Native app (iOS/Android) using **Feature-Sliced Design (FSD)**:

```
src/
├── app/         # Root App.tsx, providers (Redux, Navigation, Theme, UI, Auth)
├── entities/    # Domain models — auth, theme (Counter/PostsTestApi = test, delete)
├── features/    # Feature slices — auth (useAuth hook)
│                # HangelBoard, SequencesBuilder ← TODO: move to modules/games/
├── screens/     # Full-screen components mounted by the navigator
├── shared/      # Cross-cutting: config, helpers, api, auth, lib, ui, services, storage
├── widgets/     # Complex composite components (currently empty)
└── modules/     # Non-FSD layer — games (WordMatcher, HangelBoard*, SequencesBuilder*)
```

**Import rules (ESLint):** Import only via a layer's public `index.ts`, never directly into `ui/`, `model/`, or `types/` subfolders of another layer.

**Path aliases** configured in `babel.config.js` and `tsconfig.json`:
`app`, `entities`, `features`, `screens`, `shared`, `widgets` → `./src/<layer>`
⚠️ `modules/` alias is NOT configured yet — use relative paths for now.

## State Management

Redux Toolkit + Redux Persist. Store schema: `src/app/providers/StoreProvider/types/stateSchema.ts`.
- Only `theme.mode` is currently persisted. Settings/auth state not persisted (auth is restored via Firebase onAuthStateChanged).
- Auth state: single source of truth = Redux (`isInitialized`, `isAuthenticated`, `user`). AuthContext holds only methods.
- Typed hooks: use `useAppDispatch` / `useAppSelector` from `app/providers/StoreProvider` (TODO: move to `shared/lib/redux/hooks.ts`).

## Authentication

- Firebase Auth → `onAuthStateChanged` in `AuthProvider` is the single source of truth
- On auth state change: `SessionService.syncForUser()` → `POST /auth/firebase { idToken }` → backend JWT stored in keychain
- `authFetch.ts` wraps fetch with auto Bearer token + 401 retry
- Auth flash prevention: `NavigationProvider` shows `SplashScreen` while `!isInitialized`
- **Do NOT add auth state to AuthContext** — methods only, state lives in Redux

## Navigation

React Navigation v7 — Native Stack + Bottom Tabs. Auth stack → Main tabs (Home, Study, Practice, Settings, Test).
- Navigation types: `src/shared/config/navigation/types/navigation.ts`
- Typed navigation hooks: `useAppNavigation`, `usePracticeNavigation`, `useAppRoute`
- External navigation: `navigate()`, `resetTo()` from `src/shared/config/navigation/utils.ts`

## Theme System

```
shared/lib/theme/          # Pure: types, EPalette, createTheme(), mapTokensToMD3(), utils
entities/theme/            # Redux: IThemeSchema, themeSlice, getThemeMode selector
app/providers/UIProvider/  # PaperProvider + ThemeInitializer
```

- `useThemeTokens()` → returns `IThemeTokens` with `colors`, `spacing`, `typography`
- `*.styles.ts` pattern: `export default function createStyles(colors: IThemeColors) { return StyleSheet.create({...}) }`
- ⚠️ `mapTokensToMD3` is currently commented out — Paper uses default MD3 colors (known issue THEME-01)
- Do NOT hardcode color literals — use `colors.primary`, `colors.surface`, etc. from tokens

## Games (modules/games/)

Lives outside FSD in `src/modules/games/`. Each game is self-contained:
```
modules/games/WordMatcher/
  entities/types.ts         # Game data types
  model/logic/useXxx.ts     # Game logic hook
  model/animation/          # Animation hooks (separate from logic)
  ui/                       # Render only
```
Games receive data via props (`words`, `config`) and return results via callbacks (`onComplete`). No direct Redux access inside games.

## Backend

NestJS + Hexagonal architecture. Single auth endpoint: `POST /auth/firebase { idToken }` → `{ accessToken, refreshToken, expiresIn }`. Handles both login AND registration (upsert). Backend DB: SQLite (dev only, needs PostgreSQL for prod).

## Key Libraries

- **UI**: React Native Paper 5.x (MD3), React Native Reanimated 4.x
- **Canvas**: @shopify/react-native-skia (HangelBoard)
- **Gestures**: react-native-gesture-handler
- **Auth**: @react-native-firebase/auth + @react-native-google-signin/google-signin
- **Storage**: react-native-keychain (tokens), @react-native-async-storage/async-storage (Redux Persist)
- **i18n**: i18next + react-i18next (ru/en); use `t('key')` — ESLint enforces no hardcoded strings in JSX
- **Forms**: react-hook-form + Zod
- **TTS**: react-native-tts

## Code Style

Prettier: 100-char lines, double quotes, trailing commas, single JSX attribute per line.
ESLint enforces: no inline styles, no color literals (`warn`), type-only imports, sorted imports.

**Naming conventions:**
- Components: `PascalCase.tsx`, hooks: `useXxx.ts`
- Types: `IXxx` (interface), `TXxx` (type alias), `EXxx` (enum)
- Redux slice exports: `{ actions: xxxActions, reducer: xxxReducer }`
- Theme-dependent styles: `Xxx.styles.ts` → `export default function createStyles(colors: IThemeColors)`

## Architecture Docs

Full audit in `docs/architecture-review/`:
- `01-authentication.md` — Firebase + backend JWT flow, auth state
- `02-navigation.md` — stacks, tabs, deep links, typed hooks
- `03-styles-and-theme.md` — token system, Paper integration, palette
- `04-games.md` — modules/games/ structure, game interface
- `05-fsd.md` — FSD violations, import rules
- `06-backend-integration.md` — API client, SessionService, backend endpoints
- `07-settings-screen.md` — settings state (all useState, needs Redux)
- `08-project-config-and-ci.md` — CI/CD, release builds, Jest, Babel aliases
- `NOTES.md` — decisions, known debt, open questions
