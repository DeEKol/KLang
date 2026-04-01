# Issues & Roadmap

Статус на момент анализа. Разбито по приоритету и теме.

---

## Баги (поломано прямо сейчас)

### NAV-01 — `AnimatedIcon` у Settings всегда `focused=true` ✅ Решено

`focused={focused}` передан корректно. Заодно убраны отладочные `tabBarBadgeStyle`/`tabBarStyle: { backgroundColor: "red" }` в Home tab.

### NAV-02 — `routes.ts` дублирует и обрезает `ENavigation` ✅ Решено

Дублирующий enum удалён из `routes.ts`. Теперь файл импортирует `ENavigation` из `./types/navigation` — единственный источник истины.

### THEME-01 — Theme Radio в SettingsScreen не диспатчит в Redux ✅ Решено

`handleSettingChange` теперь диспатчит `themeActions.changeTheme(mode)` при `key === "theme"`.
`"system"` → `null` (для Redux), остальные значения передаются как `TThemeMode`.

### THEME-02 — Несоответствие значений тем ✅ Решено

`value: "auto"` заменено на `value: "system"` в `themeOptions`.
`themeName ?? "system"` — корректный fallback для начального состояния.

### AUTH-01 — Ошибочный log в `signInWithEmail` ✅ Решено

Неверный `console.log("User account created & signed in!")` удалён из `signInWithEmail`.

### GAME-01 — Нестабильные ключи в `HangelBoard` ✅ Решено

`Stroke` получил поле `id: number`, присваивается через `strokeIdRef` (инкремент) при `onPanResponderRelease`. `key={key()}` заменён на `key={s.id}`. Импорт `generateKey` удалён.

---

## TypeScript

### TS-01 — `PaperBottomTabs` — props типизированы как `any` ✅ Решено

`any` заменён на `Props extends BottomTabBarProps` с `TabBarComponent?: ComponentType<BarProps>`.
`BarRoute` — intersection Paper-типа и `{ name: string; params? }` для совместимости с React Navigation.
Все внутренние callbacks (`onTabPress`, `renderIcon`, `getLabelText`) явно типизированы.

### TS-02 — `AnimatedIcon` — без типов (файл называется `.tsx`, но описан как `.js`) ✅ Решено

Добавлен интерфейс `Props` с полями `name: MaterialDesignIconsIconName`, `focused: boolean`, `color: string`, `size?: number`.

### TS-03 — Inline тип selector в `NavigationProvider`

```tsx
const pendingLink = useSelector(
  (state: { auth: { pendingLink: string | null } }) => state.auth.pendingLink,
);
```

Должен использовать `IStateSchema` вместо inline anonymous type.

### TS-04 — `handleSettingChange` / `handleGoalChange` — `value: any` ✅ Частично решено

`handleGoalChange` переведён на `value: unknown`. `handleSettingChange` уже был `value: unknown` после предыдущего фикса.

### TS-05 — `error: any` в catch-блоках `FirebaseAdapter` ✅ Решено

`error: any` убран. Используется `ReactNativeFirebase.NativeFirebaseError` (namespace из `@react-native-firebase/app`) через локальный type alias. Убран `// eslint-disable-next-line`.

### TS-06 — `IThemeColors` имеет `[key: string]: string | undefined` ✅ Решено

Index signature удалён — динамический доступ `colors[key]` нигде не использовался. Интерфейс стал строгим.

### TS-07 — Два `stateSchema.ts` с разным содержимым ✅ Решено

`src/entities/theme/types/stateSchema.ts` удалён. Экспорт убран из `entities/theme/index.ts`.
`getTheme.ts` переключён на импорт `IStateSchema` из `app/providers/StoreProvider`.

### TS-08 — `IThemeColors` неполный — `tokens.ts` создавал объект с extra-полями скрытыми `as` кастом ✅ Решено

`IThemeColors` дополнен: `disabled`, `placeholder`, `notification`, `onSurface`, `backdrop`.
Все поля сделаны обязательными (убраны `?`). Убран `as IThemeTokens` cast в `tokens.ts`.

