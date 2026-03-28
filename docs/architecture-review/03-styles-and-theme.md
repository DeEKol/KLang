# 03 — Styles & Theme

## Current Architecture

```
shared/lib/theme/                    ← Чистая логика (no Redux)
  types.ts                           IThemeColors, IThemeTokens, TThemeMode
  colors/
    Palette.ts                       EPalette (light, Korean), EDarkPalette (dark)
    Colors.ts                        { light, dark, system } — light/dark ключи
  tokens.ts                          createTheme(mode) → IThemeTokens
  mapTokensToMD3.ts                  IThemeTokens → react-native-paper MD3 theme (active)
  useThemeTokens.ts                  ⚠️ shim → re-exports из entities/theme (THEME-L2 migration)
  utils.ts                           useResolvedMode(), normalizeSetting()

entities/theme/                      ← Redux state + хук
  model/slice/themeSlice.ts          { mode: TThemeMode }, changeTheme action
  model/selectors/                   getTheme, getThemeMode
  model/hooks/useThemeTokens.ts      ✅ хук перенесён сюда (FSD fix)
  types/themeSchema.ts               IThemeSchema, re-exports from shared/lib/theme/types

app/providers/UIProvider/
  UIProvider.tsx                     PaperProvider с mapTokensToMD3(tokens)
  ThemeInitializer.ts                migration: null/"normal" → "system" (one-shot)

shared/ui/
  atoms/ButtonUI/ButtonUI.styles.ts  createStyles(themeUI, colors: IThemeColors) ✅
  molecules/FlipCardUI/FlipCardUI.styles.ts  createStyles(colors: IThemeColors) ✅
  atoms/RoadMapButtonUI/             createStyles(colors: IThemeColors) ✅
  paper-kit/                         обёртки над RN Paper (Text, Button, Card, ...)

screens/UIScreen/UIScreen.styles.ts  пример экранных стилей
```

**Поток данных:**

```text
useColorScheme() (system)
  → useResolvedMode() (inside useThemeTokens)
  → Redux state.theme.mode (getThemeMode)
  → useThemeTokens() [entities/theme]
      → useResolvedMode(mode) → "light" | "dark"
      → createTheme(resolved) → IThemeTokens
  → UIProvider → mapTokensToMD3(tokens) → PaperProvider theme
  → useThemeTokens() → colors: IThemeColors → в компонентах для *.styles.ts
```

---

## Problems

### ✅ THEME-01 — `mapTokensToMD3` раскомментирован, MD3 поля исправлены

Исправлены имена полей по Paper docs: `secondary` (не `accent`), `outline` (не `border`), `onBackground` (не `text`).
Добавлены: `onPrimary`, `primaryContainer`, `surfaceVariant`.

---

### ✅ THEME-02 — `ThemeInitializer` исправлен

`ThemeInitializer` теперь запускается один раз при монтировании и только мигрирует старые значения (`null`, `"normal"`) в `"system"`. Системная тема подписывается реактивно через `useColorScheme()` внутри `useThemeTokens()`.

---

### ✅ THEME-03 — FSD нарушение частично исправлено

`useThemeTokens` перенесён в `entities/theme/model/hooks/useThemeTokens.ts`. App-слой (`UIProvider`, `NavigationProvider`, `SettingsScreen`) импортирует из `entities/theme`.

`shared/lib/theme/useThemeTokens.ts` оставлен как shim для `shared/ui` компонентов, которые ещё вызывают хук напрямую. Полное исправление — после перехода `shared/ui` на получение `colors` через пропсы.

---

### ✅ THEME-04 — `IThemeColors` синхронизирован с `createTheme`

Интерфейс расширен: добавлены `onPrimary`, `primaryContainer`, `surfaceVariant`. Небезопасный `as IThemeTokens` каст убран.

---

### ✅ THEME-05 — Убран режим `"normal"`

`TThemeMode = "light" | "dark" | "system"`. Все упоминания `"normal"` удалены из `Colors`, `normalizeSetting`, `themeSlice`. `ThemeInitializer` мигрирует старые `null`/`"normal"` значения.

---

### ✅ THEME-06 — Стилевые функции переведены на `colors: IThemeColors`

`ButtonUI.styles.ts`, `FlipCardUI.styles.ts`, `RoadMapButtonUI.tsx` — все принимают `colors: IThemeColors`. Прямые импорты `EPalette` и ручные `Colors[theme]` lookup убраны.

