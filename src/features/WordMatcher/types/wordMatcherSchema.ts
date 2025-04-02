import type { NativeEventEmitter } from "react-native";

export interface IWordMatcherSchema {
  type: string;
  words: string[];
  setValue: (word: string) => void;
  eventEmitter?: NativeEventEmitter;
}