### TS-09 — `resetTo()` принимал `keyof TAllStackParamList` — слишком широко ✅ Решено

Тип сужен до `keyof TRootStackParamList` — логически корректно (reset только к корневым экранам).

### TS-10 — `TRootStackParamList[MODAL]` использовал `?:` (optional key) вместо `| undefined` ✅ Решено

Изменено на `[ENavigation.MODAL]: { screen?: string } | undefined` — соответствует convention React Navigation.

### TS-11 — `PROFILE` и `ROADMAP` в `THomeStackParamList` типизированы как `undefined` ✅ Решено

Исправлено: `PROFILE: { userId?: string } | undefined`, `ROADMAP: { id?: string } | undefined` — соответствует `routes.ts`.

### TS-12 — `UITextProps.style` и `Touchable.style` принимали плоский объект вместо `StyleProp` ✅ Решено

`style?: TextStyle` в `UITextProps` и `style?: ViewStyle` в `Touchable` не позволяли передавать массивы стилей — паттерн `[styles.foo, { color: colors.text }]` давал TS-ошибку.
Исправлено: `StyleProp<TextStyle>` и `StyleProp<ViewStyle>` соответственно. Устранило ~13 ошибок в `settings-components.tsx` и `SettingsScreen.tsx`.

---

## Анимации

### ANIM-01 — Два API анимаций: `react-native` Animated и `react-native-reanimated` ✅ Решено

По всему проекту смешивались старый `Animated` API (`.Value`, `.spring`, `.interpolate`) и современный `react-native-reanimated` (`useSharedValue`, `useAnimatedStyle`, `withSpring`).

Миграция:

- `AnimatedIcon.tsx` — перенесён на `useSharedValue` + `useAnimatedStyle`; `interpolate` заменён прямой математикой
- `WordMatcher/model/animation/` — все 4 хука (`useScaleAnimation`, `useOpacityAnimation`, `useFadeScale`, `useColumnsAnimation`) переписаны на Reanimated; `friction/tension` → `damping/stiffness`
- `WordMatcher/ui/Word.tsx` — статичные стили цветных оверлеев вынесены в `StyleSheet`, анимированные стили применяются массивом
- `WordMatcher/ui/Winning.tsx` — удалён мёртвый код (`spinAnim`, `spin`, `Animated.timing` вне useEffect)
- `settings-components.tsx` — дублированная логика press-анимации заменена хуком `usePressAnimation` из `shared/lib/animations`

Добавлен хук `usePressAnimation(scaleDown = 0.95)` в `shared/lib/animations/hooks.ts` — одноразовая press-анимация (в отличие от `usePulseAnimation`, которая зациклена).

---

## FSD / Архитектура

### FSD-01 — `HangelBoard` и `SequencesBuilder` в `features/`, а не в `modules/games/`

**Решено**: `src/modules/games/` — намеренно отдельный слой для игр с автономной логикой.
`HangelBoard` и `SequencesBuilder` перенести из `src/features/` в `src/modules/games/`
по аналогии с уже лежащим там `WordMatcher`.

### FSD-06 — `features/auth/` не имел `index.ts` (прямые импорты из hooks/) ✅ Решено

Создан `src/features/auth/index.ts`. Все 4 экрана (Login, Settings, Home, Profile) переведены на `import { useAuth } from "features/auth"`.

### FSD-07 — Типы темы определены в `entities/`, используются в `shared/` ✅ Решено

`TThemeMode`, `IThemeColors`, `IThemeTokens` и др. перенесены в `src/shared/lib/theme/types.ts`.
`entities/theme/types/themeSchema.ts` теперь ре-экспортирует их из `shared/`.
6 файлов в `shared/` обновлены (больше не импортируют из `entities/theme`).

### FSD-08 — Runtime-селектор `getThemeMode` в `shared/ui` компонентах ✅ Решено

`ButtonUI`, `FlipCardUI`, `RoadMapButtonUI` — удалены прямые вызовы `useSelector(getThemeMode)`.
Заменены на `useThemeTokens().mode`. Дополнительно исправлено нарушение `shared→app` в FlipCardUI (удалён импорт `useAppSelector` из `app/providers/StoreProvider`).
**Единственное оставшееся исключение:** `useThemeTokens.ts` сам импортирует `getThemeMode` — неустранимо без Theme Context.

