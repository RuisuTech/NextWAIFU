import { ThemeColors } from "../companion/types";

export const ACCENT_COLOR = "#C87952";

export const DARK: ThemeColors = {
  bg: "#17151A",
  surface: "#211C1E",
  surfaceAlt: "#2B2425",
  border: "#5A4A49",
  text: "#FFFFFF",
  textSecondary: "#F3E8E2",
  textMuted: "#C0B1AB",
  overlay: "rgba(18,14,16,0.84)",
};

export const LIGHT: ThemeColors = {
  bg: "#F1E6DA",
  surface: "#FFF8F0",
  surfaceAlt: "#F4E8DC",
  border: "#C9B09A",
  text: "#2A211C",
  textSecondary: "#493A30",
  textMuted: "#76675C",
  overlay: "rgba(255,235,214,0.88)",
};

export const resolveTheme = (isDarkMode: boolean): ThemeColors =>
  isDarkMode ? DARK : LIGHT;
