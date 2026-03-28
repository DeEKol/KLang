import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native";

/**
 ** Touchable - обертка для TouchableOpacity с темой
 */
export const Touchable = (props: {
  onPress: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  // ? Props
  const { onPress, children, style, disabled } = props;

  // ? Render
  return (
    <TouchableOpacity
      disabled={disabled}
      style={style}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};
