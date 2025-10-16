import { useColorScheme } from "react-native";
import type { TThemeMode } from "entities/theme";

/**
 * Normalize legacy value
 */
export function normalizeSetting(value: TThemeMode | undefined): string {
  if (!value) return "system";
  if (value === "normal") return "system";
  return value;
}

/**
 * Resolve final scheme 'light' | 'dark' from setting + system scheme (may be null)
 */
export function resolveColorSchemeFromSetting(
  setting: TThemeMode,
  systemScheme: TThemeMode | null,
): TThemeMode {
  const s = normalizeSetting(setting);
  if (s === "system") {
    return systemScheme === "dark" ? "dark" : "light";
  }
  return s === "dark" ? "dark" : "light";
}

/**
 * React hook: returns resolved 'light' | 'dark' based on setting + device preference
 */
export function useResolvedMode(setting: TThemeMode): TThemeMode {
  const system = useColorScheme(); // 'light' | 'dark' | null
  return resolveColorSchemeFromSetting(setting, system as TThemeMode | null);
}
