import { StatusBar } from "expo-status-bar";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Image,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    AppConfig,
    BACKGROUNDS,
    DEFAULT_AVATARS,
    ThemeColors,
    WaifuEmotion,
} from "../../companion/types";
import { useGemini } from "../../companion/useGemini";
import { useElevenLabs } from "../../companion/useElevenLabs";
import { GearMenu } from "../customization/GearMenu";

function resolveAvatar(emotion: WaifuEmotion, avatarUri?: string) {
  if (avatarUri && !avatarUri.startsWith("local:")) {
    return { uri: avatarUri };
  }
  return DEFAULT_AVATARS[emotion];
}

interface Props {
  config: AppConfig;
  onLogout: () => void;
  theme: ThemeColors;
  accent: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSaveVoice: (apiKey: string, voiceId: string) => Promise<void>;
}

export function ChatScreen({
  config,
  onLogout,
  theme,
  accent,
  isDarkMode,
  onToggleTheme,
  onSaveVoice,
}: Props) {
  const {
    messages,
    inputText,
    setInputText,
    isLoading,
    currentEmotion,
    sendMessage,
  } = useGemini(
    config.apiKey,
    config.name,
    config.identity,
    config.personality,
  );
  const { speak: speakElevenLabs, stop: stopElevenLabs } = useElevenLabs(
    config.elevenLabsApiKey,
    config.elevenLabsVoiceId,
  );

  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const useNativeDriver = Platform.OS !== "web";
  const [inputFocused, setInputFocused] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const avatarOpacity = useRef(new Animated.Value(1)).current;
  const avatarScale = useRef(new Animated.Value(1)).current;
  const spokenMessageId = useRef("welcome");

  const panelMargin = width < 420 ? 12 : 24;
  const panelWidth = Math.min(width - panelMargin * 2, 900);
  const panelHeight = Math.min(Math.max(height * 0.29, 210), 330);
  const avatarWidth = Math.min(
    Math.max(width < 600 ? width * 1.35 : width * 0.72, height * 0.6),
    680,
  );

  const lastAiMessage = [...messages].reverse().find((m) => !m.isUser);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(avatarOpacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver,
      }),
      Animated.timing(avatarScale, {
        toValue: 0.985,
        duration: 120,
        useNativeDriver,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(avatarOpacity, {
          toValue: 1,
          duration: 240,
          useNativeDriver,
        }),
        Animated.spring(avatarScale, {
          toValue: 1,
          speed: 14,
          bounciness: 3,
          useNativeDriver,
        }),
      ]).start();
    });
  }, [currentEmotion, avatarOpacity, avatarScale, useNativeDriver]);

  useEffect(() => {
    if (!voiceEnabled) {
      Speech.stop();
      return;
    }

    if (!lastAiMessage || lastAiMessage.id === spokenMessageId.current) return;

    spokenMessageId.current = lastAiMessage.id;
    Speech.stop();
    stopElevenLabs();

    const speakResponse = async () => {
      try {
        const usedElevenLabs = await speakElevenLabs(lastAiMessage.text);
        if (!usedElevenLabs) {
          Speech.speak(lastAiMessage.text, {
            language: "es-ES",
            rate: 0.95,
            pitch: 1.05,
          });
        }
      } catch (error) {
        if (error instanceof Error && !error.message.includes("plan de pago")) {
          console.error("ElevenLabs speech failed:", error);
        }
        Speech.speak(lastAiMessage.text, {
          language: "es-ES",
          rate: 0.95,
          pitch: 1.05,
        });
      }
    };

    speakResponse();

    return () => {
      Speech.stop();
      stopElevenLabs();
    };
  }, [lastAiMessage, speakElevenLabs, stopElevenLabs, voiceEnabled]);

  return (
    <View style={[s.root, { backgroundColor: theme.bg }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <Image
        source={isDarkMode ? BACKGROUNDS.dark : BACKGROUNDS.light}
        style={s.background}
        resizeMode="cover"
      />

      <Animated.View
        style={[
          s.emotionAvatarContainer,
          { opacity: avatarOpacity, transform: [{ scale: avatarScale }] },
        ]}
      >
        <Image
          source={resolveAvatar(currentEmotion, config.avatars[currentEmotion])}
          style={[s.emotionAvatar, { width: avatarWidth }]}
          resizeMode="contain"
        />
      </Animated.View>

      <View
        style={[
          s.topToolbar,
          {
            width: panelWidth,
            left: (width - panelWidth) / 2,
            top: Math.max(insets.top + 4, 8),
          },
        ]}
      >
        <GearMenu
          onGoSetup={onLogout}
          isDarkMode={isDarkMode}
          onToggleTheme={onToggleTheme}
          voiceEnabled={voiceEnabled}
          onToggleVoice={() => setVoiceEnabled((enabled) => !enabled)}
          elevenLabsApiKey={config.elevenLabsApiKey}
          elevenLabsVoiceId={config.elevenLabsVoiceId}
          onSaveVoice={onSaveVoice}
          theme={theme}
          messages={messages}
        />
      </View>

      <View
        style={[
          s.bottomPanels,
          {
            width: panelWidth,
            left: (width - panelWidth) / 2,
            height: panelHeight,
            paddingBottom: Math.max(insets.bottom, 8),
          },
        ]}
      >
        <View
          style={[
            s.chatPanel,
            { backgroundColor: theme.overlay, borderColor: theme.border },
          ]}
        >
          <View style={[s.nameHeader, { borderBottomColor: theme.border }]}>
            <Text style={[s.nameLabel, { color: accent }]}>NextWAIFU</Text>
            <View style={[s.headerRule, { backgroundColor: accent }]} />
          </View>

          <View style={s.messageArea}>
            {isLoading ? (
              <View style={s.loadingRow}>
                <ActivityIndicator size="small" color={accent} />
                <Text style={[s.thinkingText, { color: theme.textMuted }]}>
                  Pensando...
                </Text>
              </View>
            ) : lastAiMessage ? (
              <>
                <Text style={[s.messageText, { color: theme.textSecondary }]}>
                  {lastAiMessage.text}
                </Text>
                <Text style={[s.caret, { color: theme.textMuted }]}>▼</Text>
              </>
            ) : (
              <Text style={[s.messageText, { color: theme.textMuted }]}>
                ¡Hola! Estoy aquí para acompañarte.
              </Text>
            )}
          </View>

          <View style={[s.inputRow, { borderTopColor: theme.border }]}>
            <View
              style={[
                s.inputShell,
                {
                  backgroundColor: theme.surfaceAlt,
                  borderColor: inputFocused ? accent : theme.border,
                },
              ]}
            >
              <TextInput
                accessibilityLabel="Mensaje para NextWAIFU"
                style={[
                  s.input,
                  { color: theme.text },
                  Platform.OS === "web" && ({ outlineStyle: "none" } as never),
                ]}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Escribe algo..."
                placeholderTextColor={theme.textMuted}
                maxLength={500}
                editable={!isLoading}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />
            </View>
            <TouchableOpacity
              accessibilityLabel="Enviar mensaje"
              style={[
                s.sendBtn,
                { backgroundColor: accent },
                (!inputText.trim() || isLoading) && {
                  backgroundColor: theme.border,
                },
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
              activeOpacity={0.7}
            >
              <Text style={s.sendTxt}>{isLoading ? "..." : "▶"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, overflow: "hidden" },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  emotionAvatarContainer: {
    position: "absolute",
    top: "6%",
    bottom: "4%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  emotionAvatar: {
    height: "100%",
  },
  topToolbar: {
    position: "absolute",
    zIndex: 10,
  },
  bottomPanels: {
    position: "absolute",
    bottom: 0,
    maxWidth: 900,
  },
  chatPanel: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 14,
    minHeight: 210,
    justifyContent: "space-between",
  },
  nameHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  nameLabel: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  headerRule: { flex: 1, height: 1, marginLeft: 12, opacity: 0.7 },
  messageArea: { flex: 1, justifyContent: "center", paddingVertical: 12 },
  messageText: { fontSize: 16, lineHeight: 24 },
  thinkingText: { fontSize: 14, marginLeft: 8 },
  loadingRow: { flexDirection: "row", alignItems: "center" },
  caret: { fontSize: 12, textAlign: "right", marginTop: 8, opacity: 0.8 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  inputShell: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 14,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  input: {
    height: 44,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 15,
    lineHeight: 20,
    outlineWidth: 0,
  },
  sendBtn: {
    width: 46,
    height: 46,
    flexShrink: 0,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  sendTxt: { color: "#FFFFFF", fontSize: 17, fontWeight: "800" },
});
