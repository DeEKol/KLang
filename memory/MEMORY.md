# Project Memory — KLang

## Agreed Architecture Decisions

### Styles — hybrid approach (CONFIRMED)
- **Static styles** (sizes, paddings — no theme): `StyleSheet.create` stays in the component file → `no-unused-styles` ESLint works
- **Theme-dependent styles**: separate `Component.styles.ts` with `export const createStyles = (colors: IThemeColors) => StyleSheet.create({...})` → `no-color-literals` works
- Used in component as: `const styles = useMemo(() => createStyles(colors), [colors])`
- Unused styles in `*.styles.ts` checked by: `npm run check-styles` (scripts/check-unused-styles.js) — to be added to CI/CD

### i18n
- Single approach: `useTranslation(namespace)` + JSON files in `public/locales/`
- `.i18n.ts` files (in screens/) were temp scaffolding → convert to JSON + delete
- Namespaces: translation, navigation, homeScreen, uiScreen, studyScreen, practiceScreen, settingsScreen, testScreen, levelScreen

### Games / Modules
- Games live in `src/modules/games/` as a separate non-FSD layer
- Each game has its own mini-FSD inside: `entities/`, `model/`, `ui/`
- HangelBoard and SequencesBuilder should move from `src/features/` → `src/modules/games/`
- WordMatcher is already correctly placed

### Auth State
- Single source of truth: **Redux only** (`entities/auth` slice)
- `AuthContext` keeps only methods (signIn, signOut, etc.) — no user state duplication
- Do not break existing auth flow during migration

## Key Bugs to Fix (from ISSUES_AND_ROADMAP.md)
- NAV-01: `focused` hardcoded true in Settings AnimatedIcon
- THEME-01+02: Theme not dispatched to Redux, "auto" value mismatch with TThemeMode
- GAME-01: unstable `key()` in HangelBoard strokes list
- TS-07: duplicate stateSchema.ts in entities/theme/types/

## Code Style Rules
- Modern JS/TS: ESM `import`/`export`, no `require()` unless CJS is unavoidable (e.g. metro.config.js, babel.config.js)
- Scripts in `scripts/` → `.mjs` extension (ESM without touching package.json `"type"`)
- After creating/editing any file: run `npx prettier --write <file>` — don't try to match formatting manually

## Docs Location
- docs/ARCHITECTURE.md — архитектурная документация
- docs/ISSUES_AND_ROADMAP.md — баги, issues, roadmap
