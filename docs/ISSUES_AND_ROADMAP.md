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

### TS-02 — `AnimatedIcon` — без типов (файл называется `.tsx`, но описан как `.js`)
```tsx
export default function AnimatedIcon({ name, focused, color, size = 24 })
```
Нет интерфейса пропсов.

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

### FSD-04 — `SequencesBuilderUI_old.tsx` не удалён
Устаревший файл в `src/features/SequencesBuilder/`. Запутывает.

### FSD-05 — `SettingsScreen` как таб без вложенного стека
В `BottomTabsNavigator` Settings — прямой компонент, не Stack navigator. Это нормально пока нет sub-экранов,
но `navigation.navigate("Profile")` внутри Settings вызовет ошибку т.к. "Profile" живёт в HomeStack.
Нужно либо добавить SettingsStackNavigator, либо использовать cross-stack навигацию.

---

## i18n

### I18N-01 — Два подхода к строкам, несогласованность ✅ Решено
Все 5 `.i18n.ts` файлов удалены. Созданы JSON namespace'ы: `authScreen`, `splashScreen`, `roadmapScreen`, `profileScreen` (en + ru). `settingsScreen.json` заполнен. Все экраны переведены на `useTranslation(namespace)`.

### I18N-02 — `SequencesBuilderUI.tsx` — весь текст захардкожен на русском
"Корейская практика — вставьте пропущенные слова", "Правильно:", "Варианты", "Сброс",
"Все варианты использованы", "🎉 Отлично! 🎉", "Вы правильно заполнили все бланки" — без i18n.

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

## Стили

### STYLE-01 — `SequencesBuilderUI.tsx` — hardcoded dark-only цвета
Все цвета вписаны hex-литералами (`#071026`, `#e6eef8`, `#071226` и т.д.), нет использования `useThemeTokens`.
Компонент не реагирует на смену темы.

### STYLE-02 — `HangelBoard.tsx` — hardcoded цвета
`backgroundColor: "#fff"`, `color: "black"`, `borderColor: "#ddd"` — нет темы.

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

### STYLE-04 — Неиспользуемые options в `BottomTabsNavigator`
```tsx
tabBarBadgeStyle: { backgroundColor: "red" },
tabBarStyle: { backgroundColor: "red" },
```
На HOME Tab — мусор от отладки.

### STYLE-05 — Импорт `BlurMask` в `BottomTabsNavigator.tsx` не используется
```tsx
import { BlurMask } from "@shopify/react-native-skia";  // нигде не используется
```

---

## Игры / Practice

### GAME-02 — `SequencesBuilder` работает только с `mockData`
Данные захардкожены в самом компоненте. Нет пропсов для передачи упражнения снаружи.

### GAME-03 — `WordMatcher` — данные захардкожены в screen
`WordMatcherScreen.tsx` нужно проверить — скорее всего `wordsMap` hardcoded.

### GAME-04 — `HangelBoard` не интегрирован с контентом
Нет связи с конкретным символом/уроком. Работает как свободный холст.

### GAME-05 — Нет единого интерфейса для игры
У каждой игры своя структура данных. Для масштабирования нужен общий контракт:
```ts
interface IGameProps<TData> {
  data: TData;
  onComplete: (score: number) => void;
  onNext?: () => void;
}
```

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

### Срочно (блокирует правильную работу)
1. Исправить THEME-01 + THEME-02 — диспатч темы в Redux, правильные значения
2. Исправить NAV-01 — `focused` у Settings иконки
3. Исправить GAME-01 — стабильные ключи в HangelBoard
4. Удалить `SequencesBuilderUI_old.tsx`
5. Удалить неиспользуемые импорты (`BlurMask`)

### Качество кода
6. Типизировать `PaperBottomTabs` и `AnimatedIcon` (TS-01, TS-02)
7. Удалить `entities/theme/types/stateSchema.ts` — лишний файл (TS-07)
8. Убрать `Counter` и `PostsTestApi` из стора и IStateSchema (FSD-03)
9. Перенести `settings-components.tsx` в `screens/SettingsScreen/ui/` (FSD-02)
10. Решить судьбу `modules/games/` — перенести в `features/` или оставить изолированным (FSD-01)

### i18n
11. Выбрать один подход: `useTranslation` + JSON для всех экранов
12. Перевести `SequencesBuilderUI.tsx` (I18N-02) и `HangelBoard.tsx` (I18N-03)
13. Добавить все namespaces в `ns: [...]` в `i18n.ts` (I18N-04)
14. Убрать `.i18n.ts` файлы или конвертировать в JSON

### Игры
15. Добавить пропсы в `SequencesBuilder` для передачи данных упражнения (GAME-02)
16. Подключить тему в `SequencesBuilderUI` и `HangelBoard` (STYLE-01, STYLE-02)
17. Описать общий `IGameProps` интерфейс (GAME-05)
18. Интегрировать HangelBoard с конкретными символами хангыль (GAME-04)

### Навигация
19. Решить проблему `navigation.navigate("Profile")` из SettingsScreen (FSD-05)
20. Объединить или чётко разграничить два `ENavigation` enum (NAV-02)
21. Дополнить `ROUTE_PATHS` маршрутами Practice/Study для deep-linking

### Auth
22. Убрать дублирование состояния user (AUTH-02) — либо только Context, либо только Redux
23. Добавить try/catch в `signUpWithEmail` (AUTH-04)
24. Убрать `console.log` из production-кода (AUTH-03)

### Стили
25. Договориться: стили в том же файле или в `*.styles.ts` — и привести к единому стандарту
26. Убрать debug-мусор из `tabBarBadgeStyle`/`tabBarStyle` (STYLE-04)

### Инфраструктура
27. **INFRA-01** — Добавить `"type": "module"` в `package.json` для полного ESM в scripts/.
    Что нужно изменить перед этим:
    - `metro.config.js` → переименовать в `metro.config.cjs` (использует `module.exports`)
    - `babel.config.js` → переименовать в `babel.config.cjs`
    - `jest.config.js` → переименовать в `jest.config.cjs` (если есть)
    - `.eslintrc.js` → переименовать в `.eslintrc.cjs`
    - Проверить совместимость `@react-native-community/cli` с ESM-конфигами (может потребовать пинить версию)
    - После добавления `"type": "module"` скрипты в `scripts/*.mjs` получают ESM автоматически, расширение `.mjs` больше не обязательно
