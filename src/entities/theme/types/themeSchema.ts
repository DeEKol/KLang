import type { TThemeMode } from "shared/lib/theme/types";

export type {
  IThemeColors,
  IThemeSpacing,
  IThemeTokens,
  IThemeTypography,
  TThemeMode,
} from "shared/lib/theme/types";

export interface IThemeSchema {
  mode: TThemeMode;
}
