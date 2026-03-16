# NOTES — Общие нюансы проекта

Файл для нюансов, которые не вписываются в конкретный раздел, но важны для понимания проекта.

---

## Архитектурные решения (принятые)

| Решение | Обоснование |
|---------|-------------|
| Игры в `modules/games/` вне FSD | Игры — самодостаточные модули с нестандартной структурой; FSD-слои не подходят |
| Auth state — только Redux, не Context | Единый источник правды; AuthContext — только методы |
| Firebase `onAuthStateChanged` → Redux | Стандартный Firebase-паттерн; все auth-события идут через один listener |
| `POST /auth/firebase` = login + register | Backend делает upsert; отдельного register-эндпоинта нет и не нужно |
| Стили: статические в компоненте, тема-зависимые в `*.styles.ts` | ESLint `no-unused-styles` работает для inline, `check-unused-styles.mjs` для внешних |

---

## Известные временные отступления (tech debt)

| Место | Проблема | Когда исправить |
|-------|----------|-----------------|
| `shared/lib/theme/useThemeTokens.ts` | FSD: shared импортирует из entities | При рефакторинге темы (THEME-L2) |
| `entities/*/selectors.ts` | FSD: entities импортируют `RootState` из app | При переносе хуков в shared/lib/redux (FSD-M1) |
| `features/HangelBoard/`, `features/SequencesBuilder/` | Должны быть в modules/games/ | При рефакторинге игр (GAME-M1, GAME-M2) |
| Release: debug keystore | Release build подписан debug-ключом | Перед первым деплоем в магазин |
| Backend: SQLite | Не подходит для production | Перед деплоем бэкенда |

---

## Важные зависимости и их особенности

| Библиотека | Нюанс |
|------------|-------|
| `react-native-reanimated` | Плагин Babel **обязан** быть последним в списке плагинов |
| `@shopify/react-native-skia` | Требует Hermes; New Architecture нужна для лучшей производительности |
| `react-native-gesture-handler` | `<GestureHandlerRootView>` обязателен как корневой элемент |
| `react-native-worklets` | Нужен для `DraggableWordUI` (cross-thread вычисления в SequencesBuilder) |
| `@react-native-firebase/*` | `$RNFirebaseAsStaticFramework = true` в Podfile — обязательно для static linkage iOS |
| `redux-persist` | `PersistGate` загрязняет тип стора (`PersistPartial`); учитывать при типизации |
| `react-native-dotenv` | Переменные встраиваются в бандл на этапе сборки; нужен `.env` при CI-сборке |

---

## Паттерны, принятые в проекте

### Именование
- Компоненты: `PascalCase.tsx`
- Хуки: `useXxx.ts`
- Типы/интерфейсы: `IXxx` (interface), `TXxx` (type alias), `EXxx` (enum)
- Redux slice: `xxxSlice.ts`, экспортирует `{ actions: xxxActions, reducer: xxxReducer }`
- Стили: статика в компоненте → `StyleSheet.create({})`, тема в `Xxx.styles.ts` → `export default function createStyles(colors)`

### Структура FSD slice
```
entities/auth/
  index.ts              публичный API (только отсюда импортировать)
  authSchema.ts         типы Redux state
  model/
    slice/authSlice.ts
    selectors/selectors.ts
```

### Публичный API (index.ts)
Каждый FSD slice экспортирует только через `index.ts`. Прямые импорты из вложенных папок запрещены ESLint-правилом `no-restricted-imports`.

---

## Среда разработки

```
API_BACKEND=http://10.0.2.2:3000   Android Emulator → localhost
API_BACKEND=http://localhost:3000   iOS Simulator → localhost
API_BACKEND=http://<IP>:3000       Физическое устройство → IP сети
```

iOS и Android симуляторы работают локально.

---

## Переводы (i18n)

- Языки: `ru` (основной), `en`
- Файлы: `public/locales/{lang}/{namespace}.json`
- Namespace = имя экрана или фичи (например, `settingsScreen`, `loginScreen`)
- ESLint `i18next/no-literal-string` запрещает хардкод строк в JSX разметке
- `.i18n.ts` файлы — временные, уже не используются; удалить при миграции на `useTranslation`

---

## Скрипты

| Команда | Что делает |
|---------|------------|
| `npm run dump` | Дамп структуры src/ (имена файлов) |
| `npm run dump:content` | Дамп с содержимым файлов |
| `npm run dump:mini` | Дамп с минифицированным содержимым |
| `npm run dump:module` | Дамп одного модуля (передать путь) |
| `npm run check-styles` | Поиск неиспользованных стилей в `*.styles.ts` |
| `npm run fix-all` | lint:fix + format |
| `npm run validate` | lint + format:check (для CI) |

---

## Открытые вопросы

- [ ] Стратегия синхронизации learning-настроек: только AsyncStorage или бэкенд? (SET-S4)
- [ ] Как связать игры с данными уроков/словарём? (GAME — второстепенно)
- [ ] Финальная цветовая палитра: утверждена корейская тематика (쪽빛 + 단청)?
- [ ] `develop` ветка нужна или работаем только в `main`?
