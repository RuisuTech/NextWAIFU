import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppConfig, ThemeColors, WaifuEmotion, DEFAULT_AVATARS, EMOTION_LABELS } from "../../companion/types";
import { useGemini } from "../../companion/useGemini";
import { GearMenu } from "../customization/GearMenu";

function resolveAvatar(uri: string) {
  if (uri.startsWith("local:")) {
    const key = uri.replace("local:", "") as WaifuEmotion;
    return DEFAULT_AVATARS[key] ?? DEFAULT_AVATARS.feliz;
  }
  return { uri };
}

interface Props {
  config: AppConfig;
  onLogout: () => void;
  theme: ThemeColors;
  accent: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  accentColor: string;
  onSelectAccent: (c: string) => void;
}

export function ChatScreen({
  config,
  onLogout,
  theme,
  accent,
  isDarkMode,
  onToggleTheme,
  accentColor,
  onSelectAccent,
}: Props) {
  const {
    messages,
    inputText,
    setInputText,
    isLoading,
    currentEmotion,
    sendMessage,
  } = useGemini(config.apiKey);

  const [menuVisible, setMenuVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <View style={[s.root, { backgroundColor: theme.bg }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <GearMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onGoSetup={onLogout}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        accentColor={accentColor}
        onSelectAccent={onSelectAccent}
        theme={theme}
      />

      <SafeAreaView style={[s.safeTop, { backgroundColor: theme.surface }]}>
        <View style={[s.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={[s.gearBtn, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}
            onPress={() => setMenuVisible(true)}
            activeOpacity={0.6}
          >
            <Text style={s.gearIcon}>⚙️</Text>
          </TouchableOpacity>

          <View style={[s.avatarBorder, { borderColor: accent, shadowColor: accent }]}>
            <View style={[s.avatarInner, { backgroundColor: theme.surfaceAlt }]}>
              <Image
                source={resolveAvatar(config.avatars[currentEmotion as keyof typeof config.avatars])}
                style={s.avatarImage}
                resizeMode="cover"
              />
            </View>
          </View>
          <Text style={[s.statusLabel, { color: theme.textMuted }]}>{EMOTION_LABELS[currentEmotion as keyof typeof EMOTION_LABELS]}</Text>
          <View style={s.statusRow}>
            <View style={[s.statusDot, { backgroundColor: accent }]} />
            <Text style={[s.statusText, { color: theme.textMuted }]}>NextWAIFU v0.2</Text>
          </View>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView style={s.chatArea} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView ref={scrollRef} style={s.chatScroll} contentContainerStyle={s.chatContent} showsVerticalScrollIndicator={false}>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[s.bubble, msg.isUser ? [s.bubbleUser, { backgroundColor: accent }] : [s.bubbleAI, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]]}
            >
              <Text style={[s.bubbleText, msg.isUser ? { color: "#FFFFFF" } : { color: theme.textSecondary }]}>
                {msg.text}
              </Text>
            </View>
          ))}
          {isLoading && (
            <View style={[s.bubble, s.bubbleAI, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
              <ActivityIndicator size="small" color={accent} />
            </View>
          )}
        </ScrollView>

        <View style={[s.inputBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <TextInput
            style={[s.input, { backgroundColor: theme.surfaceAlt, borderColor: theme.border, color: theme.text }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Cuéntame cómo estás..."
            placeholderTextColor={theme.textMuted}
            multiline
            maxLength={500}
            editable={!isLoading}
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[s.sendBtn, { backgroundColor: accent, shadowColor: accent }, (!inputText.trim() || isLoading) && s.sendBtnOff]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
            activeOpacity={0.7}
          >
            <Text style={s.sendTxt}>{isLoading ? "..." : "▶"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  safeTop: {},
  header: { paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1, alignItems: "center", position: "relative" },
  gearBtn: { position: "absolute", top: 12, right: 16, width: 40, height: 40, borderRadius: 20, borderWidth: 1, justifyContent: "center", alignItems: "center", zIndex: 10 },
  gearIcon: { fontSize: 20 },
  avatarBorder: { width: 112, height: 112, borderRadius: 56, borderWidth: 3, justifyContent: "center", alignItems: "center", marginBottom: 12, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 16, elevation: 10 },
  avatarInner: { width: 104, height: 104, borderRadius: 52, overflow: "hidden" },
  avatarImage: { width: 104, height: 104, borderRadius: 52 },
  statusLabel: { fontSize: 14, marginBottom: 8 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" },
  chatArea: { flex: 1 },
  chatScroll: { flex: 1 },
  chatContent: { padding: 16, paddingBottom: 8, gap: 12 },
  bubble: { maxWidth: "82%", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 18 },
  bubbleUser: { alignSelf: "flex-end", borderBottomRightRadius: 4 },
  bubbleAI: { alignSelf: "flex-start", borderWidth: 1, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  inputBar: { flexDirection: "row", alignItems: "flex-end", padding: 12, paddingBottom: 24, borderTopWidth: 1, gap: 10 },
  input: { flex: 1, minHeight: 44, maxHeight: 100, borderWidth: 1, borderRadius: 22, paddingHorizontal: 18, paddingVertical: 12, fontSize: 15, lineHeight: 20 },
  sendBtn: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
  sendBtnOff: { backgroundColor: "#27272A", shadowOpacity: 0 },
  sendTxt: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
});
