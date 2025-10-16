import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import type { IThemeTokens } from "entities/theme";

/**
 * Map our ThemeTokens -> MD3-like theme for react-native-paper.
 * We only overwrite colors that matter.
 */
export function mapTokensToMD3(tokens: IThemeTokens) {
  const isDark = tokens.mode === "dark";
  const base = isDark ? MD3DarkTheme : MD3LightTheme;

  const colors = {
    ...base.colors,
    // TODO: set up theme
    // primary: tokens.colors.primary,
    // background: tokens.colors.background,
    // surface: tokens.colors.surface,
    // onSurface: tokens.colors.text,
    // text: tokens.colors.text,
    // accent: tokens.colors.accent, // ! tertiary ??
    // error: tokens.colors.error ?? base.colors?.error,
  };

  return {
    ...base,
    colors,
    // optionally attach custom tokens so components can read them from theme.custom if wanted
    // custom: { spacing: tokens.spacing, typography: tokens.typography },
  };
}
