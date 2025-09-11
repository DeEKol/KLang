# INSTALL.md

**Проект:** KLang — инструкция по установке и запуску (React Native 0.81, миграция с 0.73 → 0.81)  
**Цель:** дать понятный пошаговый гайд для разработчика уровня Junior: от установки окружения до запуска приложения в Android-эмуляторе и решения частых ошибок, которые возникали в процессе миграции.

---

## Содержание
1. Требования к окружению (компоненты и версии)  
2. Установка инструментов: Node, npm/yarn, Java, Android Studio, SDK, Command-line tools  
3. Переменные окружения (`ANDROID_SDK_ROOT`, `PATH`)  
4. Подготовка проекта (package.json, node_modules, pods)  
5. Сборка и запуск на Android-эмуляторе (шаги)  
6. Часто встречавшиеся ошибки и как их фиксить (по симптомам) — быстродоступный индекс  
7. Полезные команды и чеклист перед PR  
8. Примеры исправленных файлов (MainApplication.kt, android/settings.gradle, babel.config.js)  
9. Рекомендации: Renovate, overrides/resolutions, CI

---

## 1. Требования к окружению (рекомендации)
- Node.js: **>= 20.19.4** (рекомендуется Node 20).  
- npm: текущая стабильная версия, или используйте **yarn** / **pnpm** по предпочтению.  
- Java JDK: **11** (или JDK, рекомендованный вашей конфигурацией Android Gradle Plugin).  
- Android Studio (рекомендуется): последняя стабильная версия.  
- Android SDK Platform: **API 36 (platforms;android-36)** и соответствующие Build Tools **36.0.0**.  
- Gradle Wrapper: **Gradle 8.x** (см. `android/gradle/wrapper/gradle-wrapper.properties`).  
- Android Gradle Plugin (AGP): **8.x** (в `android/build.gradle`).  
- Xcode: только для iOS (если нужно).

> Примечание: проект мигрирован с RN 0.73 → 0.81, поэтому требуемые версии SDK и Gradle могли измениться. Всегда проверяйте требования в релиз-нотах RN.

---

## 2. Установка инструментов — простая инструкция для Junior

### Вариант A — рекомендованный (Android Studio + GUI)
1. Скачай и установи **Android Studio**: https://developer.android.com/studio  
2. Открой Android Studio → `Preferences` → `Appearance & Behavior` → `System Settings` → `Android SDK`  
   - Установи **Android SDK Platform 36** (API Level 36)  
   - Во вкладке **SDK Tools** поставь галочку на **Android SDK Command-line Tools (latest)** и **Android SDK Platform-Tools**.  
3. Установи `platform-tools` (adb), `emulator` и **Android Virtual Device (AVD)** через Device Manager (создай AVD, например Pixel_6_API_34 или API 36).

### Вариант B — минимально через командную строку (если не хочешь GUI)
1. Установи Node и npm (через nvm или brew):  
```bash
# macOS example with nvm
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bashrc # или ~/.zshrc
nvm install 20
nvm use 20
node -v
```
2. Установи Android SDK tools (если Android Studio не используется):  
- Скачай command-line tools с официального сайта и распакуй в `~/Library/Android/sdk/cmdline-tools/latest` (macOS) или `~/Android/Sdk/cmdline-tools/latest` (Linux).  
- Пример (macOS):  
```bash
mkdir -p ~/Library/Android/sdk/cmdline-tools
cd ~/Library/Android/sdk/cmdline-tools
curl -O https://dl.google.com/android/repository/commandlinetools-mac-XXXX_latest.zip
unzip commandlinetools-mac-XXXX_latest.zip -d latest
```
- Добавь в PATH (см. раздел 3).

3. Установи необходимые SDK платформы через `sdkmanager` (после того как он доступен в PATH):  
```bash
sdkmanager "platform-tools" "platforms;android-36" "build-tools;36.0.0" "emulator"
```

### Установка Java (пример macOS + brew)
```bash
brew install openjdk@11
# затем в ~/.zshrc
export JAVA_HOME="$(/usr/libexec/java_home -v 11)"
export PATH="$JAVA_HOME/bin:$PATH"
```

