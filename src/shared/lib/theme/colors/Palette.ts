const lit = <V extends string>(v: V) => v;

// const EPalette = {
//   RED: lit("#ff0000"),
//   GREEN: lit("#008000"),
//   YELLOW: lit("#ffff00"),
//   BLUE: lit("#0000ff"),
//   BLUE_OPACITY: lit("rgba(0, 0, 255, 0.3)"),
// };

// type EPaletteKeys = (typeof EPalette)[keyof typeof EPalette];

export const EPalette = {
  PRIMARY: "#0047AB",
  ACCENT: "#FF6B6B",
  BACKGROUND: "#FFFFFF",
  SURFACE: "#FFFFFF",
  TEXT: "#1A1A1A",
  DISABLED: "#E5E5E5",
  PLACEHOLDER: "#8E8E93",
  BACKDROP: "rgba(0,0,0,0.5)",
  NOTIFICATION: "#FF6B6B",
  ONSURFACE: "#1A1A1A",
} as const;

export const EDarkPalette = {
  PRIMARY: "#FFFFFF",
  ACCENT: "#FF6B6B",
  BACKGROUND: "#000000",
  SURFACE: "#000000",
  TEXT: "#FFFFFF",
  DISABLED: "#999999",
  PLACEHOLDER: "#666666",
  BACKDROP: "rgba(255,255,255,0.5)",
  NOTIFICATION: "#FF6B6B",
  ONSURFACE: "#FFFFFF",
} as const;

export type EPaletteKey = keyof typeof EPalette;
export type EPaletteValue = (typeof EPalette)[EPaletteKey] | (typeof EDarkPalette)[EPaletteKey];
