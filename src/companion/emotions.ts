import { WaifuEmotion } from "./types";

export const EMOTION_REGEX = /\[EMOCION:(feliz|pensativa|orgullosa|burlona|preocupada)\]/i;

export const parseEmotion = (raw: string): { cleanText: string; emotion: WaifuEmotion } => {
  const match = raw.match(EMOTION_REGEX);
  if (match) {
    return {
      cleanText: raw.replace(EMOTION_REGEX, "").trim(),
      emotion: match[1].toLowerCase() as WaifuEmotion,
    };
  }
  return { cleanText: raw.trim(), emotion: "pensativa" };
};
