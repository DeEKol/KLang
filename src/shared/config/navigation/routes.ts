// src/shared/navigation/routes.ts
export enum ENavigation {
  AUTH = "Auth",
  MAIN = "Main",
  MODAL = "Modal",
  NOT_FOUND = "NotFound",
  LOGIN = "Login",
  SIGNUP = "Signup",
  FORGOT_PASSWORD = "ForgotPassword",
  EMAIL_CONFIRMATION = "EmailConfirmation",
  SMS_CONFIRMATION = "SMSConfirmation",
  TEST = "Test",
  HOME = "Home",
  PROFILE = "Profile",
  ROADMAP = "Roadmap",
}

// single source of truth for linking paths
export const ROUTE_PATHS = {
  [ENavigation.MAIN]: "app",
  [ENavigation.AUTH]: "auth",
  // auth children
  [ENavigation.LOGIN]: "auth/login/:next?", // optional path param 'next'
  [ENavigation.SIGNUP]: "auth/signup",
  [ENavigation.FORGOT_PASSWORD]: "auth/forgot",
  [ENavigation.EMAIL_CONFIRMATION]: "auth/confirm-email",
  [ENavigation.SMS_CONFIRMATION]: "auth/confirm-sms",
  // main / tabs
  [ENavigation.HOME]: "home",
  [ENavigation.PROFILE]: "profile/:userId?", // optional numeric id (we'll parse)
  [ENavigation.ROADMAP]: "roadmap/:id?", // example of resource with optional id
  [ENavigation.NOT_FOUND]: "*",
} as const;

export type RoutePaths = typeof ROUTE_PATHS;
