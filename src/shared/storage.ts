import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppConfig, ChatMessage, ThemePrefs } from "../companion/types";

const CONFIG_KEY = "@nextwaifu_config";
const THEME_KEY = "@nextwaifu_theme";
const MESSAGES_KEY = "@nextwaifu_messages";

export const loadConfig = async (): Promise<AppConfig | null> => {
  try {
    const raw = await AsyncStorage.getItem(CONFIG_KEY);
    if (!raw) return null;
    const config = JSON.parse(raw) as Partial<AppConfig>;
    if (typeof config.apiKey !== "string" || !config.apiKey.trim()) return null;
    if (!config.avatars) return null;
    return { ...config, apiKey: config.apiKey.trim() } as AppConfig;
  } catch {
    return null;
  }
};

export const saveConfig = async (config: AppConfig): Promise<void> => {
  await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

export const removeConfig = async (): Promise<void> => {
  await AsyncStorage.removeItem(CONFIG_KEY);
};

export const loadTheme = async (): Promise<ThemePrefs> => {
  try {
    const raw = await AsyncStorage.getItem(THEME_KEY);
    if (raw) return JSON.parse(raw) as ThemePrefs;
  } catch {
    /* ignore */
  }
  return { isDarkMode: true };
};

export const saveTheme = async (prefs: ThemePrefs): Promise<void> => {
  await AsyncStorage.setItem(THEME_KEY, JSON.stringify(prefs));
};

export const loadMessages = async (): Promise<ChatMessage[]> => {
  try {
    const raw = await AsyncStorage.getItem(MESSAGES_KEY);
    if (raw) return JSON.parse(raw) as ChatMessage[];
  } catch {
    /* ignore */
  }
  return [];
};

export const saveMessages = async (messages: ChatMessage[]): Promise<void> => {
  const toSave = messages.slice(-50);
  await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(toSave));
};

export const removeMessages = async (): Promise<void> => {
  await AsyncStorage.removeItem(MESSAGES_KEY);
};
