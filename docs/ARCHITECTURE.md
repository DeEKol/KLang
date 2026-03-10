# Architecture

Korean language learning app для iOS и Android на React Native.

---

## Слои (Feature-Sliced Design)

```
src/
├── app/          # Точка входа, провайдеры, корень навигации
├── entities/     # Доменные модели (auth, theme)
├── features/     # Фичи с UI (StepsSwiper, Markdown, auth hooks)
├── screens/      # Полные экраны, монтируются навигатором
├── widgets/      # Сложные составные компоненты (Lesson, ThemeSwitcher, LangSwitcher)
├── shared/       # Кросс-слойное: config, helpers, api, lib, ui, tts, animations
└── modules/      # Вне FSD: самодостаточные игры (WordMatcher, HangelBoard, SequencesBuilder)
```

Слой `modules/games/` живёт вне FSD намеренно — игры имеют сложную внутреннюю структуру
(анимации, логика, типы), которую неудобно класть в один `features/` компонент.
Каждая игра — мини-FSD внутри своей директории.

**Правило импортов** (enforced ESLint): импортировать только через `index.ts` слоя,
нельзя обращаться напрямую в `ui/`, `model/`, `types/` другого слоя.

**Path aliases**: `babel.config.js` + `tsconfig.json` (`*` → `./src/*`), поэтому
`import { X } from "entities/auth"` работает без относительных путей.

---

## Навигация

### Структура

```
NavigationContainer
└── RootStack (NativeStack)
    ├── [!auth] AuthStackNavigator
    │   └── Login / Signup / ForgotPassword / EmailConfirmation / SMSConfirmation
    └── [auth]  BottomTabsNavigator  (PaperBottomTabs + react-native-paper)
        ├── HomeTab    → HomeStackNavigator    → Home / Profile / Roadmap
        ├── StudyTab   → StudyStackNavigator   → Study / Level / Lesson
        ├── PracticeTab→ PracticeStackNavigator→ Practice / Hangel / WordMatcher / SequencesBuilder
        ├── SettingsTab→ SettingsScreen        (прямой экран, без вложенного стека)
        └── TestTab    → TestStackNavigator    → Test / UiScreen
```

### Два enum'а маршрутов

| Файл | Enum | Назначение |
|---|---|---|
| `shared/config/navigation/types/navigation.ts` | `ENavigation` | **Полный** список всех экранов + ParamList'ы |
| `shared/config/navigation/routes.ts` | `ENavigation` (частичный) + `ROUTE_PATHS` | Deep-linking пути. Перекрывает только Auth + Home |

Tab-навигация определена отдельно:
`shared/config/navigation/types/tab-navigation.ts` → `ETabNavigation`, `TBottomTabsParamList`

### Auth guard

`NavigationProvider` читает `getIsAuthenticated` из Redux и рендерит либо `AuthStackNavigator`, либо `BottomTabsNavigator`. При `pendingLink` (deep-link до логина) — сохраняет URL в Redux, после логина выполняет `resetTo(MAIN)` + `Linking.openURL`.

### Кастомный таббар

`PaperBottomTabs` — обёртка над `BottomNavigation.Bar` из react-native-paper.
`AnimatedIcon` — иконки с анимацией scale при фокусе (react-native `Animated.timing`).

---

## Тема

### Поток данных

```
Redux (theme.mode: TThemeMode)
  → useThemeTokens()          [shared/lib/theme/useThemeTokens.ts]
      → useResolvedMode()     [utils.ts] резолвит 'system'/'normal' → 'light'|'dark'
      → createTheme(mode)     [tokens.ts] создаёт IThemeTokens
  → UIProvider → mapTokensToMD3() → PaperProvider (MD3 theme)
  → useNavigationTheme()      → NavigationContainer theme
```

### Типы

- `TThemeMode`, `IThemeColors`, `IThemeTokens`, `IThemeTypography`, `IThemeSpacing` — определены в `shared/lib/theme/types.ts`, ре-экспортируются из `entities/theme`
- `IThemeSchema` — Redux-состояние (только `mode`), определена в `entities/theme/types/themeSchema.ts`
- `TThemeMode = ColorSchemeName | "normal"` — `"normal"` является легаси-алиасом для `"system"`
- В Redux хранится только `mode`; `IThemeTokens` создаются на лету через хук
- **Известное исключение FSD:** `shared/lib/theme/useThemeTokens.ts` импортирует `getThemeMode` из `entities/theme`. Неустранимо без выноса темы в React Context.

### Цвета

```
Palette.ts      # enum EPalette / EDarkPalette (raw hex-значения)
Colors.ts       # TColors: { light, dark, normal } → ColorsType
tokens.ts       # createTheme() — собирает IThemeTokens из Colors
```

Тема персистируется через `redux-persist` + `AsyncStorage` (только `theme` slice).

### Получение токенов в компонентах

```ts
const { colors, spacing, typography } = useThemeTokens();
```

---

## Аутентификация

### Провайдеры и слои