### FSD-02 — `settings-components.tsx` в `shared/ui/paper-kit/`

`SettingsSection`, `SettingSwitch`, `SettingRadio`, `SettingAction` — UI, специфичный для настроек.
`shared/ui` — для общих атомов. Эти компоненты правильнее положить в `features/settings/ui/` или `screens/SettingsScreen/ui/`.

### FSD-03 — Устаревшие тестовые сущности в `entities/`

`Counter` и `PostsTestApi` — шаблонные сущности, не несут продуктовой логики. Занимают место в Store и `IStateSchema`. Подлежат удалению перед продакшн.

### FSD-04 — `SequencesBuilderUI_old.tsx` не удалён ✅ Решено

Удалены `SequencesBuilderUI_old.tsx`, `ui/Blank.tsx`, `ui/DraggableWordUI.tsx`, `ui/SentenceParts.tsx` и пустая папка `ui/`. Все эти файлы были мёртвым кодом — использовались только старым файлом.

### FSD-05 — `SettingsScreen` как таб без вложенного стека ✅ Решено

Создан `SettingsStackNavigator` с `ENavigation.SETTINGS = "Settings"`. `TSettingsStackParamList` и `TSettingsStackScreenProps` добавлены в `navigation.ts`. `BottomTabsNavigator` теперь монтирует стек, а не экран напрямую — паттерн единообразен со всеми остальными табами.

---

## i18n

### I18N-01 — Два подхода к строкам, несогласованность ✅ Решено

Все 5 `.i18n.ts` файлов удалены. Созданы JSON namespace'ы: `authScreen`, `splashScreen`, `roadmapScreen`, `profileScreen` (en + ru). `settingsScreen.json` заполнен. Все экраны переведены на `useTranslation(namespace)`.

### I18N-02 — `SequencesBuilderUI.tsx` — весь текст захардкожен на русском ✅ Решено

Создан namespace `sequencesBuilder` с 7 ключами (`title`, `score`, `reset`, `optionsTitle`, `allOptionsUsed`, `victoryTitle`, `victorySub`).
Локали хранятся в `src/features/SequencesBuilder/locales/{ru,en}.json` — co-located с фичей.
`VictoryOverlay` и `SequencesBuilderUI` используют `useTranslation("sequencesBuilder")`.
Namespace зарегистрирован в `shared/config/i18n/i18n.ts`.

### I18N-03 — `HangelBoard.tsx` — кнопки без i18n

"Undo", "Redo", "Reset", `Stroke Width: ${strokeWidth}` — не переведены.

### I18N-04 — `i18n.ts` — `ns` не совпадает с реально загруженными namespace'ами

```ts
ns: ["translation", "homeScreen"],  // объявлено 2
// но загружается 9: navigation, uiScreen, studyScreen, practiceScreen, ...
```

`ns` должен перечислять все реально используемые namespaces (или быть убран — i18next найдёт их сам).

### I18N-05 — `settings.i18n.ts` содержит `studyMinutes`, но в компоненте используется `settingsStrings.minutes`

Мёртвый ключ + некоторые строки hardcode прямо в JSX (не через `settingsStrings`):

```tsx
description="Медленный темп, больше повторений"  // не через i18n объект
```

### I18N-06 — `settingsScreen` namespace в JSON пустой или не используется

`public/locales/ru/settingsScreen.json` существует, но `SettingsScreen` использует `.i18n.ts` объект, не `useTranslation("settingsScreen")`.

---

## Тема

### THEME-03 — `ThemeInitializer` перезаписывает пользовательский выбор темы

`ThemeInitializer` dispatches `changeTheme(deviceScheme)` на каждое изменение `useColorScheme`.
Если пользователь выбрал `"dark"` в настройках → перезапускает приложение на устройстве с `"light"` → Redux mode перезаписывается в `"light"`. Пользовательский выбор теряется.
Причина избыточности: `useResolvedMode()` внутри `useThemeTokens` уже читает `useColorScheme()` live.
Нужно: либо удалить `ThemeInitializer`, либо диспатчить только если `mode === "system" | "normal" | null`.

