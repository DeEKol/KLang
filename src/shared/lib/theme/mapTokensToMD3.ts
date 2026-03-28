import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import type { IThemeTokens } from "shared/lib/theme/types";

/**
 * Map our ThemeTokens → MD3 theme for react-native-paper.
 *
 * MD3 field names (from Paper docs):
 *   primary, onPrimary, primaryContainer, secondary, tertiary,
 *   background, surface, surfaceVariant, onSurface, onBackground,
 *   error, outline, backdrop, etc.
 */
export function mapTokensToMD3(tokens: IThemeTokens) {
  const isDark = tokens.mode === "dark";
  const base = isDark ? MD3DarkTheme : MD3LightTheme;
  const c = tokens.colors;

  return {
    ...base,
    dark: isDark,
    colors: {
      ...base.colors,
      primary: c.primary,
      onPrimary: c.onPrimary,
      primaryContainer: c.primaryContainer,
      secondary: c.accent, // MD3: "secondary" not "accent"
      background: c.background,
      surface: c.surface,
      surfaceVariant: c.surfaceVariant,
      onSurface: c.onSurface,
      onBackground: c.text, // MD3: "onBackground" not "text"
      error: c.error,
      outline: c.border, // MD3: "outline" not "border"
      backdrop: c.backdrop,
    },
  };
}
