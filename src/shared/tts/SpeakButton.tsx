import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { checkKoreanVoice, speak } from "./TTS";

const SpeakButton = ({ text, lang }: { text: string; lang: string }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={() => speak(text, lang)}>
    {/* TODO: <Icon
      name="volume-up"
      size={24}
    /> */}
    <Text style={styles.buttonText}>{"🔈"}</Text>
  </TouchableOpacity>
);

checkKoreanVoice();

const styles = StyleSheet.create({
  button: {
    position: "relative",
    width: 20,
    height: 20,
  },
  buttonText: {
    position: "absolute",
    top: -4,
    left: 1,
    fontSize: 16,
  },
});

export { SpeakButton };
