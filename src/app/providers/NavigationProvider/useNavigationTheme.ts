import { useMemo } from "react";
import { adaptNavigationTheme } from "react-native-paper";
import { DarkTheme as RNDark, DefaultTheme as RNDefault } from "@react-navigation/native";
import deepmerge from "deepmerge";
import { mapTokensToMD3, useThemeTokens } from "shared/lib/theme";

export function useNavigationTheme() {
  // adapt nav base themes to MD3 shape
  const adapted = adaptNavigationTheme({
    reactNavigationLight: RNDefault,
    reactNavigationDark: RNDark,
  });
  const AdaptedNavLight = adapted.LightTheme ?? RNDefault;
  const AdaptedNavDark = adapted.DarkTheme ?? RNDark;

  // ? Theme: get tokens and build navTheme from md3 colors
  const tokens = useThemeTokens();
  const md3 = useMemo(() => mapTokensToMD3(tokens), [tokens]);

  const navTheme = useMemo(() => {
    const base = tokens.mode === "dark" ? AdaptedNavDark : AdaptedNavLight;
    const merged = deepmerge(base, { colors: md3.colors });

    return { ...merged, dark: tokens.mode === "dark" };
  }, [tokens.mode, md3.colors]);

  return { theme: navTheme };
}
