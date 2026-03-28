import type { IThemeTokens, TThemeMode } from "shared/lib/theme/types";

import { Colors } from "./colors/Colors";
import { EDarkPalette, EPalette } from "./colors/Palette";

const baseTypography = {
  fontFamily: "System",
  fontSize: { sm: 12, md: 16, lg: 20 },
  fontWeight: { regular: 400, medium: 500, bold: 700 },
};

const baseSpacing = { s: 4, m: 8, l: 16, xl: 24 };

export function createTheme(mode: TThemeMode): IThemeTokens {
  const colorKey = mode === "dark" ? "dark" : "light";
  const c = Colors[colorKey];
  const p = mode === "dark" ? EDarkPalette : EPalette;

  return {
    mode,
    colors: {
      primary: c.primary,
      onPrimary: c.onPrimary,
      primaryContainer: c.primaryContainer,
      background: c.background,
      surface: c.surface,
      surfaceVariant: c.surfaceVariant,
      text: c.text,
      onSurface: c.onSurface,
      accent: c.accent,
      error: p.ERROR,
      border: p.BORDER,
      disabled: c.disabled,
      placeholder: c.placeholder,
      backdrop: c.backdrop,
      notification: c.notification,
    },
    typography: baseTypography,
    spacing: baseSpacing,
  };
}
