import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ViewStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import CloseIcon from "assets/icons/CloseIcon.svg";
import { ButtonUI, EButtonUITheme } from "shared/ui/atoms";

export const ThirdScreen = () => {
  const { t } = useTranslation("thirdScreen");

  const [notice, setNotice] = useState(false);

  const onNotice = () => {
    setNotice(true);
    setTimeout(() => {
      setNotice(false);
    }, 1000);
  };

  return (
    <View>
      <Text>{t("This is third screen")}</Text>
      <ButtonUI
        title={"sas"}
        img={CloseIcon}
        themeUI={EButtonUITheme.CLEAR}
        onPress={onNotice}
        outerTitleStyle={styles.btnOuterTitleStyle}
        outerViewStyle={styles.btnOuterViewStyle}>
        <CloseIcon
          height={20}
          width={20}
        />
      </ButtonUI>
      {/*<ButtonUI*/}
      {/*  title={"sas"}*/}
      {/*  img={CloseIcon}*/}
      {/*  themeUI={EButtonUITheme.CLEAR}*/}
      {/*  onPress={onNotice}*/}
      {/*  outerTitleStyle={styles.btnOuterTitleStyle}*/}
      {/*  outerViewStyle={styles.btnOuterViewStyle}>*/}
      {/*  <CloseIcon*/}
      {/*    height={20}*/}
      {/*    width={20}*/}
      {/*  />*/}
      {/*</ButtonUI>*/}
      {notice && <Text>{t("Notice")}</Text>}
    </View>
  );
};

type TStyles = {
  btnOuterTitleStyle: ViewStyle;
  btnOuterViewStyle: ViewStyle;
};

const styles: TStyles = StyleSheet.create({
  btnOuterTitleStyle: {
    // color: "blue",
    // fontSize: 30,
    // lineHeight: 30,
    // paddingLeft: 5,
  },
  btnOuterViewStyle: {
    // display: "flex",
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "grey",
    // padding: 5,
    // alignSelf: "flex-start",
    //
    // borderWidth: 1,
    // borderStyle: "solid",
    // borderColor: "red",
    // borderRadius: 8,
  },
});
