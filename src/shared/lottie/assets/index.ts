import type { AnimationObject } from "lottie-react-native";

import confetti from "./confetti.json";
import girl from "./girl.json";

type TAnimations = {
  [key: string]: AnimationObject;
};

export const animations: TAnimations = { girl, confetti };
