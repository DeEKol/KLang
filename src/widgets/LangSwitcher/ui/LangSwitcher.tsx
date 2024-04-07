import React from "react";
import { useTranslation } from "react-i18next";
import { Button, View } from "react-native";

export const LangSwitcher = () => {
  const { t, i18n } = useTranslation();

  const onToggle = (): void => {
    void i18n.changeLanguage(i18n.language === "ru" ? "en" : "ru");
  };

  return (
    <View>
      <Button
        title={t("Change lang")}
        onPress={onToggle}
      />
    </View>
  );
};
