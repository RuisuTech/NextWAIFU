import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppConfig } from "../../src/companion/types";
import { loadConfig, loadTheme, removeConfig, saveTheme } from "../../src/shared/storage";
import { DARK, resolveTheme } from "../../src/shared/theme";
import { SetupScreen } from "../../src/features/configuration/SetupScreen";
import { ChatScreen } from "../../src/features/chat/ChatScreen";

export default function NextWaifuScreen() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [accentColor, setAccentColor] = useState("#A855F7");

  const theme = resolveTheme(isDarkMode);

  useEffect(() => {
    Promise.all([loadConfig(), loadTheme()]).then(([cfg, t]) => {
      setConfig(cfg);
      setIsDarkMode(t.isDarkMode);
      setAccentColor(t.accentColor);
      setLoading(false);
    });
  }, []);

  const handleSave = (cfg: AppConfig) => setConfig(cfg);

  const handleLogout = async () => {
    await removeConfig();
    setConfig(null);
  };

  const handleToggleTheme = async () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    await saveTheme({ isDarkMode: next, accentColor });
  };

  const handleSelectAccent = async (color: string) => {
    setAccentColor(color);
    await saveTheme({ isDarkMode, accentColor: color });
  };

  if (loading) {
    return (
      <View style={[s.root, s.center, { backgroundColor: DARK.bg }]}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#A855F7" />
        <Text style={s.loadingTxt}>Cargando NextWAIFU...</Text>
      </View>
    );
  }

  if (!config) {
    return <SetupScreen onSave={handleSave} theme={theme} accent={accentColor} />;
  }

  return (
    <ChatScreen
      config={config}
      onLogout={handleLogout}
      theme={theme}
      accent={accentColor}
      isDarkMode={isDarkMode}
      onToggleTheme={handleToggleTheme}
      accentColor={accentColor}
      onSelectAccent={handleSelectAccent}
    />
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center", gap: 12 },
  loadingTxt: { color: "#A1A1AA", fontSize: 14 },
});
