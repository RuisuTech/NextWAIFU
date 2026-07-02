import { ImageSourcePropType } from "react-native";

export type WaifuEmotion = "feliz" | "pensativa" | "orgullosa" | "burlona" | "preocupada";

export interface AppConfig {
  apiKey: string;
  avatars: Record<WaifuEmotion, string>;
}

export interface ThemePrefs {
  isDarkMode: boolean;
  accentColor: string;
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
  feliz: require("../../assets/images/feliz.png"),
  pensativa: require("../../assets/images/pensativa.png"),
  orgullosa: require("../../assets/images/orgullosa.png"),
  burlona: require("../../assets/images/burlona.png"),
  preocupada: require("../../assets/images/derrota.png"),
};

export const EMOTION_LABELS: Record<WaifuEmotion, string> = {
  feliz: "¡Feliz!",
  pensativa: "Pensando...",
  orgullosa: "Orgullosa",
  burlona: "Burlona",
  preocupada: "Preocupada",
};
