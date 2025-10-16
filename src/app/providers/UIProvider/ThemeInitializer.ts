import type React from "react";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { themeActions } from "entities/theme";

import { useAppDispatch } from "../StoreProvider";

export const ThemeInitializer: React.FC = () => {
  // ? Redux
  const dispatch = useAppDispatch();

  // ? Hooks
  const scheme = useColorScheme() ?? "light";

  // ? Lifecycle
  useEffect(() => {
    dispatch(themeActions.changeTheme(scheme));
  }, [scheme, dispatch]);

  return null;
};
