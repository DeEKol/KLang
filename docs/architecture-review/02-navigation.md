# 02 — Navigation

## Current Architecture

```
NavigationProvider (NavigationContainer)
└── RootStack (NativeStack)
    ├── [!isAuthenticated] AuthStackNavigator
    │   ├── LoginScreen
    │   ├── SignupScreen
    │   ├── ForgotPasswordScreen
    │   ├── EmailConfirmationScreen
    │   └── SMSConfirmationScreen
    └── [isAuthenticated]
        ├── BottomTabsNavigator (react-native-paper BottomNavigation.Bar)
        │   ├── HomeTab → HomeStackNavigator (Home, Profile, Roadmap)
        │   ├── StudyTab → StudyStackNavigator (Study, Lesson)
        │   ├── PracticeTab → PracticeStackNavigator (Practice, Hangel, WordMatcher, SequencesBuilder)
        │   ├── SettingsTab → SettingsScreen (напрямую, без стека)
        │   └── TestTab → TestStackNavigator (Test, UiScreen)
        ├── ModalScreen
        └── NotFoundScreen
```

**Типизация:** полная — `ENavigation` enum, отдельные `TXxxStackParamList` типы, составные `CompositeNavigationProp`, типизированные хуки в `useAppNavigation.ts`.

**Deep links:** `klang://` схема, конфиг в `linking.ts`.

**Утилиты:** `navigationRef`, `navigate()`, `goBack()`, `resetTo()` из `utils.ts` для внешней навигации (вне компонентов).

---

## Problems

### 🔴 NAV-01 — Auth flash: нет splash-экрана пока Firebase инициализируется

`NavigationProvider` переключает стек только по `isAuthenticated`:

```tsx
{!isAuthenticated ? <AuthStackNavigator /> : <MainNavigator />}
```

При старте приложения `isAuthenticated = false` и `isInitialized = false` — пользователь **мгновенно видит экран логина**, а через 1-2 секунды (когда Firebase отвечает) перебрасывается в основное приложение. Визуальный флик.

Селектор `getIsInitialized` уже создан в `entities/auth`, но нигде не используется.

**Правильно:**
```tsx
if (!isInitialized) return <SplashScreen />;
return !isAuthenticated ? <AuthStackNavigator /> : <MainNavigator />;
```

---

### 🔴 NAV-02 — Deeplink конфиг (`linking.ts`) не совпадает с именами экранов

`linking.ts` содержит hardcoded строки, которые **не совпадают** с реальными именами табов из `ETabNavigation`:

| `linking.ts` key | Реальный tab name | Правильно |
|---|---|---|
| `"HomeScreen"` | `ETabNavigation.HOME = "HomeTab"` | `"HomeTab"` |
| `"Study"` | `ETabNavigation.STUDY = "StudyTab"` | `"StudyTab"` |
| `"PracticeScreen"` | `ETabNavigation.PRACTICE = "PracticeTab"` | `"PracticeTab"` |
| `"SettingsScreen"` | `ETabNavigation.SETTINGS = "SettingsTab"` | `"SettingsTab"` |
| `"TestScreen"` | `ETabNavigation.TEST = "TestTab"` | `"TestTab"` |

**Следствие:** deep links на табы вообще не работают. React Navigation не может найти экраны по неправильным именам.

**Правильно:** использовать `ETabNavigation` в `linking.ts`, а не строки вручную:
```ts
screens: {
  [ENavigation.MAIN]: {
    screens: {
      [ETabNavigation.HOME]: "home",
      [ETabNavigation.STUDY]: "study",
      // ...
    },
  },
},
```

---

### 🟡 NAV-03 — `routes.ts` и `linking.ts` дублируют пути и расходятся

`routes.ts` определяет `ROUTE_PATHS` с полными путями (`"auth/login/:next?"`), но `linking.ts` не импортирует из него — хардкодит свои пути (`"login"`). Два источника правды для одного и того же, которые уже рассинхронизированы:

| Маршрут | `routes.ts` | `linking.ts` |
|---|---|---|
| LOGIN | `"auth/login/:next?"` | `"login"` |
| SIGNUP | `"auth/signup"` | `"signup"` |
| AUTH | `"auth"` | (нет) |

Должен быть один источник правды. Либо `linking.ts` использует `ROUTE_PATHS`, либо `routes.ts` удаляется.

---

### 🟡 NAV-04 — `makeUrl` использует `"myapp://"` вместо `"klang://"`

