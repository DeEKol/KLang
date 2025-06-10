import React from "react";
import { StyleSheet, Text } from "react-native";

interface IDialogProps {
  celebrate: boolean;
  isMatchComplete: boolean;
}

const Dialog = ({ celebrate, isMatchComplete }: IDialogProps): JSX.Element => {
  return isMatchComplete ? (
    <></>
  ) : (
    <Text style={styles.status}>{celebrate ? "Great Job! 💫" : "Find the matching pairs..."}</Text>
  );
};

const styles = StyleSheet.create({
  status: {
    fontSize: 20,
    textAlign: "center",
    paddingVertical: 16,
    color: "#2c3e50",
    fontWeight: "600",
  },
});

export default Dialog;