```
FirebaseAdapter (shared/services/firebase)  — IAuthRepository
  ↓ implements
SessionService (shared/auth/SessionService) — синхронизирует Firebase token с API
AuthProvider   (app/providers/AuthProvider) — React Context + Redux dispatch
AuthContext    (shared/auth/AuthContext)     — useAuthContext() хук
features/auth (index.ts)                    — обёртка для компонентов (публичный API)
```

### Жизненный цикл

1. `onAuthStateChanged` (Firebase) → `AuthProvider`
2. При входе: `sessionService.syncForUser(u)` (обмен Firebase token на backend session) → `dispatch(loginSuccess(userInfo))`
3. При выходе: `sessionService.clearSession()` + `SecureStore.clearAll()` → `dispatch(logout())`
4. `NavigationProvider` реагирует на `isAuthenticated` из Redux → переключает стек

### SSO

`shared/services/sso/` — паттерн `ISsoProvider`:
- `GoogleProvider`
- `AppleProvider`

Вызов через `authRepo.signInWithSso(providerId, { credential })`.

### Redux auth state

```ts
IAuthSchema {
  isAuthenticated: boolean;
  user: Partial<TFirebaseAuthUser> | null;
  pendingLink: string | null;  // deep-link до логина
}
```

> `getIdToken` функция вырезается перед `dispatch` (Redux не сериализует функции).

---

## i18n

**Библиотека**: i18next + react-i18next
**Детект языка**: `@os-team/i18next-react-native-language-detector`
**Fallback**: `ru`, поддерживаются `en` / `ru`

### Namespaces (ресурсы в `public/locales/`)

`translation`, `navigation`, `homeScreen`, `uiScreen`, `studyScreen`, `practiceScreen`,
`settingsScreen`, `testScreen`, `levelScreen`

### Подход

Единственный стандарт: `useTranslation("namespace")` + `t("key")` + JSON-файлы в `public/locales/`.

`.i18n.ts` файлы (в `screens/`) — временные объекты для scaffolding, подлежат конвертации в JSON и удалению.

---

## Игры (Practice)

### WordMatcher (`src/modules/games/WordMatcher/`)

Структура по мини-FSD внутри `modules/`:
```
entities/types.ts            # IWordMap
model/
  logic/useWordMatcher.ts    # игровая логика (хук)
  animation/                 # 4 анимационных хука
ui/
  GameLayout.tsx             # корневой компонент игры
  Column.tsx / Word.tsx      # слова-кнопки
  Dialog.tsx / Winning.tsx   # диалоги
```

Логика: пользователь выбирает слово из левой колонки (родной язык) и правой (корейский). При совпадении — пара исчезает с анимацией, при ошибке — `errorPair` → сброс через 1 с.

### HangelBoard (`src/modules/games/HangelBoard/` — *переносится из features/*)

Холст для написания символов хангыль:
- `@shopify/react-native-skia` — рендеринг штрихов (Canvas + Path)
- `PanResponder` — захват касаний
- `GridOverlay` — сетка-подсказка (3×3 + центр)
- Undo / Redo / Reset + слайдер ширины штриха

### SequencesBuilder (`src/modules/games/SequencesBuilder/` — *переносится из features/*)

Перетаскивание слов в пропуски предложения:
- `react-native-gesture-handler` — `Gesture.Pan()`
- `react-native-reanimated` — анимация snap, fade, success/fail hint
- `measureInWindow` / `UIManager.measureInWindow` — определение позиции пропусков
- Данные упражнения передаются через пропсы (не захардкожены)

---

## Shared UI (`src/shared/ui/paper-kit/`)

Обёртки над `react-native-paper` + собственные компоненты:

| Компонент | Описание |
|---|---|
| `Button` | Обёртка над Paper Button |
| `Text` | Поддержка `variant` (headline, body, caption, ...) |
| `TextInput` | Paper TextInput |
| `Surface` | Paper Surface |
| `Card` | Paper Card |
| `Touchable` | Ripple-нажатие |
| `ProgressBar` | Анимированный прогресс |
| `AvatarImage` | Аватар пользователя |
| `settings-components` | SettingSwitch, SettingRadio, SettingAction, SettingsSection |

Анимированные обёртки (`AnimatedView`, `FadeInView`, `SlideInRightView`, `BounceInView`) реэкспортируются из `shared/animations/Animated.tsx`.

---

## Структура стейта Redux

```ts
IStateSchema {
  auth:    IAuthSchema          // не персистируется
  counter: ICounterSchema       // тестовая сущность
  theme:   IThemeSchema & PersistPartial  // персистируется (AsyncStorage)
  posts:   IPostsSchema         // тестовая сущность
}
```

---

## Provider tree (App.tsx)

```
StoreProvider
  InitProvider
    SafeAreaProvider
      UIProvider (PaperProvider с MD3 темой)
        AuthProvider (Firebase + Redux sync)
          ThemeInitializer (побочный эффект: system theme → Redux)
          GestureHandlerRootView
            NavigationProvider (NavigationContainer + стеки)
```
