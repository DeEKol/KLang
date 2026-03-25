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

### ✅ NAV-02 — Deeplink конфиг (`linking.ts`) — РЕШЕНО

`linking.ts` теперь использует `ETabNavigation`/`ENavigation` enum-значения. Deep links на табы работают корректно.

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

### ✅ NAV-04 — `makeUrl` использует `"klang://"` — РЕШЕНО

`makeUrl.ts` уже использует `klang://` как схему.

---

### ✅ NAV-05 — `SettingsStackNavigator` добавлен — РЕШЕНО

`SettingsStackNavigator` создан, `SettingsScreen` обёрнут в стек. Готово к расширению.

---

### ✅ NAV-06 — `AnimatedIcon.translateY` — РЕШЕНО

`inputRange: [0, 1]` — исправлено, анимация работает корректно.

---

### ✅ NAV-07 — Мёртвые импорты в `BottomTabsNavigator` — РЕШЕНО

Удалены. `BlurMask` и `BounceInView` больше не импортируются.

---

### ✅ NAV-08 — Хардкод в `PracticeStackNavigator` — РЕШЕНО

`headerShown: false`, хардкода нет.

---

### ✅ NAV-09 — Комментарий в `useAppNavigation.ts` — РЕШЕНО

Комментарий удалён. Файл чистый.

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

### SettingsStackNavigator ✅

`SettingsStackNavigator` уже создан и используется в `BottomTabsNavigator`.

---

## Task Breakdown

### 🔴 Large

| ID | Task |
|----|------|
| NAV-L1 | ~~Fix `linking.ts`: использовать `ETabNavigation`/`ENavigation` вместо строк~~ ✅ Done |
| NAV-L2 | ~~Добавить nested screen config в `linking.ts` для `Profile`, `Roadmap`, `Hangel` и других sub-screens~~ ✅ Done — все стеки раскрыты в `linking.ts`; `routes.ts` стал единым источником путей |

### 🟡 Medium

| ID | Task |
|----|------|
| NAV-M1 | ~~**Auth flash fix**: добавить проверку `getIsInitialized` в `NavigationProvider`~~ ✅ Done — `SplashScreen` показывается пока `!isInitialized \|\| !animationDone`; в `__DEV__` скипается |
| NAV-M2 | ~~Добавить `SettingsStackNavigator`~~ ✅ Done |
| NAV-M3 | ~~Удалить `routes.ts` или выровнять с `linking.ts`~~ ✅ Done — `linking.ts` теперь импортирует из `routes.ts`; `routes.ts` — единственный источник путей для всех экранов |

### 🟢 Small

| ID | Task |
|----|------|
| NAV-S1 | ~~Fix `AnimatedIcon.translateY`: `inputRange: [0, 10]` → `[0, 1]`~~ ✅ Done |
| NAV-S2 | ~~Fix `makeUrl`: `"myapp://"` → `"klang://"`~~ ✅ Done |
| NAV-S3 | ~~Убрать мёртвые импорты в `BottomTabsNavigator`~~ ✅ Done |
| NAV-S4 | ~~Заменить хардкод `"Practice Screen"` в `PracticeStackNavigator` на i18n~~ ✅ Done — `headerShown: false`, заголовка нет |
| NAV-S5 | ~~Убрать комментарий `"IS THIS SHOULD USE?"` из `useAppNavigation.ts`~~ ✅ Done |