---

### ✅ THEME-07 — `SplashScreen` подключён к теме

```ts
// SplashScreen.tsx
backgroundColor: "#FFFFFF"          // ← игнорирует тему
colors={["#FF6B6B", "#0047AB", "#FF6B6B"]}  // ← хардкод в Skia Canvas
color: "#0047AB"                    // ← хардкод
```

Отдельный случай — Canvas (Skia) не получает стили из StyleSheet, поэтому требует явной передачи цветов через пропсы.

---

### ✅ THEME-08 — `EDarkPalette` обновлён

Корейская тёмная палитра: `PRIMARY: "#ADC8FF"`, `BACKGROUND: "#1C1B1A"`, `SURFACE: "#2A2927"` — контрастная, тёплая, соответствует MD3 dark.

---

### ✅ THEME-09 — Единое место для анимаций

`shared/lib/animations/index.ts` — единая точка входа: `AnimatedView`, `FadeInView`, `SlideInRightView`, `BounceInView`, `usePulseAnimation`, `useShakeAnimation`, `usePressAnimation`.

Все анимации в проекте переведены на `react-native-reanimated`. `AnimatedIcon`, все хуки `WordMatcher/model/animation/`, `settings-components.tsx` — больше не используют старый `react-native` Animated API. `usePressAnimation` добавлен для одноразового press-feedback (отличие от `usePulseAnimation` — не зациклен).

---

### ✅ THEME-10 — `console.log("progress!!")` в `SplashScreen`

Удалён.

---

## Best Practices

### Token-based design system ✅ (задумано правильно)

Подход `EPalette → IThemeColors → IThemeTokens → components` — правильная архитектура. Нужно только довести до конца (раскомментировать `mapTokensToMD3`, исправить `createTheme`).

### `createStyles(colors: IThemeColors)` паттерн (следует принять)

Стилевые функции должны принимать **готовые токены**, не режим:

```ts
// ✅ Правильно
export function createStyles(colors: IThemeColors) {
  return StyleSheet.create({
    container: { backgroundColor: colors.surface },
    text: { color: colors.text },
    button: { backgroundColor: colors.primary },
  });
}

// ❌ Неправильно (текущий подход)
export default (themeUI: EButtonUITheme, themeGlobal: TThemeMode) => {
  return StyleSheet.create({
    globalTitleStyle: { color: Colors[themeGlobal ?? "light"]?.text },  // логика разрешения в стилях
  });
}
```

### `"system"` как явный режим

Убрать `"normal"`, использовать 3 варианта: `"light"` | `"dark"` | `"system"`.
`ThemeInitializer` нужен только для начального sync при `mode === "system"`.

---

## Proposed Architecture

### Структура токенов (цель)

```ts
// shared/lib/theme/types.ts — расширить IThemeColors
interface IThemeColors {
  // Основные
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  // Фоны
  background: string;
  surface: string;
  surfaceVariant: string;
  // Текст
  text: string;          // onBackground
  onSurface: string;
  // Акценты
  accent: string;        // secondary
  error: string;
  // Служебные
  border: string;
  disabled: string;
  placeholder: string;
  backdrop: string;
}
```

### Корейская тематика — цветовой стиль

```ts
// EPalette — предлагаемые цвета (корейская тематика)
const EPalette = {
  // Hanbok-inspired: глубокий синий + коралловый акцент
  PRIMARY: "#1A3A6B",         // 쪽빛 (jjokbit) — традиционный корейский синий
  PRIMARY_CONTAINER: "#D6E4FF",
  ACCENT: "#E85D4A",          // 단청 (dancheong) — красно-коралловый
  ACCENT_CONTAINER: "#FFE0DC",
  BACKGROUND: "#F8F7F4",      // тёплый белый, не чисто #FFF
  SURFACE: "#FFFFFF",
  SURFACE_VARIANT: "#F0EEE8",
  TEXT: "#1C1B1A",
  ON_SURFACE: "#1C1B1A",
  BORDER: "#D9D5CC",
  DISABLED: "#C4BFB5",
  PLACEHOLDER: "#9E9A92",
};

const EDarkPalette = {
  PRIMARY: "#ADC8FF",         // светлый синий на тёмном
  PRIMARY_CONTAINER: "#1A3A6B",
  ACCENT: "#FFB3AC",
  ACCENT_CONTAINER: "#7D1D12",
  BACKGROUND: "#1C1B1A",     // тёплый почти-чёрный
  SURFACE: "#2A2927",
  SURFACE_VARIANT: "#3A3835",
  TEXT: "#EAE6DF",
  ON_SURFACE: "#EAE6DF",
  BORDER: "#4A4640",
  DISABLED: "#5A5650",
  PLACEHOLDER: "#8A8680",
};
```

