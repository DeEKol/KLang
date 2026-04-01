# 04 — Games

## Current Architecture

```
src/
├── modules/games/                    ← вне FSD (осознанное решение)
│   ├── _shared/                      ← общие абстракции ✅
│   │   ├── types.ts                  IGameProps<TConfig>, IGameResult
│   │   └── hooks/
│   │       └── useGameTimer.ts       таймер (elapsedMs, pause, resume, reset)
│   │
│   ├── WordMatcher/
│   │   ├── index.ts
│   │   ├── entities/types.ts
│   │   ├── model/
│   │   │   ├── logic/useWordMatcher.ts    логика + mistakeCount
│   │   │   └── animation/
│   │   └── ui/
│   │       └── GameLayout.tsx        onComplete?: (result: IGameResult) => void
│   │
│   ├── HangelBoard/                  ← перенесено из features/ ✅
│   │   ├── index.ts
│   │   ├── model/useHangelBoard.ts   логика (strokes, undo/redo)
│   │   └── ui/HangelBoard.tsx        onExit?: () => void
│   │
│   └── SequencesBuilder/             ← перенесено из features/ ✅
│       ├── index.ts
│       ├── entities/types.ts
│       ├── locales/en.json, ru.json
│       ├── model/useSequencesBuilder.ts  логика + mistakeCount
│       └── ui/
│           ├── SequencesBuilderUI.tsx    onComplete?: (result: IGameResult) => void
│           ├── Blank.tsx
│           ├── DraggableWord.tsx
│           ├── OptionsRow.tsx
│           └── VictoryOverlay.tsx
│
└── screens/PracticeScreen/
    ├── PracticeScreen.tsx            список игр (FlatList с навигацией)
    ├── models/practicesModel.ts      конфигурация навигации на игры
    └── subscreens/
        ├── WordMatcherScreen.tsx     передаёт onComplete (TODO: Redux)
        ├── HangelScreen.tsx          передаёт onExit → navigation.goBack()
        └── SequencesBuilderScreen.tsx передаёт onComplete (TODO: Redux)
```

**Общий контракт игр (`_shared/types.ts`):**
```ts
interface IGameResult {
  score: number;    // 0..1 (доля правильных ответов)
  timeMs: number;   // время прохождения в мс
  mistakes: number;
}

interface IGameProps<TConfig = unknown> {
  config: TConfig;
  onComplete: (result: IGameResult) => void;
  onExit?: () => void;
}
```

> **Примечание**: `IGameProps` определён в `_shared/types.ts`, но игры ещё не используют его как базовый тип — `onComplete`/`onExit` добавлены напрямую в пропсы каждой игры. Полное выравнивание под `IGameProps<TConfig>` — следующий шаг (GAME-M4 полная).

**Технологии:**
- **WordMatcher**: Animated API, LinearGradient, Lottie, TTS
- **HangelBoard**: React Native Skia (Canvas), PanResponder, Reanimated Slider
- **SequencesBuilder**: React Native Gesture Handler (pan), Reanimated (snap, spring), Worklets

---

## Problems

### ✅ GAME-01 — HangelBoard и SequencesBuilder находятся в `features/`

**Решено**: оба перенесены в `modules/games/`, логика вынесена в хуки (`useHangelBoard`, `useSequencesBuilder`). Старые `features/HangelBoard/` и `features/SequencesBuilder/` удалены. Consumers обновлены.

---

### 🟡 GAME-02 — Данные игр хардкодированы прямо в Screen-обёртках

```tsx
// WordMatcherScreen.tsx
<GameLayout
  words={[
    { nativeWord: "Cat", learnWord: "고양이" },
    { nativeWord: "Dog", learnWord: "개" },
    // ...
  ]}
/>
```

```tsx
// SequencesBuilderScreen.tsx
<SequencesBuilderUI
  words={["나는", "학교에", "갑니다"]}
/>
```

Данные должны приходить из Redux/API (уроки, прогресс пользователя). Сейчас игры не связаны с реальным контентом приложения.

---

### 🟡 GAME-03 — Хардкодированные цвета в играх, тема не применяется

**SequencesBuilderUI.tsx** — жёстко зашитые цвета тёмной темы:
```ts
// Примеры из SequencesBuilderUI
backgroundColor: '#1a1a2e'   // тёмный фон
color: '#ffffff'              // белый текст
borderColor: '#4CAF50'        // зелёный успех
backgroundColor: '#FF5252'    // красный ошибка
```

**WordMatcher/ui/Column.tsx** — LinearGradient с хардкод цветами.

**HangelBoard.tsx** — Canvas Skia использует захардкоженные цвета для направляющих линий и обводки.

Игры не получают цвета из токен-системы → в light mode выглядят неправильно, dark mode не переключается.

---

### ✅ GAME-04 — Нет общего интерфейса для всех игр

**Решено**: создан `modules/games/_shared/types.ts` (`IGameResult`, `IGameProps`) и `_shared/hooks/useGameTimer.ts`. Все три игры принимают `onComplete?: (result: IGameResult) => void`; `HangelBoard` принимает `onExit?: () => void`. Screen-обёртки передают колбэки (сейчас `console.log` + TODO для Redux — GAME-S4).

---

### 🟢 GAME-05 — `SequencesBuilderUI_old.tsx` — мёртвый код

