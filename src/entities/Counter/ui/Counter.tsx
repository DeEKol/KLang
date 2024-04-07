import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { useAppDispatch } from "app/providers/StoreProvider/ui/StoreProvider";
import { getCounterValue } from "entities/Counter/model/selectors/getCounterValue/getCounterValue";

import { counterActions } from "../model/slice/counterSlice";

export const Counter = () => {
  const { t } = useTranslation();

  const counterValue = useSelector(getCounterValue);
  const dispatch = useAppDispatch();

  const increment = () => {
    dispatch(counterActions.increment());
  };

  const decrement = () => {
    dispatch(counterActions.decrement());
  };

  return (
    <View>
      <Text>{counterValue}</Text>
      <Button
        title={t("Increment")}
        onPress={increment}
      />
      <Button
        title={t("Decrement")}
        onPress={decrement}
      />
    </View>
  );
};
