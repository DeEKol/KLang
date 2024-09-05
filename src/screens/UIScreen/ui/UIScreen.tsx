import React from "react";
import { useTranslation } from "react-i18next";
import type { ViewStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import CloseIcon from "assets/icons/CloseIcon.svg";
import { ButtonUI, EButtonUITheme } from "shared/ui";

export const UIScreen = () => {
  const { t } = useTranslation("uiScreen");

  return (
    <View>
      <Text>{t("This is UI screen")}</Text>
      <View style={styles.viewStyle}>
        <Text>{t("Buttons")}</Text>
        <ButtonUI
          title={t("Button UI")}
          outerViewStyle={styles.outerViewStyle}
        />
        <ButtonUI
          title={t("Button UI")}
          themeUI={EButtonUITheme.BACKGROUND}
          outerViewStyle={styles.outerViewStyle}
        />
        <ButtonUI
          title={t("Icon")}
          img={CloseIcon}
          themeUI={EButtonUITheme.CLEAR}
          outerViewStyle={styles.outerViewStyle}>
          <CloseIcon
            height={20}
            width={20}
            style={styles.btnChildrenStyle}
          />
        </ButtonUI>
      </View>
    </View>
  );
};

type TStyles = {
  viewStyle: ViewStyle;
  btnChildrenStyle: ViewStyle;
  outerViewStyle: ViewStyle;
};

const styles: TStyles = StyleSheet.create({
  viewStyle: {
    // backgroundColor: "green",
    // marginBottom: 5,
  },
  btnChildrenStyle: {
    marginRight: 6,
  },
  outerViewStyle: {
    marginBottom: 10,
  },
});