---

## 3. Переменные окружения (важно)
Добавь в `~/.zshrc` или `~/.bashrc` (отредактируй путь под вашу систему):
```bash
# Android SDK
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export ANDROID_HOME=$ANDROID_SDK_ROOT
export PATH=$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/emulator:$PATH
```
После изменения: `source ~/.zshrc`

Проверь, что видны команды и папки:
```bash
echo $ANDROID_SDK_ROOT
sdkmanager --list
adb --version
emulator -list-avds
```

---

## 4. Подготовка проекта (корректный порядок действий)
1. Клонируй репозиторий, перейди в ветку миграции (если есть):
```bash
git clone <repo>
cd KLang
git checkout upgrade/rn-0.81
```

2. Подготовь package.json (мы уже собрали согласованный вариант для RN 0.81). Если ты поменял package.json — закоммить изменения.

3. Удаляем старые артефакты и ставим зависимости заново:
```bash
rm -rf node_modules
rm -f package-lock.json yarn.lock pnpm-lock.yaml
npm cache clean --force
npm install
```

4. iOS (если нужно):  
```bash
cd ios
npx pod-install --repo-update
cd ..
```

5. Android: почистить старые билды
```bash
cd android
./gradlew clean
cd ..
```

6. Убедись, что в `babel.config.js` плагин Reanimated стоит последним (если Reanimated используется):
```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // другие плагины
    'react-native-reanimated/plugin' // MUST be last
  ]
};
```

---

## 5. Сборка и запуск в эмуляторе (пошагово)

### 5.1 Подготовка эмулятора (Android Studio)
- Запусти Android Studio → `AVD Manager` → создай AVD (рекомендация: Pixel 6, API 33/34/36).  
- Запусти эмулятор (или запусти через CLI):  
```bash
emulator -list-avds
emulator -avd <AVD_NAME>
```

### 5.2 Запуск Metro (в одном терминале)
```bash
npx react-native start
# или
npm start
```

### 5.3 Сборка и установка приложения (в другом терминале)
```bash
npx react-native run-android
# если нужно с очисткой кеша Metro:
npx react-native start --reset-cache
```

Если установка не проходит, см. раздел "Треублемшутинг".

---

## 6. Частые ошибки (индекс) — ищи по сообщению или по коду ошибки

> Быстрое содержание: ниже перечислены ошибки, которые возникли у нас во время миграции, и готовые решения.

### A. `Could not read script ... @react-native-community/cli-platform-android/native_modules.gradle does not exist`
- **Причина:** Используется старый код в `android/settings.gradle`.  
- **Fix:** Заменить старый фрагмент на новый для RN >=0.71. Пример (в `android/settings.gradle`):
```gradle
pluginManagement {
    includeBuild("../node_modules/@react-native/gradle-plugin")
}

plugins {
    id("com.facebook.react.settings")
}

extensions.configure(com.facebook.react.ReactSettingsExtension) { ex ->
    ex.autolinkLibrariesFromCommand()
}

rootProject.name = "KLang"
include(":app")
```
- После правки: `cd android && ./gradlew clean && cd .. && npx react-native run-android`

