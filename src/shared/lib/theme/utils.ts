import { useColorScheme } from "react-native";
import type { TThemeMode } from "shared/lib/theme/types";

/**
 * Normalize persisted/unknown values to a valid TThemeMode.
 * Handles legacy null/"normal" values from old Redux Persist snapshots.
 */
export function normalizeSetting(value: TThemeMode | null | undefined): TThemeMode {
  if (value === "dark") return "dark";
  if (value === "light") return "light";
  return "system"; // null, undefined, "normal", or any unknown value
}

/**
 * Resolve final scheme 'light' | 'dark' from setting + system scheme.
 */
export function resolveColorSchemeFromSetting(
  setting: TThemeMode | null | undefined,
  systemScheme: "light" | "dark" | null,
): "light" | "dark" {
  const s = normalizeSetting(setting);
  if (s === "system") {
    return systemScheme === "dark" ? "dark" : "light";
  }
  return s;
}

/**
 * React hook: returns resolved 'light' | 'dark' based on setting + device preference.
 * Automatically re-renders when the system color scheme changes.
 */
export function useResolvedMode(setting: TThemeMode): "light" | "dark" {
  const system = useColorScheme() as "light" | "dark" | null;
  return resolveColorSchemeFromSetting(setting, system);
}
