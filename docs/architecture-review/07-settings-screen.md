# 07 — Settings Screen

## Current Architecture

```
screens/SettingsScreen/
  SettingsScreen.tsx        ~400 строк, весь стейт в useState
  index.ts

shared/ui/paper-kit/
  settings-components.tsx   SettingSwitch, SettingRadio, SettingAction, SettingsSection

public/locales/
  ru/settingsScreen.json    57 ключей ✅
  en/settingsScreen.json    57 ключей ✅
```

**Секции Settings:**
```
Appearance     theme (→ Redux ✅), font size (useState ❌)
Notifications  dailyReminder, studyReminder, progressUpdates,
               soundEffects, vibration  (все useState ❌)
Learning       dailyGoal, difficulty, autoPlayAudio,
               romanization, review  (все useState ❌)
Account        Profile, Subscription, Data Export, Privacy → заглушки
About          версия, rate/share/feedback → частично реализованы
```

**Redux:** только `theme.mode` (persisted via AsyncStorage). Остальные настройки — локальный `useState`, сбрасываются при перезапуске.

---

## Problems

### 🔴 SET-01 — Все настройки сбрасываются при перезапуске приложения

Весь пользовательский выбор (уведомления, цель в день, сложность, шрифт) хранится в `useState`. После закрытия и открытия приложения — сброс к дефолтам. Пользователь не может доверять настройкам.

---

### 🔴 SET-02 — Дублирование настроек между `SettingsScreen` и `ProfileScreen`

```tsx
// ProfileScreen.tsx — свой локальный useState
const [notificationsEnabled, setNotificationsEnabled] = useState(true);
const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);
const [vibrationEnabled, setVibrationEnabled] = useState(true);

// SettingsScreen.tsx — свой независимый локальный useState
const [soundEffects, setSoundEffects] = useState(true);
const [vibration, setVibration] = useState(true);
// ...notifications тоже есть
```

Два экрана управляют одними и теми же настройками независимо. Изменение в одном не отражается в другом.

---

### 🟡 SET-03 — `settings-components.tsx` в `shared/ui/paper-kit/`

Компоненты `SettingSwitch`, `SettingRadio`, `SettingAction`, `SettingsSection` — специфичны для экрана настроек и не должны быть в `shared`. FSD нарушение (FSD-06).

**Решение:** перенести в `screens/SettingsScreen/ui/`.

Исключение: если эти компоненты используются и в других экранах (например, в `ProfileScreen`) — тогда перенести в `features/settings-ui/` или оставить в `shared/ui` но переименовать папку.

---

### 🟡 SET-04 — Account-секция: все действия — заглушки

```tsx
// SettingsScreen.tsx
<SettingAction label={t("profile")} onPress={() => {}} />          // ничего не делает
<SettingAction label={t("subscription")} onPress={() => {}} />     // ничего не делает
<SettingAction label={t("dataExport")} onPress={() => {}} />       // ничего не делает
```

`logout` реализован ✅. Остальные — TODO.

---

### 🟡 SET-05 — `handleGoalChange` принимает `key: string` без проверки

```tsx
const handleGoalChange = (key: string, value: unknown) => {
  setSettings(prev => ({ ...prev, [key]: value }));
};
```

`key` не ограничен ключами `settings` объекта — любая строка. При опечатке тихо создаёт новое поле вместо обновления существующего. Нужен `keyof ISettingsState`.

---

### 🟢 SET-06 — `About` секция: версия захардкожена

```tsx
<SettingAction label={t("version")} value="1.0.0" />  // ← хардкод
```

Должно читаться из `package.json` или нативного кода через `react-native-device-info`.

---

### 🟢 SET-07 — `IStateSchema` не содержит settings

```ts
// stateSchema.ts
interface IStateSchema {
  auth: IAuthSchema;
  counter: ICounterSchema;  // ← test entity
  theme: IThemeSchema;
  posts: IPostsSchema;      // ← test entity
  // settings: нет!
}
```

---

## Open Question: нужна ли синхронизация настроек с бэкендом?

Два варианта архитектуры:

**A) Только локально (AsyncStorage + Redux Persist)**
- Настройки хранятся на устройстве
- При смене устройства — сброс
- Проще в реализации
- Достаточно для: уведомлений, темы, font size, vibration/sound

**B) Синхронизация с бэкендом**
- `PUT /users/settings` — сохранение на сервере
- При входе с нового устройства — настройки восстанавливаются
- Нужны: добавить `settings` колонку в `UserOrmEntity` (JSON поле)
- Подходит для: dailyGoal, difficulty, romanization — влияют на контент/прогресс

**Рекомендация:** гибридный подход:
- UI-настройки (тема, шрифт, звуки) → только AsyncStorage
- Обучающие настройки (dailyGoal, difficulty, romanization) → синхронизировать с бэкендом

---

## Proposed Architecture

### Redux entity для настроек

```ts
// entities/settings/types/settingsSchema.ts
interface IUserPreferences {
  // Learning (синхронизировать с бэкендом)
  dailyGoal: number;               // минут в день
  difficulty: "beginner" | "intermediate" | "advanced";
  romanization: boolean;
  autoPlayAudio: boolean;
  // UI (только localStorage)
  fontSize: "small" | "medium" | "large";
  soundEffects: boolean;
  vibration: boolean;
}

interface ISettingsSchema {
  preferences: IUserPreferences;
  notifications: {
    dailyReminder: boolean;
    studyReminder: boolean;
    progressUpdates: boolean;
  };
  isSyncing: boolean;
}
```

### Поток данных

```
Пользователь меняет настройку
  → dispatch(settingsActions.updatePreference({ key, value }))
  → Redux store (немедленное отражение в UI)
  → redux-persist → AsyncStorage (автоматически)

Если learning-настройка (dailyGoal, difficulty):
  → debounce 500ms
  → authFetch PUT /users/settings { preferences }
  → бэкенд сохраняет в user.settings (JSON поле)

При входе / смене устройства:
  → GET /users/settings (или включить в auth response)
  → dispatch(settingsActions.hydrate(serverPreferences))
```

### Устранить дублирование с ProfileScreen

```ts
// ProfileScreen использует те же данные из Redux
const { soundEffects, vibration } = useSelector(getNotificationSettings);
// dispatch при изменении — один источник правды
```

---

## Task Breakdown

### 🟡 Medium

| ID | Task |
|----|------|
| SET-M1 | Создать `entities/settings/` (Redux slice + selectors + types); подключить redux-persist; перенести все `useState` из `SettingsScreen` в Redux |
| SET-M2 | Устранить дублирование между `SettingsScreen` и `ProfileScreen` — оба читают из Redux |
| SET-M3 | Перенести `settings-components.tsx` из `shared/ui/paper-kit/` в `screens/SettingsScreen/ui/` (или `features/settings-ui/` если переиспользуются) |
| SET-M4 | (После бэкенд поддержки) Добавить sync learning-настроек: `PUT /users/settings`; загрузка при старте |

### 🟢 Small

| ID | Task |
|----|------|
| SET-S1 | Типизировать `handleGoalChange` через `keyof IUserPreferences` вместо `string` |
| SET-S2 | Версию приложения читать из `react-native-device-info` или `package.json`, не хардкод |
| SET-S3 | Реализовать навигацию на Profile из Account-секции (когда `ProfileScreen` готов) |
| SET-S4 | **Решение:** определить стратегию синхронизации learning-настроек — только AsyncStorage или бэкенд (`PUT /users/settings`) |