Файл не удалён после рефакторинга. 200+ строк старой реализации.

---

### 🟢 GAME-06 — Нет сохранения прогресса в играх

Каждый запуск игры начинается с нуля. Нет связи с `UserProgress` (который уже есть в бэкенд-схеме: `user-progress.entity.ts`). Когда данные будут приходить с API, прогресс должен сохраняться.

---

### 🟢 GAME-07 — `Winning.tsx` — закомментированный код

```tsx
// Winning.tsx
// <AnimatedIcon ... />  ← всё закомментировано
```

Только текст "All Matched! 🎉" без анимации. Либо доделать, либо убрать компонент и показывать состояние в `Dialog.tsx`.

---

### 🟢 GAME-08 — `practicesModel.ts` — title без i18n

```ts
// practicesModel.ts
{ key: "hangel", title: "Hangel Board", ... }
```

Строки не обёрнуты в `t('...')`, хотя проект использует i18n.

---

## Best Practices

### Модульная архитектура игр (WordMatcher — хороший пример) ✅

WordMatcher правильно структурирован:
- `entities/` — чистые типы данных
- `model/logic/` — вся игровая логика в хуке (`useWordMatcher`)
- `model/animation/` — анимации вынесены в отдельные хуки
- `ui/` — только рендеринг, без логики

Эту структуру нужно применить к HangelBoard и SequencesBuilder.

### Separation: логика ↔ анимации ↔ рендеринг ✅

`useWordMatcher` не знает про анимации.
`useColumnAnimations`, `useFadeScale` — изолированы.
`Column.tsx` использует оба через хуки.

### Игра как "чёрный ящик"

Игра должна принимать данные через props и возвращать результат через callback. Никакой прямой работы с Redux внутри игры — это ответственность Screen-обёртки.

---

## Proposed Architecture

### Структура `modules/games/` (целевая)

```
modules/games/
├── _shared/                          ← общие абстракции для всех игр
│   ├── types.ts                      IGameProps, IGameResult, IGameConfig
│   └── hooks/
│       └── useGameTimer.ts           таймер для всех игр
│
├── WordMatcher/                      ← уже готов, небольшие правки
│   ├── index.ts
│   ├── entities/types.ts
│   ├── model/logic/useWordMatcher.ts
│   ├── model/animation/
│   └── ui/GameLayout.tsx
│
├── HangelBoard/                      ← перенести из features/
│   ├── index.ts
│   ├── model/
│   │   └── useHangelBoard.ts         логика (undo, strokes) выносим из компонента
│   └── ui/
│       └── HangelBoard.tsx
│
└── SequencesBuilder/                 ← перенести из features/
    ├── index.ts
    ├── entities/types.ts
    ├── model/
    │   └── useSequencesBuilder.ts    логика выносим из компонента
    └── ui/
        ├── SequencesBuilderUI.tsx
        ├── SentenceParts.tsx
        ├── Blank.tsx
        └── DraggableWordUI.tsx
```

### PracticeScreen → data-driven

```ts
// screens/PracticeScreen/models/practicesModel.ts
interface IPracticeItem {
  key: string;
  titleKey: string;     // i18n ключ
  screen: ENavigation;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}
```

### Связь игр со словарём и прогрессом (будущее, второстепенно)

Игры должны быть связаны с тремя сущностями:
- **Слова** — контент для игры (пары слов, предложения)
- **Прогресс** — сохранение результатов (`user-progress` таблица на бэкенде уже есть)
- **Статистика** — история сессий, точность, время

Конкретная модель связи (урок → игра или отдельный словарь) определяется позже.
Сейчас задача — сделать игры готовыми к приёму данных через props (`IGameProps.config`),
а Screen-обёртки — ответственными за получение данных из Redux/API.

```
(будущее)
Redux / API
  └── words / lessons
        └── WordMatcherScreen
              → <GameLayout config={words} onComplete={saveProgress} />
              → dispatch / POST /user-progress
```

---

## Task Breakdown

### 🟡 Medium

| ID | Task |
|----|------|
| ~~GAME-M1~~ | ✅ Перенести `HangelBoard` из `features/` в `modules/games/HangelBoard/`; вынести логику в `useHangelBoard.ts` |
| ~~GAME-M2~~ | ✅ Перенести `SequencesBuilder` из `features/` в `modules/games/SequencesBuilder/`; вынести логику в `useSequencesBuilder.ts` |
| GAME-M3 | Применить тему (token colors) во всех играх: убрать хардкод цветов, передавать `colors: IThemeColors` через props или `useThemeTokens` |
| ~~GAME-M4~~ | ✅ Создать `_shared/types.ts` (`IGameProps`, `IGameResult`) и `_shared/hooks/useGameTimer.ts`; подключить `onComplete`/`onExit` во все игры |

### 🟢 Small

| ID | Task |
|----|------|
| ~~GAME-S1~~ | ✅ Удалить `SequencesBuilderUI_old.tsx` |
| GAME-S2 | Добавить i18n ключи в `practicesModel.ts` (убрать хардкод строк) |
| GAME-S3 | Доделать или удалить `Winning.tsx` — сейчас пустой компонент |
| GAME-S4 | Подключить результаты игр к Redux / navigate to results (сейчас `console.log` в Screen-обёртках) |
