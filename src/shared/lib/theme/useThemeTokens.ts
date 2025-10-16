import React from "react";
import { useSelector } from "react-redux";
import { getThemeMode, type TThemeMode } from "entities/theme";

import { createTheme } from "./tokens";
import { useResolvedMode } from "./utils";

/**
 * NOTE: getThemeMode selector must accept full Redux state
 * and return the modeSetting (e.g. 'dark'|'light'|'system'|'normal').
 *
 * We memoize createTheme by resolvedMode only.
 */
export function useThemeTokens() {
  // modeSetting: could be 'light'|'dark'|'system'|'normal'
  const modeSetting = useSelector(getThemeMode) as TThemeMode;
  const resolvedMode = useResolvedMode(modeSetting);
  const tokens = React.useMemo(() => createTheme(resolvedMode), [resolvedMode]);
  return tokens;
}
