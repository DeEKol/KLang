# 08 — Project Configuration & CI/CD

## Current Architecture

### Tech Stack
```
React Native 0.81.1  / React 19.1.0
TypeScript 5.9.2
Hermes JS engine      newArchEnabled=true (New Architecture)
minSdkVersion 24      Android API 24+ (Android 7.0+)
```

### Build System
```
Android   Gradle, SDK 36, Java 17, NDK 27.1.12297006
iOS       CocoaPods 1.16.0, Ruby 3.1, Xcode (latest on macos-latest runner)
```

### CI/CD — GitHub Actions
```
.github/workflows/
  android.yml   ubuntu-latest, push/PR → main, develop
  ios.yml       macos-latest, push/PR → main, develop
```

**Android CI:** npm ci → Java 17 → Android SDK (ручная установка) → Gradle clean → `assembleDebug` → upload APK artifact

**iOS CI:** npm ci → Ruby → CocoaPods pod install → `xcodebuild build` (Simulator, Debug)

### Code Quality
```
ESLint 8.56.0   react-native, typescript, i18next, simple-import-sort плагины
Prettier 3.6.2  100-char lines, double quotes, trailing commas
Jest 30.1.1     preset: "react-native" (минимальная конфигурация)
```

### Path Aliases (Babel + TS)
```js
// babel.config.js — настроены 6 FSD слоёв
alias: { app, entities, features, screens, shared, widgets }
// modules/ — НЕ настроен (импорты из modules/games через относительные пути)
```

---

## Problems

### 🔴 CI-01 — В CI не запускаются тесты

Ни в `android.yml`, ни в `ios.yml` нет шага `npm test`. CI проверяет только что код компилируется, но не запускает тесты.

---

### 🔴 CI-02 — Нет release-сборок в CI

| Workflow | Что делает | Чего не хватает |
|---|---|---|
| `android.yml` | `assembleDebug` | `assembleRelease` / `bundleRelease` |
| `ios.yml` | Simulator Debug build | `archive` + `export` IPA |

Release builds для Android Play Store (AAB) и iOS App Store (IPA) — не автоматизированы. Пользователь собирает вручную.

---

### 🔴 CI-03 — Android release использует debug keystore

```gradle
// android/app/build.gradle
buildTypes {
    release {
        signingConfig signingConfigs.debug  // ← debug keystore для release!
        minifyEnabled false                 // ← код не минифицируется
        // ProGuard отключён
    }
}
```

Release APK/AAB подписан debug-ключом. Google Play не примет такой билд. Нужен production keystore.

---

### 🔴 CI-04 — `.env` не создаётся в CI из секретов

`react-native-dotenv` встраивает переменные из `.env` в бандл на этапе сборки. В CI нет шага создания `.env` из GitHub Secrets. `WEB_CLIENT_ID` и `API_BACKEND` будут пустыми — Firebase и Google Sign-In сломаются в CI-сборке.

---

### 🟡 CI-05 — Установка Android SDK в CI — хрупкий самописный скрипт

Android workflow вручную скачивает и парсит XML-манифест Google, извлекает URL cmdline-tools, распаковывает. 70+ строк bash. Два риска:
1. Google меняет формат манифеста → CI сломается
2. Сетевые ошибки → `exit 2` / `exit 3`

**Решение:** использовать официальное `android-actions/setup-android@v3` или `reactivecircus/android-emulator-runner` — это 3 строки вместо 70.

---

### 🟡 CI-06 — Кэш CocoaPods устанавливается ПОСЛЕ `pod install`

```yaml
# ios.yml
- name: Install CocoaPods
  run: pod install  # ← сначала устанавливаем

- name: Cache CocoaPods & Pods  # ← потом кэшируем (бессмысленно!)
  uses: actions/cache@v4
```

Кэш восстанавливается до `pod install` — но шаг стоит ПОСЛЕ него. Кэш никогда не используется при повторных запусках. Нужно поменять местами.

---

### 🟡 CI-07 — `modules/` не в Babel aliases

```js
// babel.config.js
alias: {
  app, entities, features, screens, shared, widgets
  // modules ← нет!
}
```

Импорты из `modules/games/` используют относительные пути (`../../modules/games/WordMatcher`). Нужно добавить `modules: "./src/modules"`.

---

### 🟡 CI-08 — Jest не знает о FSD path aliases

```js
// jest.config.js
module.exports = { preset: "react-native" };
```

Babel path aliases (`shared/`, `entities/`, etc.) не настроены в Jest через `moduleNameMapper`. Тесты, импортирующие по алиасам, упадут с `Cannot find module 'shared/...'`.

---

### 🟡 CI-09 — `@maplibre/maplibre-react-native` — мёртвая зависимость

Карты нигде не используются в коде, но библиотека (`@maplibre/maplibre-react-native`) подтягивает нативные зависимости для iOS и Android. Увеличивает время сборки, размер приложения и CocoaPods install.

---

