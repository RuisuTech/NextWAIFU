import { ImageSourcePropType } from "react-native";

export type WaifuEmotion =
  | "emocionada"
  | "molesta"
  | "pensativa"
  | "sorprendida"
  | "timida"
  | "triste";

export interface AppConfig {
  apiKey: string;
  avatars: Record<WaifuEmotion, string>;
  name?: string;
  identity?: string;
  personality?: string;
  elevenLabsApiKey?: string;
  elevenLabsVoiceId?: string;
}

export interface ThemePrefs {
  isDarkMode: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
}

export interface GeminiPart {
  text: string;
}

export interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

export interface GeminiRequest {
  contents: GeminiContent[];
  systemInstruction?: { parts: GeminiPart[] };
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
  };
}

export interface GeminiResponse {
  candidates: {
    content: { parts: GeminiPart[]; role: string };
    finishReason: string;
  }[];
}

export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  overlay: string;
}

export const DEFAULT_AVATARS: Record<WaifuEmotion, ImageSourcePropType> = {
  emocionada: require("../../assets/images/avatars/Emocionada.png"),
  molesta: require("../../assets/images/avatars/Molesta.png"),
  pensativa: require("../../assets/images/avatars/Pensativa.png"),
  sorprendida: require("../../assets/images/avatars/Sorprendida.png"),
  timida: require("../../assets/images/avatars/Timida.png"),
  triste: require("../../assets/images/avatars/Triste.png"),
};

export const EMOTION_LABELS: Record<WaifuEmotion, string> = {
  emocionada: "Emocionada",
  molesta: "Molesta",
  pensativa: "Pensando...",
  sorprendida: "Sorprendida",
  timida: "Tímida",
  triste: "Triste",
};

export const BACKGROUNDS = {
  light: require("../../assets/images/avatars/FondoDia.png"),
  dark: require("../../assets/images/avatars/FondoNoche.png"),
};
