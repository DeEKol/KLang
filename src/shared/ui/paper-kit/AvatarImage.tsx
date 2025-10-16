import React from "react";
import { Avatar } from "react-native-paper";

export const AvatarImage = ({ source, size }: { source: { uri: string }; size: number }) => (
  <Avatar.Image
    source={source}
    size={size}
  />
);
