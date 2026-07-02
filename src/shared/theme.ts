import { ThemeColors } from "../companion/types";

export const ACCENT_COLORS = ["#A855F7", "#EC4899", "#3B82F6", "#10B981"] as const;

export const DARK: ThemeColors = {
  bg: "#121214",
  surface: "#18181B",
  surfaceAlt: "#1E1E24",
  border: "#27272A",
  text: "#FFFFFF",
  textSecondary: "#E4E4E7",
  textMuted: "#A1A1AA",
  overlay: "rgba(0,0,0,0.8)",
};

export const LIGHT: ThemeColors = {
  bg: "#F4F4F5",
  surface: "#FFFFFF",
  surfaceAlt: "#F0F0F2",
  border: "#D4D4D8",
  text: "#18181B",
  textSecondary: "#27272A",
  textMuted: "#71717A",
  overlay: "rgba(0,0,0,0.4)",
};

export const resolveTheme = (isDarkMode: boolean): ThemeColors =>
  isDarkMode ? DARK : LIGHT;