```ts
// url/makeUrl.ts
return `myapp://${path}${qs}`;  // ← неправильная схема
```

```ts
// linking.ts
prefixes: ["klang://"],  // ← реальная схема приложения
```

Тест тоже проверяет неправильный префикс. Сгенерированные URL невалидны.

---

### 🟡 NAV-05 — `SettingsScreen` — прямой компонент в табе, без стека

Все табы используют Stack navigator, `Settings` — нет:
```tsx
<Tab.Screen name={ETabNavigation.SETTINGS} component={SettingsScreen} />
```

Если понадобится навигация внутри Settings (например, отдельный экран уведомлений, экран смены пароля), это потребует добавления `SettingsStackNavigator`. Лучше сделать заранее.

---

### 🟡 NAV-06 — `AnimatedIcon`: неправильный `inputRange` в `translateY`

```ts
const translateY = val.interpolate({
  inputRange: [0, 10],  // ← val меняется от 0 до 1, до 10 никогда не дойдёт
  outputRange: [0, -2],
});
```

`val` всегда в диапазоне `[0, 1]`, поэтому `translateY` меняется только на `-0.2px` вместо `-2px`. Анимация подъёма иконки не работает.

**Правильно:** `inputRange: [0, 1]`

---

### 🟢 NAV-07 — Мёртвые импорты в `BottomTabsNavigator`

```ts
import { BlurMask } from "@shopify/react-native-skia";  // нигде не используется
import { BounceInView } from "shared/animations/Animated";  // нигде не используется
```

---

### 🟢 NAV-08 — Хардкод в заголовках `PracticeStackNavigator`

```tsx
screenOptions={{
  title: "Practice Screen",  // хардкод EN, без i18n
  headerShown: true,
}}
```

Все остальные навигаторы имеют `headerShown: false`. Если заголовок нужен — использовать `t("practiceScreen")`.

---

### 🟢 NAV-09 — `useAppNavigation.ts` содержит коментарий "IS THIS SHOULD USE?"

Указывает на неопределённость в статусе файла. Файл нужен, но нужно убрать этот комментарий.

---

## Best Practices

### Auth-gated navigation ✅ (паттерн правильный, нужна инициализация)

Условный рендеринг стека на основе `isAuthenticated` — правильный подход для React Navigation v7. Нужно только добавить проверку `isInitialized` для splash-экрана.

### `PaperBottomTabs` — кастомный tab bar ✅

Правильная интеграция `react-native-paper` `BottomNavigation.Bar` через `tabBar` prop. Компонент чистый, мемоизированный.

### Типизированные хуки ✅

`useAppNavigation`, `usePracticeNavigation`, `useAppRoute` — правильный подход. Скрывает сложность `CompositeNavigationProp` от потребителей.

### Внешняя навигация через `navigationRef` ✅

`navigate()`, `resetTo()` из `utils.ts` — стандартная практика для навигации вне компонентов (например, из Redux middleware или auth провайдера).

---

## Proposed Architecture

### Splash/Loading state (auth flash fix)

```tsx
// NavigationProvider.tsx
const isInitialized = useSelector(getIsInitialized);
const isAuthenticated = useSelector(getIsAuthenticated);

if (!isInitialized) {
  return <SplashScreen />;  // или ActivityIndicator, или LottieAnimation
}

return (
  <NavigationContainer ref={navigationRef} linking={linking} theme={navTheme}>
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated
        ? <RootStack.Screen name={ENavigation.AUTH} component={AuthStackNavigator} />
        : <>
            <RootStack.Screen name={ENavigation.MAIN} component={BottomTabsNavigator} />
            <RootStack.Screen name={ENavigation.MODAL} component={ModalScreen} options={{ presentation: "modal" }} />
            <RootStack.Screen name={ENavigation.NOT_FOUND} component={NotFoundScreen} />
          </>
      }
    </RootStack.Navigator>
  </NavigationContainer>
);
```

### Единый источник правды для путей

Убрать `routes.ts` или сделать `linking.ts` зависимым от него:

```ts
// linking.ts — использует ENavigation/ETabNavigation напрямую
export const linking: LinkingOptions<TRootStackParamList> = {
  prefixes: ["klang://"],
  config: {
    screens: {
      [ENavigation.AUTH]: {
        screens: {
          [ENavigation.LOGIN]: "login",
          [ENavigation.SIGNUP]: "signup",
        },
      },
      [ENavigation.MAIN]: {
        screens: {
          [ETabNavigation.HOME]: "home",
          [ETabNavigation.STUDY]: "study",
          [ETabNavigation.PRACTICE]: "practice",
          [ETabNavigation.SETTINGS]: "settings",
        },
      },
      [ENavigation.MODAL]: "modal/:screen?",
      [ENavigation.NOT_FOUND]: "*",
    },
  },
};
```

### SettingsStackNavigator (на будущее)

```tsx
// stacks/SettingsStackNavigator.tsx
export const SettingsStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ENavigation.SETTINGS} component={SettingsScreen} />
    {/* <Stack.Screen name={ENavigation.NOTIFICATIONS} component={NotificationsScreen} /> */}
  </Stack.Navigator>
);
```

---

## Task Breakdown

### 🔴 Large

| ID | Task |
|----|------|
| NAV-L1 | Fix `linking.ts`: использовать `ETabNavigation`/`ENavigation` вместо строк; синхронизировать с реальными именами экранов; добавить все экраны |

### 🟡 Medium

| ID | Task |
|----|------|
| NAV-M1 | ~~**Auth flash fix**: добавить проверку `getIsInitialized` в `NavigationProvider`~~ ✅ Done — `SplashScreen` показывается пока `!isInitialized \|\| !animationDone`; в `__DEV__` скипается |
| NAV-M2 | Добавить `SettingsStackNavigator` — обернуть `SettingsScreen` в стек для будущих вложенных экранов |
| NAV-M3 | Удалить `routes.ts` или зарефакторить `linking.ts` чтобы использовал `ROUTE_PATHS`; единый источник правды для путей |

### 🟢 Small

| ID | Task |
|----|------|
| NAV-S1 | Fix `AnimatedIcon.translateY`: `inputRange: [0, 10]` → `[0, 1]` |
| NAV-S2 | Fix `makeUrl`: `"myapp://"` → `"klang://"`, обновить тест |
| NAV-S3 | Убрать мёртвые импорты в `BottomTabsNavigator` (`BlurMask`, `BounceInView`) |
| NAV-S4 | Заменить хардкод `"Practice Screen"` в `PracticeStackNavigator` на i18n |
| NAV-S5 | Убрать комментарий `"IS THIS SHOULD USE?"` из `useAppNavigation.ts` |