### THEME-04 — `mapTokensToMD3` — маппинг цветов закомментирован

Все кастомные цвета в `mapTokensToMD3.ts` закомментированы → Paper использует дефолтные MD3 цвета вместо палитры приложения. Нужно настроить и раскомментировать маппинг `primary`, `background`, `surface`, `onSurface`.

### THEME-05 — `adaptNavigationTheme()` в `useNavigationTheme` не был мемоизирован ✅ Решено

Перенесён на уровень модуля (вне хука) — вычисляется один раз, так как принимает константные аргументы.

---

## Стили

### STYLE-01 — `SequencesBuilderUI.tsx` — hardcoded dark-only цвета ✅ Решено

Все hex-литералы (`#071026`, `#e6eef8`, `#071226` и т.д.) заменены на токены темы.
`SequencesBuilderUI`, `Blank` и `DraggableWord` вызывают `useThemeTokens()` напрямую.
`StyleSheet` очищен от цветовых свойств — цвета применяются через style-массивы `[styles.foo, { color: colors.text }]`.
Семантические success-цвета `VictoryOverlay` (`#0b2b1f`, `#2ecc71` и др.) оставлены намеренно — это брендинг победы, не тема UI.

### STYLE-02 — `HangelBoard.tsx` — hardcoded цвета ✅ Решено

`backgroundColor: "#fff"`, `color: "black"`, `borderColor: "#ddd"` заменены на токены темы.
`HangelBoard` вызывает `useThemeTokens()`. `GridOverlay` и `AnimatedStroke` получили пропсы `lineColorHex`/`strokeColor` — цвет сетки и штриха пробрасывается из компонента-родителя.

### STYLE-03 — Стили вместе с компонентом (непоследовательно)

**Решено**: гибридный подход.

**Статичные стили** (отступы, размеры — не зависят от темы) — в том же файле компонента:

```ts
// Component.tsx — ESLint no-unused-styles покрывает этот блок
const staticStyles = StyleSheet.create({
  wrapper: { flex: 1, padding: 16 },
});
```

**Темозависимые стили** — в отдельном `Component.styles.ts`:

```ts
// Component.styles.ts — ESLint no-color-literals покрывает этот файл
export const createStyles = (colors: IThemeColors) =>
  StyleSheet.create({
    text: { color: colors.text },
  });

// Component.tsx
const styles = useMemo(() => createStyles(colors), [colors]);
```

**Контроль неиспользуемых стилей в `*.styles.ts`**: `npm run check-styles`
(скрипт `scripts/check-unused-styles.js`, планируется в CI/CD).

### STYLE-04 — Debug-стили в `BottomTabsNavigator` ✅ Решено

`tabBarBadgeStyle: { backgroundColor: "red" }` и `tabBarStyle: { backgroundColor: "red" }` на HOME Tab убраны в рамках NAV-01. Подтверждено: в текущей кодовой базе отсутствуют.

### STYLE-05 — Импорт `BlurMask` в `BottomTabsNavigator.tsx` не используется ✅ Решено

Удалены мёртвые импорты `BlurMask` (`@shopify/react-native-skia`), `BounceInView` (`shared/animations`) и `View` (`react-native`) из `BottomTabsNavigator.tsx`.

---

## Игры / Practice

### GAME-02 — `SequencesBuilder` работает только с `mockData`

Данные захардкожены в самом компоненте. Нет пропсов для передачи упражнения снаружи.

### GAME-03 — `WordMatcher` — данные захардкожены в screen

`WordMatcherScreen.tsx` нужно проверить — скорее всего `wordsMap` hardcoded.

### GAME-04 — `HangelBoard` не интегрирован с контентом

Нет связи с конкретным символом/уроком. Работает как свободный холст.

### GAME-05 — Нет единого интерфейса для игры ✅ Решено

Создан `modules/games/_shared/types.ts` с `IGameResult` и `IGameProps<TConfig>`, хук `useGameTimer.ts`. Все три игры подключены: `WordMatcher` и `SequencesBuilder` принимают `onComplete`, `HangelBoard` — `onExit`. Screen-обёртки передают колбэки.

