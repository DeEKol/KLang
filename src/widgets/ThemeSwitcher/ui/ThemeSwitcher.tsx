import React from "react";
import { useTranslation } from "react-i18next";
import type { TextStyle } from "react-native";
import { Button, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { TThemeColors } from "shared/lib/theme";
import { Colors, getThemeColor, themeActions } from "shared/lib/theme";

export const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const theme: TThemeColors = useSelector(getThemeColor);
  const dispatch = useDispatch();

  const themeHandler = (color: TThemeColors) => {
    dispatch(themeActions.changeTheme(color));
  };

  const styles = createStyles(theme);

  const themeLang = theme != null && true ? theme : "default";
  // const themeLang: string = theme ?? theme;

  return (
    <View>
      <Text style={styles.textStyle}>
        {t("Theme")}: {t(themeLang)}
      </Text>
      <Button
        title={t("Change theme dark")}
        onPress={() => themeHandler("dark")}
      />
      <Button
        title={t("Change theme light")}
        onPress={() => themeHandler("light")}
      />
    </View>
  );
};

type TThemeSwitcherStyle = {
  textStyle: TextStyle;
};

const createStyles = (theme: TThemeColors) => {
  const styles = StyleSheet.create<TThemeSwitcherStyle>({
    textStyle: {
      color: Colors[theme ?? "light"]?.text,
    },
  });
  return styles;
};
