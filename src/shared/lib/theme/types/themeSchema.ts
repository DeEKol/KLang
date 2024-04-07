import type { ColorSchemeName } from "react-native";

export type TThemeColors = ColorSchemeName | "normal";

export interface IThemeSchema {
  color: TThemeColors;
}
