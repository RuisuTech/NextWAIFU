import { WaifuEmotion } from "./types";

export const EMOTION_REGEX = /\[EMOCION:([^\]]+)\]/i;

const SUPPORTED_EMOTIONS: WaifuEmotion[] = [
  "emocionada",
  "molesta",
  "pensativa",
  "sorprendida",
  "timida",
  "triste",
];

export const parseEmotion = (raw: string): { cleanText: string; emotion: WaifuEmotion } => {
  const match = raw.match(EMOTION_REGEX);
  const withoutMetadata = raw
    .replace(/^\s*(?:\*{1,2})?\/?(?:mood|analysis|response|assistant|user)(?:\*{1,2})?\s*:\s*[^\n]*(?:\n|$)/i, "")
    .trim();
  if (match) {
    const parsedEmotion = match[1].toLowerCase() as WaifuEmotion;
    return {
      cleanText: withoutMetadata.replace(EMOTION_REGEX, "").trim() || "Cuéntame un poco más.",
      emotion: SUPPORTED_EMOTIONS.includes(parsedEmotion) ? parsedEmotion : "emocionada",
    };
  }
  return { cleanText: withoutMetadata || "Cuéntame un poco más.", emotion: "pensativa" };
};
