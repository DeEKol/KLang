
# Управление версиями и зависимостями в React Native CLI проекте

Этот документ описывает команды, инструменты и практики для поддержания зависимостей в актуальном и совместимом состоянии.

---

## Основные команды npm/yarn/pnpm

### Проверка установленных версий и доступных обновлений
```bash
npm outdated
yarn outdated
pnpm outdated
```

### Установка конкретной версии пакета
```bash
npm install react-native@0.81.1
yarn add react-native@0.81.1
pnpm add react-native@0.81.1
```

### Обновление всех пакетов до последних мажорных версий
```bash
npm update
yarn upgrade
pnpm up -L
```

### Удаление node_modules и очистка кеша
```bash
rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml
npm cache clean --force
```

---

## React Native CLI и Metro

### Проверка окружения
```bash
npx react-native doctor
```

### Автоисправление (если доступно)
```bash
npx react-native doctor --fix
```

### Запуск приложения
```bash
npx react-native run-android
npx react-native run-ios
```

---

## Renovate (автоматизация обновлений)

Renovate помогает автоматически создавать Pull Request’ы для обновления зависимостей.

### Установка
```bash
npm install -g renovate
```

### Конфигурация
Создать файл `renovate.json` в корне проекта:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:base"],
  "rangeStrategy": "replace",
  "packageRules": [
    {
      "matchPackagePatterns": ["^react", "^@react"],
      "groupName": "react-packages"
    },
    {
      "matchPackagePatterns": ["^@react-native"],
      "groupName": "react-native-core"
    }
  ]
}
```

После этого Renovate будет автоматически предлагать обновления.

---

## Полезные инструменты

- **npm-check-updates (ncu)** — проверяет и обновляет версии пакетов в `package.json`:
  ```bash
  npx npm-check-updates -u
  npm install
  ```

- **react-native upgrade-helper** — сайт, показывающий diff между версиями RN:  
  🔗 https://react-native-community.github.io/upgrade-helper/

---

## Частые проблемы и их решение

### Android Gradle Plugin / Gradle
- React Native 0.81 требует **Gradle 8+** и **AGP 8+**.
- Проверить версию: `./gradlew --version`

### iOS
- После обновлений: `cd ios && pod install --repo-update`

### Metro
- Иногда нужно очистить кеш:
  ```bash
  npx react-native start --reset-cache
  ```

---

## Peer Dependencies (важные зависимости)

Некоторые библиотеки требуют дополнительные пакеты для корректной работы:

| 📦 Библиотека | ⚡ Требует | 🛠️ Решение |
|---------------|-----------|-------------|
| **react-native-reanimated ≥3.19** | `react-native-worklets` | `npm i react-native-worklets` |
| **@react-navigation/bottom-tabs ≥7** | `react-native-screens >=4`, `react-native-safe-area-context >=5` | обновить эти пакеты |
| **react-native-paper 5.x** | `react-native-vector-icons` | `npm i react-native-vector-icons` |
| **react-native-svg ≥15** | `react-native-svg-transformer` (для импорта svg как компонентов) | `npm i react-native-svg-transformer` |
| **react-native-firebase ≥18** | Android Gradle Plugin 8+ | убедиться в совместимости |

---

## Резюме (основные команды)

```bash
# Проверить окружение
npx react-native doctor

# Проверить обновления пакетов
npm outdated

# Автоматически обновить версии в package.json
npx npm-check-updates -u && npm install

# Очистить кеш и node_modules
rm -rf node_modules package-lock.json && npm cache clean --force && npm install

# Запустить Android/iOS
npx react-native run-android
npx react-native run-ios

# Сбросить кеш Metro
npx react-native start --reset-cache
```
