const lit = <V extends string>(v: V) => v;
void lit; // used only for type-narrowing constants

// Light palette — Korean-inspired (쪽빛 blue + 단청 coral)
export const EPalette = {
  PRIMARY: "#1A3A6B", // 쪽빛 (jjokbit) — traditional Korean blue
  PRIMARY_CONTAINER: "#D6E4FF",
  ON_PRIMARY: "#FFFFFF",
  ACCENT: "#E85D4A", // 단청 (dancheong) — red-coral
  ACCENT_CONTAINER: "#FFE0DC",
  BACKGROUND: "#F8F7F4", // warm white, not pure #FFF
  SURFACE: "#FFFFFF",
  SURFACE_VARIANT: "#F0EEE8",
  TEXT: "#1C1B1A",
  ON_SURFACE: "#1C1B1A",
  ERROR: "#B3261E",
  BORDER: "#D9D5CC",
  DISABLED: "#C4BFB5",
  PLACEHOLDER: "#9E9A92",
  BACKDROP: "rgba(0,0,0,0.5)",
  NOTIFICATION: "#E85D4A",
} as const;

// Dark palette
export const EDarkPalette = {
  PRIMARY: "#ADC8FF", // light blue on dark
  PRIMARY_CONTAINER: "#1A3A6B",
  ON_PRIMARY: "#002D6E",
  ACCENT: "#FFB3AC",
  ACCENT_CONTAINER: "#7D1D12",
  BACKGROUND: "#1C1B1A", // warm near-black
  SURFACE: "#2A2927",
  SURFACE_VARIANT: "#3A3835",
  TEXT: "#EAE6DF",
  ON_SURFACE: "#EAE6DF",
  ERROR: "#F2B8B5",
  BORDER: "#4A4640",
  DISABLED: "#5A5650",
  PLACEHOLDER: "#8A8680",
  BACKDROP: "rgba(0,0,0,0.7)",
  NOTIFICATION: "#FFB3AC",
} as const;

export type EPaletteKey = keyof typeof EPalette;
export type EPaletteValue = (typeof EPalette)[EPaletteKey] | (typeof EDarkPalette)[EPaletteKey];