### 🟢 CI-10 — `index.js` содержит debug-функцию

```js
// index.js
async function testNetwork() {
  const res = await fetch("https://www.google.com");
  console.log("fetch ok", res.status); // ← console.log в продакшн-точке входа
}
// testNetwork(); // ← закомментировано, но функция остаётся
```

---

### 🟢 CI-11 — `develop` ветка в workflows, но в репо её нет

Оба workflows триггерятся на `develop`, но git история показывает только `main`. Либо создать ветку, либо убрать из triggers.

---

### 🟢 CI-12 — Нет линтинга и проверки форматирования в CI

`npm run validate` (lint + format:check) есть в `package.json`, но не вызывается в workflows. PR с ошибками ESLint/Prettier проходят CI.

---

## Best Practices

### New Architecture (Fabric + TurboModules) ✅

`newArchEnabled=true` — правильное направление для RN 0.81. Нужно убедиться, что все нативные зависимости (firebase, keychain, skia, gesture-handler, reanimated) поддерживают New Architecture.

### Hermes ✅

`hermesEnabled=true` — быстрее старт, меньше памяти, лучше для production.

### `npm ci` в CI ✅

Использует `package-lock.json` — воспроизводимые сборки.

---

## Proposed Architecture

### CI pipeline (целевой)

```
Workflow: pr-checks.yml (на каждый PR)
  1. npm ci
  2. npm run validate          ← lint + format:check
  3. npm test -- --coverage   ← тесты с покрытием
  4. (optional) check-styles

Workflow: build-android.yml
  1. npm ci
  2. Создать .env из secrets
  3. setup-java@v4 (Java 17)
  4. android-actions/setup-android@v3  ← вместо самописного скрипта
  5. Cache Gradle
  6. Debug: assembleDebug → upload artifact
  7. Release (main only): bundleRelease + подпись → upload AAB

Workflow: build-ios.yml
  1. npm ci
  2. Создать .env из secrets
  3. Cache pods (ДО pod install)
  4. pod install
  5. Debug: xcodebuild Simulator
  6. Release (main only): xcodebuild archive → exportArchive → upload IPA
```

### Release signing

```yaml
# GitHub Secrets:
ANDROID_KEYSTORE_BASE64   # base64-encoded production keystore
ANDROID_KEY_ALIAS
ANDROID_KEY_PASSWORD
ANDROID_STORE_PASSWORD

IOS_CERTIFICATE_BASE64    # P12 distribution certificate
IOS_PROVISIONING_PROFILE_BASE64
```

### Jest с FSD aliases

```js
// jest.config.js
module.exports = {
  preset: "react-native",
  moduleNameMapper: {
    "^app/(.*)$": "<rootDir>/src/app/$1",
    "^entities/(.*)$": "<rootDir>/src/entities/$1",
    "^features/(.*)$": "<rootDir>/src/features/$1",
    "^screens/(.*)$": "<rootDir>/src/screens/$1",
    "^shared/(.*)$": "<rootDir>/src/shared/$1",
    "^widgets/(.*)$": "<rootDir>/src/widgets/$1",
    "^modules/(.*)$": "<rootDir>/src/modules/$1",
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
};
```

### Babel alias для modules/

```js
// babel.config.js
alias: {
  app: "./src/app",
  entities: "./src/entities",
  features: "./src/features",
  screens: "./src/screens",
  shared: "./src/shared",
  widgets: "./src/widgets",
  modules: "./src/modules",  // ← добавить
},
```

---

## Task Breakdown

### 🔴 Large

| ID | Task |
|----|------|
| CI-L1 | Настроить release-сборку Android: production keystore в GitHub Secrets, `bundleRelease`, подпись в CI |
| CI-L2 | Настроить release-сборку iOS: distribution certificate + provisioning profile в Secrets, `xcodebuild archive`, export IPA |

### 🟡 Medium

| ID | Task |
|----|------|
| CI-M1 | Добавить шаг создания `.env` из GitHub Secrets в оба workflows |
| CI-M2 | Добавить `npm run validate` (lint + format:check) и `npm test` в CI |
| CI-M3 | Заменить самописный Android SDK скрипт на `android-actions/setup-android@v3` |
| CI-M4 | Исправить порядок кэша CocoaPods в `ios.yml` — до `pod install` |
| CI-M5 | Настроить `jest.config.js`: `moduleNameMapper` для FSD aliases, coverage |
| CI-M6 | Удалить `@maplibre/maplibre-react-native` из dependencies если карты не нужны |

### 🟢 Small

| ID | Task |
|----|------|
| CI-S1 | Добавить `modules: "./src/modules"` в `babel.config.js` aliases; добавить в `tsconfig.json` paths |
| CI-S2 | Удалить `testNetwork()` из `index.js` |
| CI-S3 | Убрать `develop` из workflow triggers или создать ветку |
| CI-S4 | Включить `minifyEnabled true` + ProGuard для release-сборок Android |
