import type { NativeEventEmitter } from "react-native";

export interface IWordMatcherSchema {
  type: string;
  words: string[];
  setValue: (word: any) => void;
  eventEmitter?: NativeEventEmitter;
}
