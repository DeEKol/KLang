# 03 — Styles & Theme

## Current Architecture

```
shared/lib/theme/                    ← Чистая логика (no Redux)
  types.ts                           IThemeColors, IThemeTokens, TThemeMode, ...
  colors/
    Palette.ts                       EPalette (light), EDarkPalette (dark)
    Colors.ts                        { light: {...}, dark: {...}, normal: {...} }
  tokens.ts                          createTheme(mode) → IThemeTokens
  mapTokensToMD3.ts                  IThemeTokens → react-native-paper MD3 theme
  useThemeTokens.ts                  hook: Redux mode → resolved IThemeTokens
  utils.ts                           useResolvedMode(), normalizeSetting()

entities/theme/                      ← Redux state
  model/slice/themeSlice.ts          { mode: TThemeMode }, changeTheme action
  model/selectors/                   getTheme, getThemeMode
  types/themeSchema.ts               IThemeSchema, re-exports from shared/lib/theme/types

app/providers/UIProvider/
  UIProvider.tsx                     PaperProvider с mapTokensToMD3(tokens)
  ThemeInitializer.ts                sync useColorScheme() → Redux changeTheme

shared/ui/
  atoms/ButtonUI/ButtonUI.styles.ts  createStyles(themeUI, themeGlobal)
  molecules/FlipCardUI/FlipCardUI.styles.ts
  paper-kit/                         обёртки над RN Paper (Text, Button, Card, ...)

screens/UIScreen/UIScreen.styles.ts  пример экранных стилей
```

**Поток данных:**
```
useColorScheme() (system)
  → ThemeInitializer → dispatch(changeTheme(scheme))
  → Redux state.theme.mode
  → getThemeMode selector
  → useThemeTokens()
      → useResolvedMode(mode) → "light" | "dark"
      → createTheme(resolved) → IThemeTokens
  → UIProvider → mapTokensToMD3(tokens) → PaperProvider theme
  → useThemeTokens() → в компонентах для *.styles.ts
```

---

## Problems

### 🔴 THEME-01 — `mapTokensToMD3` полностью закомментирован — кастомная тема не применяется

```ts
// mapTokensToMD3.ts
const colors = {
  ...base.colors,
  // TODO: set up theme
  // primary: tokens.colors.primary,
  // background: tokens.colors.background,
  // surface: tokens.colors.surface,
  // onSurface: tokens.colors.text,
};
```

`UIProvider` передаёт эту "тему" в `PaperProvider`, но она идентична дефолтному MD3. **Все компоненты react-native-paper (Button, Card, Text, TextInput, BottomNavigation) используют дефолтные цвета Material Design**, не цвета приложения. Весь `EPalette` проигнорирован.

---

### 🔴 THEME-02 — `ThemeInitializer` перетирает сохранённую пользовательскую тему

```ts
// ThemeInitializer.ts
const scheme = useColorScheme() ?? "light";
useEffect(() => {
  dispatch(themeActions.changeTheme(scheme)); // ← всегда диспатчит системную схему
}, [scheme, dispatch]);
```

Сценарий:
1. Пользователь выбирает `"dark"` вручную в настройках → Redux Persist сохраняет `mode: "dark"`
2. Приложение перезапускается → Redux Persist восстанавливает `mode: "dark"`
3. `ThemeInitializer` монтируется → `useEffect` → `changeTheme("light")` (системная тема) → **пользовательская настройка сброшена**

Нужно учитывать, что `"system"` — это специальный режим "следовать ОС", а `"dark"` / `"light"` — ручной выбор.

---

### 🔴 THEME-03 — FSD нарушение: `shared` импортирует из `entities`

```ts
// shared/lib/theme/useThemeTokens.ts
import { getThemeMode, type TThemeMode } from "entities/theme"; // ← entities выше shared
```

`shared` не может импортировать из `entities` по правилам FSD. Типы уже перенесли в `shared/lib/theme/types.ts`, но `getThemeMode` (Redux selector) остался. Это архитектурная проблема — хук, читающий Redux, не может жить в `shared`.

**Решение:** перенести `useThemeTokens` в `entities/theme` (или в `features/theme`), оставив в `shared/lib/theme` только чистые функции (`createTheme`, `Colors`, `mapTokensToMD3`, типы).

---

### 🟡 THEME-04 — `IThemeColors` не соответствует фактическому выводу `createTheme`

`types.ts` объявляет:
```ts
interface IThemeColors {
  background, surface, text, primary, accent?, error?, border?
}
```

Но `createTheme()` возвращает расширенный набор: `disabled`, `placeholder`, `notification`, `onSurface`, `backdrop` — они не в интерфейсе, поэтому код делает `} as IThemeTokens` — небезопасный каст.

