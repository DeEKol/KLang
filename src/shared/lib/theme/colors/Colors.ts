import type { TThemeMode } from "entities/theme";

import type { EPaletteValue } from "./Palette";
import { EDarkPalette, EPalette } from "./Palette";

type TTheme = NonNullable<TThemeMode>;

/**
 * Здесь перечислены поля, которые ты реально используешь в коде.
 * Добавь/удали поля по потребности, но держи `text`/`btnText` — они уже используются.
 */
interface ColorsType {
  // старые поля, чтобы совместимость была сохранена:
  text: EPaletteValue;
  btnText: EPaletteValue;

  // расширенные поля (полный набор из твоего примера)
  primary: EPaletteValue;
  accent: EPaletteValue;
  background: EPaletteValue;
  surface: EPaletteValue;
  disabled: EPaletteValue;
  placeholder: EPaletteValue;
  backdrop: EPaletteValue;
  notification: EPaletteValue;
  onSurface: EPaletteValue;
}

export type TColors = {
  [key in TTheme]: ColorsType;
};

export const Colors: TColors = {
  dark: {
    text: EDarkPalette.TEXT,
    btnText: EDarkPalette.PRIMARY,
    primary: EDarkPalette.PRIMARY,
    accent: EDarkPalette.ACCENT,
    background: EDarkPalette.BACKGROUND,
    surface: EDarkPalette.SURFACE,
    disabled: EDarkPalette.DISABLED,
    placeholder: EDarkPalette.PLACEHOLDER,
    backdrop: EDarkPalette.BACKDROP,
    notification: EDarkPalette.NOTIFICATION,
    onSurface: EDarkPalette.ONSURFACE,
  },
  light: {
    text: EPalette.TEXT,
    btnText: EPalette.PRIMARY,
    primary: EPalette.PRIMARY,
    accent: EPalette.ACCENT,
    background: EPalette.BACKGROUND,
    surface: EPalette.SURFACE,
    disabled: EPalette.DISABLED,
    placeholder: EPalette.PLACEHOLDER,
    backdrop: EPalette.BACKDROP,
    notification: EPalette.NOTIFICATION,
    onSurface: EPalette.ONSURFACE,
  },
  normal: {
    text: EPalette.TEXT,
    btnText: EPalette.PRIMARY,
    primary: EPalette.PRIMARY,
    accent: EPalette.ACCENT,
    background: EPalette.BACKGROUND,
    surface: EPalette.SURFACE,
    disabled: EPalette.DISABLED,
    placeholder: EPalette.PLACEHOLDER,
    backdrop: EPalette.BACKDROP,
    notification: EPalette.NOTIFICATION,
    onSurface: EPalette.ONSURFACE,
  },
};