### B. `react-native-reanimated` → `[Reanimated] react-native-worklets library not found`
- **Причина:** Reanimated v3.19+ требует пакет `react-native-worklets`.  
- **Fix:**
```bash
npm install react-native-worklets
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

### C. `peer react-native-screens@">= 4.0.0" from @react-navigation/bottom-tabs@7.x`
- **Причина:** `@react-navigation/bottom-tabs@7` требует `react-native-screens >=4`.  
- **Fix:** Обновить `react-native-screens` в `package.json` и `npm install`:
```bash
npm install react-native-screens@^4.15.4 react-native-safe-area-context@^5.6.1
rm -rf node_modules package-lock.json
npm install
cd ios && npx pod-install && cd ..
npx react-native run-android
```

### D. `No modules to process in combine-js-to-schema-cli`
- **Что это:** предупреждение codegen — означает отсутствие кастомных NativeComponents для codegen. Это **не фатально** и можно игнорировать, если нет своих codegen-модулей.

### E. Kotlin compile errors: `Unresolved reference 'flipper'`, `Class 'MainApplication' does not implement reactNativeHost`
- **Причина:** `MainApplication.kt` содержит устаревший код (Flipper, неправильные импорты, неверная реализация свойства).  
- **Fix:** замена `MainApplication.kt` на корректный шаблон (см. раздел 8 — примеры файлов). После правки: `cd android && ./gradlew clean && cd .. && npx react-native run-android`

### F. App builds but immediately crashes on launch
- **Диагностика:** см. section 7 (Логи). Скорее всего: Hermes/native libs mismatch, Reanimated plugin missing, incorrect JS entry (`index` vs `src/index`), or native NoClassDefFoundError.  
- **Быстрые проверки:**
  - Убедись, что Metro запущен (`npx react-native start`).  
  - Запусти `npx react-native log-android` или `adb logcat` и ищи `FATAL EXCEPTION`.  
  - Попробуй временно переключить Hermes true↔false в `android/app/build.gradle` (зависимости могут требовать Hermes off).  
- **Типичное решение:** включить/выключить Hermes и пересобрать:
```bash
# изменить enableHermes в android/app/build.gradle -> true/false
cd android && ./gradlew clean && cd .. && npx react-native run-android
```

### G. `Android SDK - Versions found: N/A` в `react-native doctor`
- **Причина:** `sdkmanager` отсутствует в PATH или Android SDK не найден.  
- **Fix:** установить command-line tools и добавить `ANDROID_SDK_ROOT` в PATH (см. раздел 2 и 3). После установки: `sdkmanager --list` и `sdkmanager "platforms;android-36" "build-tools;36.0.0"`

---

## 7. Сбор логов и отладка (важно)
### Просмотр логов React Native (Android)
```bash
npx react-native log-android
# Или низкоуровневый adb:
adb logcat *:S ReactNative:V ReactNativeJS:V AndroidRuntime:E
```
Если приложение падает — ищи `FATAL EXCEPTION` и блок `Caused by`. Для удобства можно сохранить лог:
```bash
adb logcat -d *:E ReactNative:V ReactNativeJS:V > ~/klang_crash.txt
```

### Более подробная сборка с трассировкой
```bash
cd android
./gradlew app:installDebug --stacktrace --info
```

---

## 8. Примеры фиксированных файлов (копируй/вставляй)

### 8.1 `MainApplication.kt` (корректный шаблон для RN 0.81 — Kotlin)
```kotlin
package com.klang

import android.app.Application
import android.content.Context
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactInstanceManager
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost = object : DefaultReactNativeHost(this) {

    override fun getJSMainModuleName(): String = "index"
    override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

    override fun getPackages(): List<ReactPackage> {
      val packages = PackageList(this@MainApplication).packages
      return packages
    }

    override val isNewArchEnabled: Boolean
      get() = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED

    override val isHermesEnabled: Boolean
      get() = BuildConfig.IS_HERMES_ENABLED
  }

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      DefaultNewArchitectureEntryPoint.load()
    }
    if (BuildConfig.DEBUG) {
      try {
        val aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper")
        val method = aClass.getMethod("initializeFlipper", Context::class.java, ReactInstanceManager::class.java)
        method.invoke(null, this, reactNativeHost.reactInstanceManager)
      } catch (e: Exception) {
        e.printStackTrace()
      }
    }
  }
}
```

### 8.2 `android/settings.gradle` (RN 0.81+)
```gradle
pluginManagement {
    includeBuild("../node_modules/@react-native/gradle-plugin")
}

plugins {
    id("com.facebook.react.settings")
}

extensions.configure(com.facebook.react.ReactSettingsExtension) { ex ->
    ex.autolinkLibrariesFromCommand()
}

