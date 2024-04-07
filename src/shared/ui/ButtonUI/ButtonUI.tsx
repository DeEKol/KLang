import type { FC, ReactNode } from "react";
import React from "react";
import type { ButtonProps, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";
import type { SvgProps } from "react-native-svg";
import { useSelector } from "react-redux";
import { getThemeColor } from "shared/lib/theme/model/selectors/getThemeColor/getThemeColor";
import type { TThemeColors } from "shared/lib/theme/types/themeSchema";

import ButtonUIStyles from "./ButtonUI.styles";
import { EButtonUITheme } from "./types";

type TButtonUIProps = ButtonProps & {
  children: ReactNode;
  img?: FC<SvgProps>;
  themeUI?: EButtonUITheme;
  outerTitleStyle?: ViewStyle;
  outerViewStyle?: ViewStyle;
};

export const ButtonUI = (props: TButtonUIProps) => {
  const {
    children,
    img,
    title,
    themeUI = EButtonUITheme.DEFAULT,
    outerViewStyle,
    outerTitleStyle,
    ...anyProps
  } = props;

  const themeGlobal: TThemeColors = useSelector(getThemeColor);

  const styles = ButtonUIStyles(themeUI, themeGlobal);

  return (
    <View style={outerViewStyle}>
      <Pressable
        style={styles.globalBtnStyle}
        {...anyProps}>
        {children}
        <Text style={[styles.globalTitleStyle, styles.uiStyle, outerTitleStyle]}>{title}</Text>
      </Pressable>
    </View>
  );
};
