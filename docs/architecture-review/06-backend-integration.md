# 06 — Backend Integration

## Current Architecture

### Backend (NestJS + Hexagonal)

```
POST /auth/firebase   { idToken } → { accessToken, refreshToken, expiresIn }
                      Firebase idToken верифицируется, user upsert-ится в БД

GET/POST/PUT/DELETE /lessons      CRUD для Section → Lesson → Page
GET/POST/PUT/DELETE /sections
GET/POST/PUT/DELETE /pages
```

**БД:** SQLite (TypeORM) — только для разработки. Production: нужна PostgreSQL.

**User entity на бэкенде:** `id` (UUID), `uid` (Firebase), `email`, `displayName`, `photoURL`, `provider`, `meta` (полный decoded token).

---

### Frontend: слой API

```
shared/api/
  client.ts           базовый fetch-клиент (POST only, читает токен напрямую из SecureStore)

shared/auth/
  authFetch.ts        authenticated fetch (через SessionService, 401→refresh→retry)
  SessionService.ts   lifecycle токенов: exchange Firebase idToken → backend JWT

shared/storage/
  secureStore.ts      хранение accessToken + refreshToken в react-native-keychain
```

**Переменные окружения (`.env`):**
```
API_BACKEND=http://10.0.2.2:3000   ← Android-эмулятор localhost, нет staging/prod URL
```

---

### Текущий уровень интеграции

| Область | Статус |
|---------|--------|
| Auth: Firebase → Backend JWT | ✅ Реализовано |
| Secure token storage | ✅ `react-native-keychain` |
| Authenticated fetch wrapper | ✅ `authFetch.ts` |
| Lesson/Section/Page API | ❌ Нет Redux entity, нет вызовов |
| User profile API | ❌ Нет эндпоинта на бэкенде |
| User progress API | ❌ Таблица есть на БД, эндпоинта нет |
| Refresh token endpoint | ❌ Нет на бэкенде |
| Error handling / loading states | ❌ Нет глобальной стратегии |
| Staging / Production URL | ❌ Только локальный Android-адрес |

---

## Problems

### 🔴 BE-01 — Два несовместимых API-клиента

В проекте существуют два механизма для авторизованных запросов, которые работают по-разному:

```ts
// shared/api/client.ts — читает токен НАПРЯМУЮ из SecureStore
const token = await SecureStore.getBackendToken();
// Нет логики обновления токена при 401

// shared/auth/authFetch.ts — через SessionService
const token = await SessionService.getAccessToken(); // кешируется, обновляется
// 401 → refreshAccessTokenIfNeeded() → retry
```

`apiClient.ts` не знает о том, что токен мог истечь и нуждается в обновлении. Если оба используются в коде — будут непредсказуемые сбои авторизации.

**Решение:** оставить только `authFetch`. `apiClient.ts` — либо удалить, либо переписать поверх `authFetch`.

---

### 🔴 BE-02 — `SessionService.refreshAccessTokenIfNeeded` вызывает несуществующий эндпоинт

`SessionService` хранит `refreshToken` (случайные байты с бэкенда) и при истечении токена вызывает `POST /auth/refresh`. Этого эндпоинта на бэкенде **нет**.

**Правильная стратегия (без лишнего эндпоинта):**
```ts
// При 401 или истечении accessToken:
const freshIdToken = await firebase.getIdToken(true); // Firebase auto-refresh
// → POST /auth/firebase { idToken: freshIdToken }
// → новый accessToken, сохранить
```

Firebase SDK автоматически обновляет свой токен каждые ~50 минут. `getIdToken(force: true)` форсирует обновление. Хранить `refreshToken` на клиенте не нужно — Firebase IdToken и есть механизм refresh.

---

### 🔴 BE-03 — SQLite не подходит для production

```ts
// data-source.ts
type: "sqlite",
database: "database.sqlite",
```

SQLite — однопользовательская, файловая БД. Не выдержит concurrent запросов при масштабировании. Нужно мигрировать на PostgreSQL перед деплоем.

---

### 🟡 BE-04 — Нет Redux entity для контента (Lesson, Section, Page)

Бэкенд имеет полный CRUD API для уроков, но фронтенд никак его не использует. Нет:
- `entities/lesson/` в Redux
- API-вызовов для получения уроков
- Загрузки данных в `StudyScreen`, `HomeScreen`

---

### 🟡 BE-05 — `API_BACKEND` настроен только для Android-эмулятора

```
API_BACKEND=http://10.0.2.2:3000   ← работает только в Android эмуляторе
```

- iOS Simulator использует `http://localhost:3000`
- Реальные устройства — IP сети или ngrok URL
- Staging/Production — отдельный URL

Нет структуры для разных окружений (`.env.development`, `.env.production`).

---

### 🟡 BE-06 — Нет глобальной стратегии обработки ошибок API

В `authFetch.ts` ошибки пробрасываются как `throw`. На уровне компонентов / Redux нет единого механизма:
- Toast / Snackbar для пользовательских ошибок
- Разграничение сетевых ошибок и бизнес-ошибок (4xx vs 5xx)
- Retry для временных сетевых сбоев

