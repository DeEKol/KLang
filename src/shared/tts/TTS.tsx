import { Alert } from "react-native";
import TTS from "react-native-tts";

export async function setupTTS() {
  const voices = await TTS.voices();
  const koreanVoice = voices.find((v) => v.language === "ko-KR");
  if (koreanVoice) TTS.setDefaultVoice(koreanVoice.id);
}

export const checkKoreanVoice = async () => {
  const voices = await TTS.voices();
  const hasKorean = voices.some((v) => v.language === "ko-KR");
  if (!hasKorean) {
    Alert.alert("Голос для корейского не найден", "Перейдите в настройки устройства для загрузки.");
  }
};

export async function speak(text: string, lang = "en-US") {
  const voices = await TTS.voices();

  const targetVoice = voices.find((v) => v.language.startsWith(lang));
  if (targetVoice) {
    TTS.setDefaultVoice(targetVoice.id);
    TTS.speak(text);
  } else {
    console.error("Голос для языка", lang, "не найден");
  }
}