---

## Auth

### AUTH-02 — Дублирование состояния пользователя

**Решено**: единственный источник правды — Redux (`auth.user`).
`AuthContext` хранит только методы (signIn, signOut, signInWithSso и т.д.), не `user`/`isLoading`.
Компоненты, которым нужен пользователь — читают из Redux через `getAuthUser`.
`isLoading` можно заменить на Redux-флаг `auth.isInitialized`.

### AUTH-03 — `console.log` в production коде

`AuthProvider` и `FirebaseAdapter` используют `console.log`/`console.warn` — нужен нормальный логгер или удалить.

### AUTH-04 — `signUpWithEmail` не обрабатывает ошибки

В отличие от `signInWithEmail` — нет try/catch, ошибка пробросится наверх необработанной.

---

## Что делать дальше (Roadmap)

### Срочно

- ~~Удалить `SequencesBuilderUI_old.tsx` (FSD-04)~~ ✅

### Качество кода

- Убрать `Counter` и `PostsTestApi` из стора и IStateSchema (FSD-03)
- Перенести `settings-components.tsx` в `screens/SettingsScreen/ui/` (FSD-02)
- Решить судьбу `modules/games/` — перенести в `features/` или оставить изолированным (FSD-01)
- Убрать inline-тип в `NavigationProvider` (`pendingLink` selector) — использовать `IStateSchema` (TS-03)

### Локализация

- ~~Перевести `SequencesBuilderUI.tsx` (I18N-02)~~ ✅
- Перевести `HangelBoard.tsx` (I18N-03)
- Добавить все namespaces в `ns: [...]` в `i18n.ts` (I18N-04)
- Убрать оставшиеся `.i18n.ts` файлы или конвертировать в JSON

### Игры

- Добавить пропсы в `SequencesBuilder` для передачи данных упражнения (GAME-02)
- ~~Подключить тему в `SequencesBuilderUI` (STYLE-01)~~ ✅
- ~~Описать общий `IGameProps` интерфейс (GAME-05)~~ ✅
- Подключить результаты игр к Redux / экрану результатов (GAME-S4)
- Интегрировать HangelBoard с конкретными символами хангыль (GAME-04)

### Навигация

- ~~Дополнить `ROUTE_PATHS` маршрутами Practice/Study для deep-linking~~ ✅ Done — `routes.ts` покрывает все стеки, единственный источник путей
- ~~Добавить nested screen config в `linking.ts` для `Profile`, `Roadmap`, `Hangel` и т.д.~~ ✅ Done — `linking.ts` импортирует `ROUTE_PATHS`, full nested config для Home/Study/Practice/Settings/Test
- Добавить `useHomeNavigation()`, `useStudyNavigation()` по аналогии с `usePracticeNavigation()` (опционально)

### Система темы

- Исправить `ThemeInitializer` — не перезаписывать Redux при явном выборе `light`/`dark` (THEME-03)
- Раскомментировать и настроить маппинг цветов в `mapTokensToMD3.ts` (THEME-04)

### Аутентификация

- Убрать дублирование состояния user (AUTH-02) — либо только Context, либо только Redux
- Добавить try/catch в `signUpWithEmail` (AUTH-04)
- Убрать `console.log` из production-кода (AUTH-03)

### Инфраструктура

1. **INFRA-01** — Добавить `"type": "module"` в `package.json` для полного ESM в scripts/.
   Что нужно изменить перед этим:
   - `metro.config.js` → переименовать в `metro.config.cjs` (использует `module.exports`)
   - `babel.config.js` → переименовать в `babel.config.cjs`
   - `jest.config.js` → переименовать в `jest.config.cjs` (если есть)
   - `.eslintrc.js` → переименовать в `.eslintrc.cjs`
   - Проверить совместимость `@react-native-community/cli` с ESM-конфигами (может потребовать пинить версию)
   - После добавления `"type": "module"` скрипты в `scripts/*.mjs` получают ESM автоматически, расширение `.mjs` больше не обязательно
