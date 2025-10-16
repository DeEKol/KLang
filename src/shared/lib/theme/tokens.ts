import type { IThemeTokens, TThemeMode } from "entities/theme";

import { Colors, type TColors } from "./colors/Colors";

const baseTypography = {
  fontFamily: "System",
  fontSize: { sm: 12, md: 16, lg: 20 },
  fontWeight: { regular: 400, medium: 500, bold: 700 },
};

const baseSpacing = { s: 4, m: 8, l: 16, xl: 24 };

export function createTheme(mode: TThemeMode): IThemeTokens {
  const colorKey = mode === "dark" ? "dark" : "light";
  const c = (Colors as TColors)[colorKey];

  return {
    mode,
    colors: {
      background: c.background,
      surface: c.surface,
      text: c.text,
      primary: c.primary,
      accent: c.accent,
      error: "#D32F2F",
      border: "#E0E0E0",
      disabled: c.disabled,
      placeholder: c.placeholder,
      notification: c.notification,
      onSurface: c.onSurface,
      backdrop: c.backdrop,
    },
    typography: baseTypography,
    spacing: baseSpacing,
  } as IThemeTokens;
}
