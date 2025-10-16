import type { FC, ReactNode } from "react";
import React from "react";
import type { ButtonProps, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";
import type { SvgProps } from "react-native-svg";
import { useSelector } from "react-redux";
import { getThemeMode, type TThemeMode } from "entities/theme";

import ButtonUIStyles from "./ButtonUI.styles";
import { EButtonUITheme } from "./types";

type TButtonUIProps = ButtonProps & {
  children?: ReactNode;
  img?: FC<SvgProps>;
  themeUI?: EButtonUITheme;
  outerTitleStyle?: ViewStyle;
  outerViewStyle?: ViewStyle;
  btnOuterChildrenStyle?: ViewStyle;
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

  const themeGlobal: TThemeMode = useSelector(getThemeMode);

  const styles = ButtonUIStyles(themeUI, themeGlobal);

  return (
    <View style={[styles.viewStyle, outerViewStyle]}>
      <Pressable
        style={[styles.globalBtnStyle, styles.uiStyle]}
        {...anyProps}>
        {children}
        <Text style={[styles.globalTitleStyle, outerTitleStyle]}>{title}</Text>
      </Pressable>
    </View>
  );
};
