import type React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getThemeMode, themeActions } from "entities/theme";
import { normalizeSetting } from "shared/lib/theme/utils";

import { useAppDispatch } from "../StoreProvider";

// Migrations: handles old Redux Persist snapshots (null, "normal") that are no longer valid TThemeMode values.
// useResolvedMode() in useThemeTokens() already subscribes to useColorScheme() directly,
// so no dispatch is needed for the "system" case — theme updates happen reactively.
export const ThemeInitializer: React.FC = () => {
  const dispatch = useAppDispatch();
  const savedMode = useSelector(getThemeMode);

  useEffect(() => {
    const normalized = normalizeSetting(savedMode);
    if (normalized !== savedMode) {
      dispatch(themeActions.changeTheme(normalized));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