---

### 🟡 BE-07 — Нет эндпоинта для User Progress на бэкенде

Таблица `user_progress` в БД существует, ORM entity есть, но:
- Нет контроллера
- Нет use-case
- Нет API эндпоинта

Сохранение прогресса игр и уроков невозможно.

---

### 🟢 BE-08 — `apiClient.ts` поддерживает только `POST`

```ts
export const apiClient = {
  async post(path: string, body: Record<string, unknown>, opts)
}
```

CRUD API требует GET, PUT, DELETE. Клиент не полный.

---

### 🟢 BE-09 — `.env` закоммичен или в `.gitignore`?

`.env` содержит `WEB_CLIENT_ID` (Google OAuth client ID). Нужно убедиться что:
- `.env` в `.gitignore`
- Для CI/CD есть секреты или `.env.example`

---

## Best Practices

### Hexagonal architecture на бэкенде ✅

Бэкенд правильно структурирован: domain → ports (in/out) → adapters. Можно заменить Firebase на другой auth провайдер, не трогая бизнес-логику.

### Firebase idToken как единый механизм refresh ✅ (нужно закончить)

Концепция правильная: Firebase управляет сессией, бэкенд только верифицирует. Не нужен отдельный refresh token — Firebase сам обновляет свой токен.

### Secure storage для токенов ✅

`react-native-keychain` — правильный выбор для хранения секретов на мобильном.

---

## Proposed Architecture

### Единый API клиент (убрать дублирование)

```ts
// shared/api/apiClient.ts — поверх authFetch
export const apiClient = {
  get:    <T>(path: string) => authFetch(`${API_BASE}${path}`, { method: "GET" }).then(r => r.json() as T),
  post:   <T>(path: string, body: unknown) => authFetch(...).then(r => r.json() as T),
  put:    <T>(path: string, body: unknown) => authFetch(...).then(r => r.json() as T),
  delete: <T>(path: string) => authFetch(...).then(r => r.json() as T),
};
```

### SessionService: упростить refresh через Firebase

```ts
// SessionService.ts — убрать refreshToken логику
async refreshAccessTokenIfNeeded(): Promise<string | null> {
  const freshIdToken = await firebase.getIdToken(true);  // Firebase auto-refresh
  if (!freshIdToken) return null;
  const tokens = await this.exchangeFirebaseToken(freshIdToken);
  await SecureStore.setBackendToken(tokens.accessToken);
  // refreshToken больше не нужен
  return tokens.accessToken;
}
```

### Структура env-файлов

```
.env                 ← gitignored, локальные переменные разработчика
.env.example         ← закоммичен, шаблон без секретов
.env.staging         ← CI/CD секреты
.env.production      ← CI/CD секреты
```

```
# .env.example
API_BACKEND=http://localhost:3000
WEB_CLIENT_ID=ваш_client_id
```

### Redux entity для уроков (будущее)

```
entities/lesson/
  model/
    slice/lessonSlice.ts     { sections: ISection[], status, error }
    selectors/               getSection, getLesson, getCurrentLesson
    thunks/                  fetchSections(), fetchLesson(id)
  types/lessonSchema.ts
  index.ts
```

### Бэкенд: добавить UserProgress эндпоинт

```ts
// Нужно добавить:
POST /user-progress    { lessonId, score, timeMs, mistakes }
GET  /user-progress    → статистика пользователя
```

---

## Task Breakdown

### 🔴 Large

| ID | Task |
|----|------|
| BE-L1 | Мигрировать бэкенд с SQLite на PostgreSQL; обновить `data-source.ts` и docker-compose |
| BE-L2 | Создать `entities/lesson/` на фронтенде: Redux slice, селекторы, thunks для загрузки Section/Lesson/Page с API |

### 🟡 Medium

| ID | Task |
|----|------|
| BE-M1 | Удалить `apiClient.ts`; переписать все вызовы поверх `authFetch`; добавить GET/PUT/DELETE методы |
| BE-M2 | Исправить `SessionService.refreshAccessTokenIfNeeded`: убрать `POST /auth/refresh`, заменить на `firebase.getIdToken(true)` → `POST /auth/firebase` |
| BE-M3 | Добавить `.env.example` в репо; добавить `.env` в `.gitignore` если ещё нет; структурировать env для dev/staging/prod |
| BE-M4 | Добавить бэкенд эндпоинт `POST /user-progress`; подключить к фронтенду через `authFetch` после игровых сессий |
| BE-M5 | Определить глобальную стратегию ошибок API: enum кодов ошибок, Toast/Snackbar в `UIProvider`, wrapper для API thunks |

### 🟢 Small

| ID | Task |
|----|------|
| BE-S1 | Добавить `http://localhost:3000` в `.env` для iOS Simulator (или условную логику Platform.OS) |
| BE-S2 | Удалить `PostsTestApi` entity (дублируется с FSD-S1) |