### mapTokensToMD3 — раскомментировать и заполнить

```ts
export function mapTokensToMD3(tokens: IThemeTokens) {
  const isDark = tokens.mode === "dark";
  const base = isDark ? MD3DarkTheme : MD3LightTheme;
  const c = tokens.colors;

  return {
    ...base,
    dark: isDark,
    colors: {
      ...base.colors,
      primary: c.primary,
      onPrimary: c.onPrimary,
      primaryContainer: c.primaryContainer,
      secondary: c.accent,
      background: c.background,
      surface: c.surface,
      surfaceVariant: c.surfaceVariant,
      onSurface: c.onSurface,
      onBackground: c.text,
      error: c.error,
      outline: c.border,
    },
  };
}
```

### ThemeInitializer — уважать сохранённую настройку

```ts
export const ThemeInitializer: React.FC = () => {
  const dispatch = useAppDispatch();
  const savedMode = useSelector(getThemeMode);
  const system = useColorScheme() ?? "light";

  useEffect(() => {
    // Синхронизировать системную тему только если пользователь выбрал "system"
    if (savedMode === "system") {
      dispatch(themeActions.changeTheme(system));
    }
  }, [system, savedMode, dispatch]);

  return null;
};
```

### useThemeTokens — перенести в entities/theme

```ts
// entities/theme/model/hooks/useThemeTokens.ts  (перенести из shared/lib/theme)
import { createTheme } from "shared/lib/theme";          // pure function — ok
import { useResolvedMode } from "shared/lib/theme/utils"; // pure function — ok
import { getThemeMode } from "../selectors/getThemeMode"; // в той же entities/theme

export function useThemeTokens() {
  const modeSetting = useSelector(getThemeMode);
  const resolvedMode = useResolvedMode(modeSetting);
  return useMemo(() => createTheme(resolvedMode), [resolvedMode]);
}
```

Экспортировать через `entities/theme/index.ts`. Компоненты в `shared/ui` получают `colors` через пропсы или через `useThemeTokens` из `entities/theme`.

---

## Task Breakdown

### 🔴 Large

| ID | Status | Task |
| ---- | -------- | ------ |
| THEME-L1 | ✅ done | Корейская палитра: обновить `EPalette`/`EDarkPalette`; расширить `IThemeColors`; обновить `createTheme`; `mapTokensToMD3` активен |
| THEME-L2 | ✅ done (partial) | `useThemeTokens` перенесён в `entities/theme`; app/screens импортируют оттуда; `shared/ui` использует shim до перехода на props |

### 🟡 Medium

| ID | Status | Task |
| ---- | -------- | ------ |
| THEME-M1 | ✅ done | `ThemeInitializer` исправлен: migration-only, не перетирает пользовательскую тему |
| THEME-M2 | ✅ done | `ButtonUI.styles.ts`, `FlipCardUI.styles.ts`, `RoadMapButtonUI` → `(colors: IThemeColors)` |
| THEME-M3 | ✅ done | `"normal"` удалён; `TThemeMode` = `"light"` or `"dark"` or `"system"` |
| THEME-M4 | ✅ done | Подключить цвета темы к `SplashScreen` (Skia Canvas через пропсы, StyleSheet через токены) |

### 🟢 Small

| ID | Status | Task |
| ---- | -------- | ------ |
| THEME-S1 | ✅ done | `IThemeColors` синхронизирован с `createTheme`; небезопасный каст убран |
| THEME-S2 | ✅ done | Удалён `console.log("progress!!")` из `SplashScreen` |
| THEME-S3 | ✅ done | Единое место для анимаций: `shared/lib/animations/`; все компоненты мигрированы на `react-native-reanimated` |
| THEME-S4 | ✅ done | `HangelBoard` подключён к теме: `useThemeTokens()`, цвета пробрасываются в `GridOverlay`/`AnimatedStroke` |
| THEME-S5 | ✅ done | `UITextProps.style` и `Touchable.style` — `TextStyle`/`ViewStyle` → `StyleProp<TextStyle>`/`StyleProp<ViewStyle>` |
