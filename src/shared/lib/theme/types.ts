export type TThemeMode = "light" | "dark" | "system";

export interface IThemeColors {
  // Primary
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  // Backgrounds
  background: string;
  surface: string;
  surfaceVariant: string;
  // Text
  text: string; // onBackground
  onSurface: string;
  // Accent / semantic
  accent: string; // secondary
  error: string;
  // Utility
  border: string;
  disabled: string;
  placeholder: string;
  backdrop: string;
  notification: string;
}

export interface IThemeTypography {
  fontFamily?: string;
  fontSize: { sm: number; md: number; lg: number };
  fontWeight: { regular: number; medium: number; bold: number };
}

export interface IThemeSpacing {
  s: number;
  m: number;
  l: number;
  xl: number;
}

export interface IThemeTokens {
  mode: TThemeMode;
  colors: IThemeColors;
  typography: IThemeTypography;
  spacing: IThemeSpacing;
}
