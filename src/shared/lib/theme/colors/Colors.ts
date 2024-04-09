import type { TThemeColors } from "../../theme";

type TTheme = NonNullable<TThemeColors>;

const lit = <V extends string>(v: V) => v;

const EPalette = {
  RED: lit("#ff0000"),
  GREEN: lit("#008000"),
  YELLOW: lit("#ffff00"),
  BLUE: lit("#0000ff"),
  BLUE_OPACITY: lit("rgba(0, 0, 255, 0.3)"),
};

type EPaletteKeys = (typeof EPalette)[keyof typeof EPalette];

interface ColorsType {
  text: EPaletteKeys;
  btnText: EPaletteKeys;
}

type TColors = {
  [key in TTheme]: ColorsType;
};

export const Colors: TColors = {
  dark: {
    text: EPalette.RED,
    btnText: EPalette.RED,
  },
  light: {
    text: EPalette.RED,
    btnText: EPalette.RED,
  },
  normal: {
    text: EPalette.RED,
    btnText: EPalette.RED,
  },
};
