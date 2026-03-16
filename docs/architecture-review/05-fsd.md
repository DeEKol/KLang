# 05 — FSD Structure

## Current Architecture

```
src/
├── app/          ← провайдеры, роутинг, инициализация стора
├── screens/      ← полноэкранные компоненты (=pages в оригинальном FSD)
├── widgets/      ← комплексные составные компоненты (пока пуст)
├── features/     ← фичи с UI (HangelBoard, SequencesBuilder, auth)
├── entities/     ← доменные модели (auth, theme, counter*, postsTestApi*)
├── shared/       ← переиспользуемое: config, helpers, api, ui, lib
└── modules/      ← нефsd слой (игры)
```

**Иерархия импортов (↓ = может импортировать из):**
```
app ↓ все
screens ↓ widgets, features, entities, shared
widgets ↓ features, entities, shared
features ↓ entities, shared
entities ↓ shared
shared ↓ (только внешние либы и себя)
```

---

## Problems

### 🟡 FSD-01 — `shared` импортирует из `entities`

```ts
// shared/lib/theme/useThemeTokens.ts
import { getThemeMode } from "entities/theme"; // ← вверх по иерархии
```

Подробно описано в [03-styles-and-theme.md](./03-styles-and-theme.md) (THEME-03).

**Решение:** перенести `useThemeTokens` в `entities/theme/model/hooks/`.

---

### 🟡 FSD-02 — `entities` и `features` импортируют из `app`

Все случаи связаны с двумя импортами из `app/providers/StoreProvider`:

| Файл | Импорт | Проблема |
|------|--------|----------|
| `entities/theme/.../getTheme.ts` | `IStateSchema` | тип всего стора в entity |
| `entities/auth/.../selectors.ts` | `RootState` | то же + прямой импорт файла (не index.ts) |
| `features/auth/hooks/useAuth.ts` | `useAppDispatch` | feature зависит от app |

**Корень проблемы:** `useAppDispatch`, `useAppSelector` и `RootState` / `IStateSchema` определены в `app`. Нижние слои их используют, и без этого Redux не типизировать.

**Варианты решения:**

**A) Прагматичный (рекомендуется):** Перенести типизированные хуки в `shared/lib/redux/hooks.ts`:
```ts
// shared/lib/redux/hooks.ts
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "app/providers/StoreProvider";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.bind(null) as <T>(selector: (state: RootState) => T) => T;
```
Тогда entities/features импортируют из `shared` (разрешено), а не из `app`.
Нарушение одно и локализовано в одном файле `shared/lib/redux/hooks.ts`.

**B) Чистый FSD:** Каждая entity определяет свой минимальный тип стейта:
```ts
// entities/auth/model/selectors/selectors.ts
interface TAuthState { auth: IAuthSchema }
export const getIsAuthenticated = (state: TAuthState) => state.auth.isAuthenticated;
```
Минус: нет автодополнения по всему стору, дублирование.

**Принятое решение: вариант A** — перенести хуки в `shared/lib/redux/hooks.ts`.

---

### 🟡 FSD-03 — `entities/auth/selectors.ts` делает прямой импорт, минуя `index.ts`

```ts
// entities/auth/model/selectors/selectors.ts
import type { RootState } from "app/providers/StoreProvider/StoreProvider"; // ← прямо в файл!
//                                                              ^^^^^^^^^^^^
// должно быть: "app/providers/StoreProvider" (через index.ts)
```

---

### 🟡 FSD-04 — HangelBoard и SequencesBuilder в `features/`

Игры не являются "feature slices" — они комплексные, самодостаточные модули. Должны быть в `modules/games/`. Подробно описано в [04-games.md](./04-games.md) (GAME-01).

---

### 🟢 FSD-05 — Тестовые entities не удалены

```
entities/Counter/          ← тестовый счётчик (Redux Toolkit tutorial)
entities/PostsTestApi/     ← тестовый API (RTK Query tutorial)
```

Оба нарушают FSD дополнительно — импортируют `useAppDispatch` из `app` (FSD-02).
Единственное решение — удалить.

---

### 🟢 FSD-06 — `settings-components.tsx` в `shared/ui/paper-kit/`

```
shared/ui/paper-kit/settings-components.tsx
```

Компонент настроек лежит в `shared`. `shared` не должен знать о конкретных экранах приложения.
Должен быть в `screens/SettingsScreen/ui/`.

---

### 🟢 FSD-07 — `widgets/` слой пустой

В FSD `widgets` — это крупные составные блоки (Header, Sidebar, Feed). В проекте этот слой присутствует, но пуст. Кандидаты на перемещение из `screens` в `widgets`:
- шапка с аватаром и прогрессом пользователя (если появится)
- карточка урока (LessonCard) для HomeScreen

---

## Best Practices

### Правило публичных API (index.ts) ✅

Каждый слайс обязан экспортировать только через `index.ts`. Прямые импорты из вложенных папок запрещены. ESLint `boundaries/element-types` или `import/no-internal-modules` может это автоматизировать.

### `modules/` как escape hatch

Нефsd код (игры) выносится в `modules/` — это осознанное решение. Модули не импортируются между собой, каждый самодостаточен. `screens/PracticeScreen` импортирует из `modules/games` — это допустимо (screen выше modules по смыслу).

---

## Proposed Architecture

### Целевая структура `shared/lib/`

```
shared/lib/
├── redux/
│   └── hooks.ts          useAppDispatch, useAppSelector (ПЕРЕНЕСТИ из app)
├── theme/
│   ├── types.ts
│   ├── tokens.ts         createTheme()
│   ├── colors/
│   ├── mapTokensToMD3.ts
│   └── utils.ts
│   (useThemeTokens УБРАТЬ отсюда → entities/theme)
├── animations/
│   └── index.ts          общие анимации
└── storage/
    └── index.ts          AsyncStorage helpers
```

### Целевая структура `entities/`

```
entities/
├── auth/
│   └── model/hooks/useThemeTokens — (нет, это theme)
├── theme/
│   └── model/hooks/useThemeTokens.ts   ← ПЕРЕНЕСТИ сюда
└── (удалить: Counter/, PostsTestApi/)
```

---

## Task Breakdown

### 🟡 Medium

| ID | Task |
|----|------|
| FSD-M1 | Создать `shared/lib/redux/hooks.ts` с `useAppDispatch` и `useAppSelector`; обновить все импорты в `entities/` и `features/` |
| FSD-M2 | Перенести `useThemeTokens` из `shared/lib/theme` в `entities/theme/model/hooks/`; обновить все импорты |
| FSD-M3 | Перенести `settings-components.tsx` из `shared/ui/paper-kit/` в `screens/SettingsScreen/ui/` |

### 🟢 Small

| ID | Task |
|----|------|
| FSD-S1 | Удалить `entities/Counter/` и `entities/PostsTestApi/` |
| FSD-S2 | Исправить прямой импорт в `entities/auth/selectors.ts`: `StoreProvider/StoreProvider` → `StoreProvider` (через index) |
| FSD-S3 | HangelBoard + SequencesBuilder → `modules/games/` (дублируется с GAME-M1, GAME-M2) |
