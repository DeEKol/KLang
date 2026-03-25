import { ENavigation } from "./types/navigation";

// Single source of truth for deep-link path segments.
// Used by both linking.ts (React Navigation config) and makeUrl() (URL construction).
// Paths are root-relative — React Navigation builds full URLs from nested screens without prefixes.
export const ROUTE_PATHS = {
  // Auth stack
  [ENavigation.LOGIN]: "login/:next?",
  [ENavigation.SIGNUP]: "signup",
  [ENavigation.FORGOT_PASSWORD]: "forgot",
  [ENavigation.EMAIL_CONFIRMATION]: "confirm-email",
  [ENavigation.SMS_CONFIRMATION]: "confirm-sms",
  // Home stack
  [ENavigation.HOME]: "home",
  [ENavigation.PROFILE]: "profile/:userId?",
  [ENavigation.ROADMAP]: "roadmap/:id?",
  // Study stack
  [ENavigation.STUDY]: "study",
  [ENavigation.LESSON]: "lesson",
  // Practice stack
  [ENavigation.PRACTICE]: "practice",
  [ENavigation.HANGEL]: "hangel",
  [ENavigation.WORD_MATCHER]: "word-matcher",
  [ENavigation.SEQUENCES_BUILDER]: "sequences",
  // Settings stack
  [ENavigation.SETTINGS]: "settings",
  // Test stack
  [ENavigation.TEST]: "test",
  [ENavigation.UI_SCREEN]: "ui",
  // Root
  [ENavigation.MODAL]: "modal/:screen?",
  [ENavigation.NOT_FOUND]: "*",
} as const;

export type RoutePaths = typeof ROUTE_PATHS;
