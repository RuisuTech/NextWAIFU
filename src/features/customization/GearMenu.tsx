import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { ChatMessage, ThemeColors } from "../../companion/types";
import { ACCENT_COLOR } from "../../shared/theme";

interface Props {
  onGoSetup: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  geminiApiKey: string;
  elevenLabsApiKey?: string;
  elevenLabsVoiceId?: string;
  onSaveGeminiKey: (apiKey: string) => Promise<void>;
  onSaveVoice: (apiKey: string, voiceId: string) => Promise<void>;
  theme: ThemeColors;
  messages: ChatMessage[];
}

export function GearMenu({
  onGoSetup,
  isDarkMode,
  onToggleTheme,
  voiceEnabled,
  onToggleVoice,
  geminiApiKey,
  elevenLabsApiKey,
  elevenLabsVoiceId,
  onSaveGeminiKey,
  onSaveVoice,
  theme,
  messages,
}: Props) {
  const [showLogs, setShowLogs] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [showGemini, setShowGemini] = useState(false);
  const [geminiKey, setGeminiKey] = useState(geminiApiKey);
  const [voiceApiKey, setVoiceApiKey] = useState(elevenLabsApiKey || "");
  const [voiceId, setVoiceId] = useState(elevenLabsVoiceId || "");

  const openVoice = () => {
    setVoiceApiKey(elevenLabsApiKey || "");
    setVoiceId(elevenLabsVoiceId || "");
    setShowVoice(true);
  };

  const openGemini = () => {
    setGeminiKey(geminiApiKey);
    setShowGemini(true);
  };

  const saveGemini = async () => {
    await onSaveGeminiKey(geminiKey.trim());
    setShowGemini(false);
  };

  const saveVoice = async () => {
    await onSaveVoice(voiceApiKey.trim(), voiceId.trim());
    setShowVoice(false);
  };

  return (
    <>
      <View
        style={[
          s.toolbar,
          { backgroundColor: theme.overlay, borderColor: theme.border },
        ]}
      >
        <TouchableOpacity
          accessibilityLabel="Volver al menú principal"
          style={s.tool}
          onPress={onGoSetup}
          activeOpacity={0.75}
        >
          <Text style={[s.toolIcon, { color: ACCENT_COLOR }]}>⌂</Text>
          <Text style={[s.toolText, { color: theme.text }]}>MENU</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Abrir historial de conversación"
          style={[s.tool, { borderLeftColor: theme.border }]}
          onPress={() => setShowLogs(true)}
          activeOpacity={0.75}
        >
          <Text style={[s.toolIcon, { color: ACCENT_COLOR }]}>▤</Text>
          <Text style={[s.toolText, { color: theme.text }]}>LOGS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel={`Cambiar a modo ${isDarkMode ? "día" : "noche"}`}
          style={[s.tool, { borderLeftColor: theme.border }]}
          onPress={onToggleTheme}
          activeOpacity={0.75}
        >
          <Text style={[s.toolIcon, { color: ACCENT_COLOR }]}>
            {isDarkMode ? "☾" : "☼"}
          </Text>
          <Text style={[s.toolText, { color: theme.text }]}>
            {isDarkMode ? "NOCHE" : "DÍA"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Configurar API Key de IA"
          style={[s.tool, { borderLeftColor: theme.border }]}
          onPress={openGemini}
          activeOpacity={0.75}
        >
          <Text style={[s.toolIcon, { color: ACCENT_COLOR }]}>✦</Text>
          <Text style={[s.toolText, { color: theme.text }]}>IA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Configurar voz de ElevenLabs"
          style={[s.tool, { borderLeftColor: theme.border }]}
          onPress={openVoice}
          activeOpacity={0.75}
        >
          <Text style={[s.toolIcon, { color: ACCENT_COLOR }]}>
            {voiceEnabled ? "◖" : "⊘"}
          </Text>
          <Text style={[s.toolText, { color: theme.text }]}>VOZ</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        accessibilityLabel={voiceEnabled ? "Silenciar voz" : "Activar voz"}
        style={s.voiceToggle}
        onPress={onToggleVoice}
        activeOpacity={0.75}
      >
        <Text style={[s.voiceToggleText, { color: ACCENT_COLOR }]}>
          {voiceEnabled ? "VOZ ACTIVA" : "VOZ SILENCIADA"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showLogs}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogs(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowLogs(false)}>
          <View style={[s.modalOverlay, { backgroundColor: theme.overlay }]}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  s.modalCard,
                  {
                    backgroundColor: theme.surfaceAlt,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[s.modalTitle, { color: ACCENT_COLOR }]}>
                  LOGS
                </Text>
                <ScrollView
                  style={s.logs}
                  contentContainerStyle={s.logsContent}
                >
                  {messages.length === 0 ? (
                    <Text style={[s.emptyLogs, { color: theme.textMuted }]}>
                      Aún no hay mensajes.
                    </Text>
                  ) : (
                    messages.slice(-20).map((message) => (
                      <View
                        key={message.id}
                        style={[
                          s.logLine,
                          {
                            borderLeftColor: message.isUser
                              ? ACCENT_COLOR
                              : theme.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            s.logSpeaker,
                            {
                              color: message.isUser
                                ? ACCENT_COLOR
                                : theme.textMuted,
                            },
                          ]}
                        >
                          {message.isUser ? "TÚ" : "NEXTWAIFU"}
                        </Text>
                        <Text
                          style={[s.logText, { color: theme.textSecondary }]}
                        >
                          {message.text}
                        </Text>
                      </View>
                    ))
                  )}
                </ScrollView>
                <TouchableOpacity
                  style={[s.modalClose, { borderColor: theme.border }]}
                  onPress={() => setShowLogs(false)}
                >
                  <Text style={[s.modalCloseText, { color: theme.textMuted }]}>
                    CERRAR
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={showVoice} transparent animationType="fade" onRequestClose={() => setShowVoice(false)}>
        <TouchableWithoutFeedback onPress={() => setShowVoice(false)}>
          <View style={[s.modalOverlay, { backgroundColor: theme.overlay }]}>
            <TouchableWithoutFeedback>
              <View style={[s.voiceCard, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
                <Text style={[s.modalTitle, { color: ACCENT_COLOR }]}>VOZ</Text>
                <Text style={[s.voiceHint, { color: theme.textMuted }]}>Cambia la API Key o el Voice ID de ElevenLabs sin salir del chat.</Text>
                <TextInput style={[s.voiceInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]} value={voiceApiKey} onChangeText={setVoiceApiKey} placeholder="API Key (sk_...)" placeholderTextColor={theme.textMuted} secureTextEntry autoCapitalize="none" autoCorrect={false} />
                <TextInput style={[s.voiceInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]} value={voiceId} onChangeText={setVoiceId} placeholder="Voice ID" placeholderTextColor={theme.textMuted} autoCapitalize="none" autoCorrect={false} />
                <View style={s.voiceActions}>
                  <TouchableOpacity style={[s.modalClose, { borderColor: theme.border }]} onPress={() => setShowVoice(false)}><Text style={[s.modalCloseText, { color: theme.textMuted }]}>CANCELAR</Text></TouchableOpacity>
                  <TouchableOpacity style={[s.modalClose, { backgroundColor: ACCENT_COLOR, borderColor: ACCENT_COLOR }]} onPress={saveVoice}><Text style={s.saveVoiceText}>GUARDAR</Text></TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={showGemini} transparent animationType="fade" onRequestClose={() => setShowGemini(false)}>
        <TouchableWithoutFeedback onPress={() => setShowGemini(false)}>
          <View style={[s.modalOverlay, { backgroundColor: theme.overlay }]}>
            <TouchableWithoutFeedback>
              <View style={[s.voiceCard, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
                <Text style={[s.modalTitle, { color: ACCENT_COLOR }]}>IA</Text>
                <Text style={[s.voiceHint, { color: theme.textMuted }]}>Cambia tu API Key de Google Gemini sin salir del chat.</Text>
                <TextInput style={[s.voiceInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]} value={geminiKey} onChangeText={setGeminiKey} placeholder="AIzaSy..." placeholderTextColor={theme.textMuted} secureTextEntry autoCapitalize="none" autoCorrect={false} />
                <View style={s.voiceActions}>
                  <TouchableOpacity style={[s.modalClose, { borderColor: theme.border }]} onPress={() => setShowGemini(false)}><Text style={[s.modalCloseText, { color: theme.textMuted }]}>CANCELAR</Text></TouchableOpacity>
                  <TouchableOpacity style={[s.modalClose, { backgroundColor: ACCENT_COLOR, borderColor: ACCENT_COLOR }]} onPress={saveGemini}><Text style={s.saveVoiceText}>GUARDAR</Text></TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 8,
    minHeight: 52,
  },
  tool: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    paddingHorizontal: 4,
  },
  toolIcon: { fontSize: 16, lineHeight: 18, marginBottom: 2 },
  toolText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },
  voiceToggle: { alignSelf: "flex-end", marginTop: -2, marginBottom: 6, paddingHorizontal: 8, paddingVertical: 2 },
  voiceToggleText: { fontSize: 8, fontWeight: "800", letterSpacing: 0.8 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 560,
    maxHeight: "75%",
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 14,
  },
  logs: { maxHeight: 390 },
  logsContent: { paddingBottom: 4 },
  logLine: { borderLeftWidth: 2, paddingLeft: 12, paddingVertical: 9 },
  logSpeaker: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 4,
  },
  logText: { fontSize: 14, lineHeight: 20 },
  emptyLogs: { textAlign: "center", paddingVertical: 28, fontSize: 14 },
  modalClose: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalCloseText: { fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  voiceCard: { width: "100%", maxWidth: 460, borderWidth: 1, borderRadius: 18, padding: 20 },
  voiceHint: { fontSize: 12, lineHeight: 18, marginBottom: 14 },
  voiceInput: { minHeight: 46, borderWidth: 1, borderRadius: 11, paddingHorizontal: 13, marginBottom: 9, fontSize: 13 },
  voiceActions: { flexDirection: "row", gap: 8, marginTop: 5 },
  saveVoiceText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
});
