# Mobile Auth Approaches: Firebase-only vs Firebase + Backend JWT

## Контекст

Мобильное приложение использует Firebase для аутентификации (Google, Apple, Email, Anonymous).
Бэкенд — NestJS с `UserAuthGuard`, который умеет валидировать Firebase ID токены через Firebase Admin SDK.

---

## Подход 1: Firebase-only (делегирование Firebase)

### Как работает

```
Firebase signIn()
    ↓
POST /mob/users/auth { idToken }
    ↓
бэк: verifyIdToken() → createOrUpdate user в БД
    ↓
вернуть { uid, email, displayName, photoURL }

--- каждый запрос ---

firebase.currentUser.getIdToken()   ← Firebase сам обновляет если истёк
    ↓
Authorization: Bearer <firebase_token>
    ↓
UserAuthGuard → verifyIdToken()
```

### Что нужно на фронте

```typescript
// axios interceptor — это всё
api.interceptors.request.use(async (config) => {
  const user = auth().currentUser;
  if (user) {
    const token = await user.getIdToken(); // auto-refresh
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Плюсы

- **Простота** — нет refresh endpoint, нет token storage, нет SessionService
- **Надёжность** — Firebase SDK гарантирует актуальность токена, нельзя ошибиться с refresh логикой
- **Меньше кода** — убирается `accessToken`, `refreshToken`, `expiresIn`, Keychain, весь цикл обновления
- **Нет состояния на бэке** — бэк stateless, токен верифицируется через Firebase Admin SDK без БД
- **Автоматический logout** — если пользователь удалён в Firebase Console, следующий `verifyIdToken` вернёт 401 немедленно

### Минусы

- **Каждый запрос — вызов Firebase Admin SDK** — `verifyIdToken` делает сетевой запрос или использует закешированные публичные ключи Firebase (кеш обновляется раз в час). На практике почти всегда из кеша, задержка минимальна.
- **Vendor lock-in** — Firebase становится жёсткой зависимостью для всей цепочки. Уйти с Firebase = переписать auth на бэке и фронте.
- **Нет кастомных claims** — в токене только то, что кладёт Firebase (uid, email, provider). Добавить роль мобильного пользователя в токен нельзя без Firebase Custom Claims (отдельная фича Admin SDK).
- **Время жизни токена фиксировано** — Firebase ID token живёт ровно 1 час, управлять этим нельзя.

### Когда подходит

- Firebase — обязательная зависимость (не планируется замена)
- У мобильных пользователей нет ролей или они простые
- Приоритет — скорость разработки и простота поддержки
- Нет требований к офлайн-валидации токена

---

## Подход 2: Firebase + Backend JWT (двойной обмен)

### Как работает

```
Firebase signIn()
    ↓
POST /mob/users/auth { idToken }
    ↓
бэк: verifyIdToken() → createOrUpdate user → issue own JWT
    ↓
вернуть { accessToken, refreshToken, expiresIn }
    ↓
Keychain.save(accessToken, refreshToken)

--- каждый запрос ---

Keychain.getAccessToken()
    ↓
Authorization: Bearer <backend_jwt>
    ↓
UserAuthGuard → проверяет backend JWT (не Firebase)

--- accessToken истёк ---

POST /mob/users/refresh { refreshToken }
    ↓
новый { accessToken, refreshToken }
    ↓
Keychain.save(...)  → повторить запрос
```

### Что нужно на фронте

```typescript
// axios interceptor с refresh логикой
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const refreshToken = await Keychain.getRefreshToken();
      const { data } = await axios.post(`${BASE_URL}/mob/users/refresh`, { refreshToken });
      await Keychain.saveTokens(data.accessToken, data.refreshToken);
      error.config.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(error.config);
    }
    return Promise.reject(error);
  },
);
```

### Плюсы

- **Независимость от Firebase после логина** — бэк валидирует собственный JWT без обращения к Firebase. Можно отключить Firebase, добавить другой провайдер — API не изменится.
- **Полный контроль над токеном** — время жизни, payload, claims — всё настраивается
- **Кастомные claims** — в JWT можно зашить роль, subscription tier, feature flags — без дополнительных запросов к БД
- **Офлайн-валидация** — JWT верифицируется по секрету/публичному ключу локально, без сети
- **Единый стандарт** — и CMS workers, и mobile users используют JWT. Одна инфраструктура на бэке.

### Минусы

- **Сложность фронта** — нужен Keychain, refresh логика, single-flight (предотвращение параллельных refresh), обработка race conditions
- **Дополнительный endpoint** — `POST /mob/users/refresh` нужно реализовать, тестировать, поддерживать
- **Хранение refresh token** — refresh token долгоживущий, его компрометация критична. Нужна ротация, blacklist в Redis/БД
- **Риск ошибок** — неправильный refresh цикл → пользователь выброшен из приложения или токен не обновляется. Firebase решал это за тебя.
- **Синхронизация состояния** — если пользователь заблокирован в Firebase, backend JWT ещё будет валиден до истечения `expiresIn`

### Когда подходит

- Нужна независимость от конкретного auth провайдера
- Пользователи имеют роли/claims, которые нужны в каждом запросе без похода в БД
- Требования к безопасности предполагают полный контроль над lifecycle токенов
- Планируется поддержка нескольких auth провайдеров (Firebase + собственный + OAuth)

---

## Сравнительная таблица

| Критерий | Firebase-only | Firebase + Backend JWT |
|---|---|---|
| Сложность фронта | Низкая | Высокая |
| Сложность бэка | Низкая | Средняя |
| Vendor lock-in | Высокий | Низкий |
| Кастомные claims | Через Firebase Custom Claims | Нативно в JWT |
| Офлайн-валидация | Нет | Да |
| Контроль времени жизни | Нет (1 час) | Полный |
| Хранение токена на клиенте | Не нужно | Keychain (обязательно) |
| Мгновенный отзыв доступа | Да (через Firebase) | С задержкой (до истечения JWT) |
| Кол-во кода для поддержки | Минимум | Значительно больше |

---

## Вывод для данного проекта

**Рекомендуется: Firebase-only.**

Причины:
1. Firebase — жёсткая зависимость, замена не планируется
2. У мобильных пользователей нет ролей (роли есть только у CMS workers, они уже на отдельном JWT)
3. Кастомные claims не нужны — профиль и статистика подгружаются отдельным запросом
4. Сложность refresh цикла не оправдана для данного масштаба

Если в будущем понадобятся кастомные claims (например, subscription tier) — Firebase Custom Claims решают это без перехода ко второму подходу:

```typescript
// Firebase Admin SDK на бэке — один раз при создании пользователя
await admin.auth().setCustomUserClaims(uid, { subscriptionTier: "premium" });
// Claim появится в следующем getIdToken() на клиенте
```
