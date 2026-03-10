# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm start                  # Start Metro bundler
npm run android            # Run on Android
npm run ios                # Run on iOS

# Testing
npm test                   # Run all tests
npm test -- path/to/test   # Run a single test file
npm test -- --testNamePattern="test name"  # Run tests by name

# Linting
npm run lint               # ESLint

# iOS CocoaPods (when native dependencies change)
bundle exec pod install    # Install pods
npm run pod-clean          # Full pod reset (deintegrate + cache clean + rm)
```

## Architecture

This is a Korean language learning React Native app (iOS/Android) using **Feature-Sliced Design (FSD)**:

```
src/
├── app/         # Root App.tsx, providers (Redux, Navigation, Theme, UI)
├── entities/    # Domain models — auth, theme, counter, posts
├── features/    # Feature UI components — HangelBoard, SequencesBuilder, StepsSwiper, etc.
├── screens/     # Full-screen components mounted by the navigator
├── shared/      # Cross-cutting: config, helpers, API client, reusable UI
└── widgets/     # Complex composite components
```

**Import rules (enforced by ESLint):** Import only via a layer's public `index.ts`, never directly into `ui/`, `model/`, or `types/` subfolders of another layer.

**Path aliases** are configured in both `babel.config.js` (module resolver) and `tsconfig.json` (`*` → `./src/*`), so imports like `entities/auth` or `shared/ui` resolve without relative paths.

## State Management

Redux Toolkit with Redux Persist. Store schema defined in `src/app/providers/StoreProvider/types/stateSchema.ts`. Entity slices live in `entities/<name>/model/`. Theme state is persisted via AsyncStorage.

## Navigation

React Navigation v7 — Native Stack + Bottom Tabs. Navigation types (screen param lists) are in `src/shared/config/navigation/types/navigation.ts`. The hierarchy is: Auth stack → Main tabs (Home, Practice, Study, Test) with nested stacks per tab.

## Key Libraries

- **UI**: React Native Paper (Material Design), React Native Reanimated
- **Auth**: Firebase Auth + Google Sign-In
- **i18n**: i18next (Russian/Korean); use `t('key')` — ESLint enforces no hardcoded literal strings in JSX markup
- **Forms**: react-hook-form + Zod validation
- **TTS**: react-native-tts (Korean text-to-speech)

## Code Style

Prettier config: 100-char line width, double quotes, trailing commas, single JSX attribute per line. ESLint enforces: no inline styles, no color literals, type-only imports (`import type`), sorted imports (`simple-import-sort`).
