import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppConfig, ThemePrefs } from "../companion/types";

const CONFIG_KEY = "@nextwaifu_config";
const THEME_KEY = "@nextwaifu_theme";

export const loadConfig = async (): Promise<AppConfig | null> => {
  try {
    const raw = await AsyncStorage.getItem(CONFIG_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppConfig;
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
  } catch { /* ignore */ }
  return { isDarkMode: true, accentColor: "#A855F7" };
};

export const saveTheme = async (prefs: ThemePrefs): Promise<void> => {
  await AsyncStorage.setItem(THEME_KEY, JSON.stringify(prefs));
};