rootProject.name = "KLang"
include(":app")
```

### 8.3 `babel.config.js` (Reanimated plugin last)
```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // другие плагины
    'react-native-reanimated/plugin'
  ]
};
```

---

## 9. Полезные инструменты и автоматизация
- **Renovate** — автоматические PR на обновления. Для RN-проектов: включи automerge только для patch/minor, запрети automerge для RN, Reanimated, Firebase.  
- **npm-check-updates (ncu)** — быстрая проверка и массовое обновление `package.json`.  
- **react-native doctor** — диагностика окружения.  
- Используй **lockfile** (package-lock.json / yarn.lock / pnpm-lock.yaml) в CI для детерминированных сборок.

---

## 10. Чеклист перед PR (шаблон)
1. npm install проходит без ошибок.  
2. `cd ios && npx pod-install` (если iOS) проходит.  
3. `cd android && ./gradlew clean assembleDebug` проходит.  
4. Приложение стартует на эмуляторе (dev build).  
5. `npx react-native log-android` — нет FATAL EXCEPTION во время cold start.  
6. ESLint, Prettier и тесты проходят (`npm run lint`, `npm test`).

---

## 11. Быстрый индекс ошибок и команд для поиска
- **"native_modules.gradle does not exist"** → fix `android/settings.gradle` (см. раздел 6.A)  
- **"react-native-worklets library not found"** → `npm i react-native-worklets`  
- **"peer react-native-screens >=4"** → `npm i react-native-screens@^4.15.4 react-native-safe-area-context@^5.6.1`  
- **App immediately crashes** → `npx react-native log-android` / `adb logcat` → искать `FATAL EXCEPTION`  
- **Android SDK N/A** → установить command-line tools + выставить `ANDROID_SDK_ROOT` и установить `platforms;android-36`

---

## 12. Доп. советы для Junior-разраба
- Держи отдельную ветку для апгрейда зависимостей (`upgrade/rn-0.81`) и не мерджь в main без тестов.  
- Делай мелкие шаги: сначала core (RN + React + Metro), потом навигацию, потом нативные библиотеки.  
- Используй Renovate/Dependabot, но блокируй авто-мердж major для RN/Reanimated/Firebase.  
- Если не уверен — сначала откатай одну библиотеку и проверь, решает ли это проблему.

---

## Ресурсы
- React Native Upgrade Helper: https://react-native-community.github.io/upgrade-helper/  
- React Native docs: https://reactnative.dev/  
- Reanimated docs (worklets): https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting  
- Renovate: https://docs.renovatebot.com/

---

**Готово.** Сохрани этот файл в корне проекта как `INSTALL.md` и используй как источник правды при дальнейшем апгрейде и onboarding новых разработчиков.

---

## 13. CI: GitHub Actions — автоматические проверки сборки (Android & iOS)

Ниже — готовые примеры workflow'ов для GitHub Actions, которые выполняют автоматическую сборку и базовые проверки при PR/merge.  
Они помогут поймать регрессии в сборке ещё до ручной проверки.

> Примечание: workflows — ориентиры. Подкорректируй `app`/`workspace`/`scheme`/`AVD` имена под твоё приложение.

---

### 13.1 Общие рекомендации для CI
- Запускай Android workflow на `ubuntu-latest`. Runner уже содержит Android SDK, но мы дополнительно гарантируем установку нужной платформы (API 36).  
- Запускай iOS workflow на `macos-latest` (требуется для Xcode).  
- Кешируй `~/.gradle`, `.gradle`, и `node_modules` / Yarn cache для ускорения сборок.  
- В CI можно отключить Flipper и другие heavy debug-only плагины (через Gradle property или ENV), чтобы сборка была детерминированной. Пример: `-PdisableFlipper=true` или `FLIPPER=false`.  
- Артефакты (APK / xcarchive) можно загрузить в Actions в PR для быстрого скачивания и тестирования.

---

### 13.2 Пример: `.github/workflows/android.yml`

```yaml
name: Android CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build-android:
    runs-on: ubuntu-latest
    env:
      JAVA_HOME: /usr/lib/jvm/java-11-openjdk-amd64
      ANDROID_SDK_ROOT: ${{ runner.os == 'Linux' && '/usr/lib/android-sdk' || '' }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Cache node_modules
        uses: actions/cache@v4
        with:
          path: |
            ~/.npm
            node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - name: Install dependencies
        run: npm ci

      - name: Ensure Android SDK & tools
        run: |
          yes | sdkmanager --licenses || true
          sdkmanager "platform-tools" "platforms;android-36" "build-tools;36.0.0" "emulator"
        env:
          ANDROID_SDK_ROOT: /usr/lib/android-sdk

      - name: Cache Gradle
        uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: |
            ${{ runner.os }}-gradle-

      - name: Clean Android build
        run: |
          cd android
          ./gradlew clean
          cd ..

      - name: Assemble Debug APK
        run: |
          cd android
          ./gradlew assembleDebug -PdisablePreDex -PdisableFlipper=true --no-daemon --stacktrace
        env:
          JAVA_HOME: /usr/lib/jvm/java-11-openjdk-amd64

      - name: Upload APK artifact
        uses: actions/upload-artifact@v4
        with:
          name: app-debug-apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
```

**Пояснения:**
- `-PdisableFlipper=true` — пример property, который ты можешь обработать в `build.gradle` чтобы исключить flipper debug dependencies в CI.  
- `sdkmanager` блок гарантирует, что API 36 установлен. На `ubuntu-latest` пути могут отличаться — при проблемах укажи путь, который выводит `sdkmanager --list`.

---

### 13.3 Пример: `.github/workflows/ios.yml`

```yaml
name: iOS CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build-ios:
    runs-on: macos-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Cache node_modules
        uses: actions/cache@v4
        with:
          path: |
            ~/.npm
            node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - name: Install dependencies
        run: npm ci

      - name: Setup Ruby (for CocoaPods)
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1' 

      - name: Install CocoaPods
        run: |
          gem install cocoapods
          cd ios
          pod install --repo-update
          cd ..

      - name: Build iOS (simulator)
        run: |
          set -o pipefail
          xcodebuild -workspace ios/YourApp.xcworkspace -scheme YourApp -sdk iphonesimulator -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.0' clean build | xcpretty
```

**Пояснения:**
- Замени `YourApp` на фактическое имя схемы (`ios/YourApp.xcworkspace` и `-scheme YourApp`).  
- `xcpretty` можно установить (gem) для аккуратного логирования; в примере всё делается в-line.

---

### 13.4 Отладочные советы для CI
- Если CI падает с `NoClassDefFoundError` — часто проблема с автолинкингом/PackageList. Убедись, что `settings.gradle` и `build.gradle` обновлены по примеру RN 0.81.  
- Если CI падает при native-модулях (Hermes / NDK) — попробуй собрать с `enableHermes=false` в CI или установить нужные NDK/FFI.  
- Для больших проектов добавь `timeout-minutes` к job чтобы избежать промаха по времени.

---

### 13.5 Пример: правило `build.gradle` для отключения Flipper в CI
В `android/app/build.gradle` можно использовать property:
```gradle
def enableFlipper = project.hasProperty('disableFlipper') ? project.getProperty('disableFlipper') != 'true' : true

if (enableFlipper) {
    // debugImplementation 'com.facebook.flipper:flipper:...'
} else {
    // пропустить добавление зависимостей Flipper
}
```
Тогда в CI запускаем с `-PdisableFlipper=true`.

---

### 13.6 Badges (пример для README)
Добавь в `README.md` строки с бейджами:
```markdown
![Android CI](https://github.com/<org>/<repo>/actions/workflows/android.yml/badge.svg)
![iOS CI](https://github.com/<org>/<repo>/actions/workflows/ios.yml/badge.svg)
```

---

## Заключение по CI
Эти примеры дают тебе рабочую базу для автоматической проверки сборки на PR. Начни с простого: `assembleDebug` для Android и `xcodebuild` для iOS — и по мере роста проекта добавляй тесты, линтеры, unit- и e2e-тесты.  

Если хочешь, я могу:
- Сгенерировать конкретные `.yml` файлы с подставленными именами твоего приложения (по package name / scheme), или  
- Создать PR с этими файлами (если у меня есть доступ).  

Скажи, что предпочитаешь — сгенерировать `.yml` с твоими значениями или всё настроить в отдельной ветке?
