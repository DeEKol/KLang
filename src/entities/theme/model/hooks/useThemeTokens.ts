import React from "react";
import { useSelector } from "react-redux";
import { createTheme } from "shared/lib/theme/tokens";
import { useResolvedMode } from "shared/lib/theme/utils";

import { getThemeMode } from "../selectors/getThemeMode/getThemeMode";

/**
 * Returns resolved IThemeTokens. Automatically re-renders when system color scheme changes.
 * tokens.mode is always "light" | "dark" (never "system").
 */
export function useThemeTokens() {
  const modeSetting = useSelector(getThemeMode);
  const resolvedMode = useResolvedMode(modeSetting);
  return React.useMemo(() => createTheme(resolvedMode), [resolvedMode]);
}
