import React from "react";
import { StyleSheet } from "react-native";
import { Card as PaperCard, useTheme } from "react-native-paper";

import type { UICardProps } from "./types";

/**
 ** Card - обертка над Paper Card
 */
export const Card = (props: UICardProps) => {
  // ? Props
  const { children, style, elevation = 2 } = props;

  // ? Render
  return (
    <PaperCard
      style={[styles.card, style]}
      elevation={elevation}>
      <PaperCard.Content>{children}</PaperCard.Content>
    </PaperCard>
  );
};

// ? Styles
const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 12,
  },
});
