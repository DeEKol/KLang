import React from "react";
import { StyleSheet, Text } from "react-native";
import { useThemeTokens } from "entities/theme";

interface IDialogProps {
  celebrate: boolean;
  isMatchComplete: boolean;
}

const Dialog = ({ celebrate, isMatchComplete }: IDialogProps): React.ReactElement => {
  const { colors } = useThemeTokens();

  return isMatchComplete ? (
    <></>
  ) : (
    <Text style={[styles.status, { color: colors.text }]}>
      {celebrate ? "Great Job! 💫" : "Find the matching pairs..."}
    </Text>
  );
};

const styles = StyleSheet.create({
  status: {
    fontSize: 20,
    textAlign: "center",
    paddingVertical: 16,
    fontWeight: "600",
  },
});

export default Dialog;
