import type { TThemeMode } from "shared/lib/theme/types";

import { EDarkPalette, EPalette } from "./Palette";

// "system" resolves at render time via useResolvedMode — always "light" | "dark" at runtime.
// "system" key exists here only for TypeScript compatibility with style functions that accept TThemeMode.
type TTheme = TThemeMode;

interface ColorsType {
  text: string;
  btnText: string;
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  accent: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  onSurface: string;
  disabled: string;
  placeholder: string;
  backdrop: string;
  notification: string;
}

export type TColors = {
  [key in TTheme]: ColorsType;
};

export const Colors: TColors = {
  light: {
    text: EPalette.TEXT,
    btnText: EPalette.ON_PRIMARY,
    primary: EPalette.PRIMARY,
    onPrimary: EPalette.ON_PRIMARY,
    primaryContainer: EPalette.PRIMARY_CONTAINER,
    accent: EPalette.ACCENT,
    background: EPalette.BACKGROUND,
    surface: EPalette.SURFACE,
    surfaceVariant: EPalette.SURFACE_VARIANT,
    onSurface: EPalette.ON_SURFACE,
    disabled: EPalette.DISABLED,
    placeholder: EPalette.PLACEHOLDER,
    backdrop: EPalette.BACKDROP,
    notification: EPalette.NOTIFICATION,
  },
  dark: {
    text: EDarkPalette.TEXT,
    btnText: EDarkPalette.ON_PRIMARY,
    primary: EDarkPalette.PRIMARY,
    onPrimary: EDarkPalette.ON_PRIMARY,
    primaryContainer: EDarkPalette.PRIMARY_CONTAINER,
    accent: EDarkPalette.ACCENT,
    background: EDarkPalette.BACKGROUND,
    surface: EDarkPalette.SURFACE,
    surfaceVariant: EDarkPalette.SURFACE_VARIANT,
    onSurface: EDarkPalette.ON_SURFACE,
    disabled: EDarkPalette.DISABLED,
    placeholder: EDarkPalette.PLACEHOLDER,
    backdrop: EDarkPalette.BACKDROP,
    notification: EDarkPalette.NOTIFICATION,
  },
  // "system" is a light-palette fallback — never accessed at runtime (always resolved to "light" | "dark").
  // Kept for TypeScript compatibility until THEME-M2 refactors all style functions to accept IThemeColors.
  system: {
    text: EPalette.TEXT,
    btnText: EPalette.ON_PRIMARY,
    primary: EPalette.PRIMARY,
    onPrimary: EPalette.ON_PRIMARY,
    primaryContainer: EPalette.PRIMARY_CONTAINER,
    accent: EPalette.ACCENT,
    background: EPalette.BACKGROUND,
    surface: EPalette.SURFACE,
    surfaceVariant: EPalette.SURFACE_VARIANT,
    onSurface: EPalette.ON_SURFACE,
    disabled: EPalette.DISABLED,
    placeholder: EPalette.PLACEHOLDER,
    backdrop: EPalette.BACKDROP,
    notification: EPalette.NOTIFICATION,
  },
};
