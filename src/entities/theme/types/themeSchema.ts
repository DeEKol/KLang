import type { ColorSchemeName } from "react-native";

export type TThemeMode = ColorSchemeName | "normal";

export interface IThemeSchema {
  mode: TThemeMode;
}

export interface IThemeColors {
  background: string;
  surface: string;
  text: string;
  primary: string;
  accent?: string;
  error?: string;
  border?: string;
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
