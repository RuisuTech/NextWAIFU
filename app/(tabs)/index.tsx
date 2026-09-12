import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { AppConfig } from "../../src/companion/types";
import { ChatScreen } from "../../src/features/chat/ChatScreen";
import { SetupScreen } from "../../src/features/configuration/SetupScreen";
import {
    loadConfig,
    loadTheme,
    removeMessages,
    saveConfig,
    saveTheme,
} from "../../src/shared/storage";
import { ACCENT_COLOR, DARK, resolveTheme } from "../../src/shared/theme";

export default function NextWaifuScreen() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = resolveTheme(isDarkMode);

  useEffect(() => {
    Promise.all([loadConfig(), loadTheme()]).then(([cfg, t]) => {
      setConfig(cfg);
      setIsDarkMode(t.isDarkMode);
      setLoading(false);
    });
  }, []);

  const handleSave = (cfg: AppConfig) => setConfig(cfg);

  const handleLogout = async () => {
    await removeMessages();
    setConfig(null);
  };

  const handleToggleTheme = async () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    await saveTheme({ isDarkMode: next });
  };

  const handleSaveVoice = async (apiKey: string, voiceId: string) => {
    if (!config) return;
    const updatedConfig = {
      ...config,
      elevenLabsApiKey: apiKey,
      elevenLabsVoiceId: voiceId,
    };
    await saveConfig(updatedConfig);
    setConfig(updatedConfig);
  };

  const handleSaveGeminiKey = async (apiKey: string) => {
    if (!config) return;
    const updatedConfig = { ...config, apiKey };
    await saveConfig(updatedConfig);
    setConfig(updatedConfig);
  };

  if (loading) {
    return (
      <View style={[s.root, s.center, { backgroundColor: DARK.bg }]}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={ACCENT_COLOR} />
        <Text style={s.loadingTxt}>Cargando NextWAIFU...</Text>
      </View>
    );
  }

  if (!config) {
    return (
      <SetupScreen
        onSave={handleSave}
        theme={theme}
        accent={ACCENT_COLOR}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  return (
    <ChatScreen
      config={config}
      onLogout={handleLogout}
      theme={theme}
      accent={ACCENT_COLOR}
      isDarkMode={isDarkMode}
      onToggleTheme={handleToggleTheme}
      onSaveGeminiKey={handleSaveGeminiKey}
      onSaveVoice={handleSaveVoice}
    />
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center", gap: 12 },
  loadingTxt: { color: "#A1A1AA", fontSize: 14 },
});