---

### 🟡 THEME-05 — `"normal"` режим: несогласованное поведение

`TThemeMode = ColorSchemeName | "normal"` — значение `"normal"` обрабатывается по-разному:

| Место | Поведение |
|---|---|
| `createTheme("normal")` | Использует `Colors["normal"]` = light палитра |
| `normalizeSetting("normal")` | Конвертирует в `"system"` → следует ОС |
| `Colors` объект | Имеет ключ `"normal"` (дублирует `"light"`) |

Итого: если пользователь выбрал `"normal"`, `createTheme` даёт ему light, а `useResolvedMode` даёт системную. Значение `"normal"` нужно либо удалить, либо чётко определить его семантику.

---

### 🟡 THEME-06 — Хардкод цветов в `*.styles.ts` обходит токен-систему

Компоненты используют `EPalette` напрямую вместо токенов из `useThemeTokens()`:

```ts
// ButtonUI.styles.ts
borderColor: EPalette.ACCENT,          // ← всегда light, dark mode не работает
backgroundColor: EPalette.PRIMARY,     // ← всегда #0047AB
color: Colors[themeGlobal ?? "light"]?.text  // ← ручной lookup
```

```ts
// FlipCardUI.styles.ts
color: EPalette.PRIMARY,  // ← хардкод
```

Стилевые функции принимают `themeGlobal: TThemeMode` параметром, но должны принимать `colors: IThemeColors` — уже готовые токены, без повторной логики разрешения режима.

---

### 🟡 THEME-07 — `SplashScreen` имеет полностью хардкод цвета

```ts
// SplashScreen.tsx
backgroundColor: "#FFFFFF"          // ← игнорирует тему
colors={["#FF6B6B", "#0047AB", "#FF6B6B"]}  // ← хардкод в Skia Canvas
color: "#0047AB"                    // ← хардкод
```

Отдельный случай — Canvas (Skia) не получает стили из StyleSheet, поэтому требует явной передачи цветов через пропсы.

---

### 🟡 THEME-08 — `EDarkPalette` слишком упрощён для реального тёмного режима

```ts
// Palette.ts
PRIMARY: "#FFFFFF",     // белый primary — не работает на белом фоне
BACKGROUND: "#000000",  // чистый чёрный
SURFACE: "#000000",     // не различается от background
```

Материальный тёмный режим использует `#1C1B1F` (background), `#2B2930` (surface), и цветной (не белый) primary. Текущая палитра даст неконтрастный UI в dark mode.

---

### 🟢 THEME-09 — Анимации разбросаны, нет единого слоя

- `shared/animations/Animated` — `BounceInView` (импортируется, но не используется в `BottomTabsNavigator`)
- `AnimatedIcon.tsx` — Animated API прямо в компоненте
- `SplashScreen.tsx` — Reanimated прямо в компоненте
- Нет единой точки входа / соглашения для анимаций

---

### 🟢 THEME-10 — `console.log("progress!!")` в `SplashScreen`

```ts
// SplashScreen.tsx:166
console.log("progress!!", progress);
```

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

| ID | Task |
|----|------|
| THEME-L1 | Разработать финальную цветовую палитру (корейская тематика): обновить `EPalette`/`EDarkPalette`; расширить `IThemeColors`; обновить `createTheme`; раскомментировать `mapTokensToMD3` — тема Paper начнёт работать |
| THEME-L2 | Перенести `useThemeTokens` из `shared/lib/theme` в `entities/theme`; обновить все импорты (FSD fix) |

### 🟡 Medium

| ID | Task |
|----|------|
| THEME-M1 | Исправить `ThemeInitializer`: синхронизировать системную тему только при `savedMode === "system"` |
| THEME-M2 | Рефакторинг `*.styles.ts`: сигнатуры `(themeUI, themeGlobal)` → `(colors: IThemeColors)`; убрать прямые импорты `EPalette` из стилей |
| THEME-M3 | Убрать `"normal"` из `TThemeMode`; заменить на `"system"`; обновить `Colors`, `Palette`, `normalizeSetting` |
| THEME-M4 | Подключить цвета темы к `SplashScreen` (Skia Canvas через пропсы, StyleSheet через токены) |

### 🟢 Small

| ID | Task |
|----|------|
| THEME-S1 | Синхронизировать `IThemeColors` интерфейс с фактическим выводом `createTheme`; убрать `as IThemeTokens` cast |
| THEME-S2 | Удалить `console.log("progress!!")` из `SplashScreen` |
| THEME-S3 | Определить единое место для анимаций: `shared/lib/animations/` с реэкспортом часто используемых анимаций |
