import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppConfig, ThemeColors, WaifuEmotion, DEFAULT_AVATARS, EMOTION_LABELS } from "../../companion/types";
import { saveConfig } from "../../shared/storage";
import { DARK } from "../../shared/theme";

function resolveAvatar(uri: string) {
  if (uri.startsWith("local:")) {
    const key = uri.replace("local:", "") as WaifuEmotion;
    return DEFAULT_AVATARS[key] ?? DEFAULT_AVATARS.feliz;
  }
  return { uri };
}

interface Props {
  onSave: (cfg: AppConfig) => void;
  theme: ThemeColors;
  accent: string;
}

export function SetupScreen({ onSave, theme, accent }: Props) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [avatars, setAvatars] = useState<Record<WaifuEmotion, string>>({
    feliz: "local:feliz",
    pensativa: "local:pensativa",
    orgullosa: "local:orgullosa",
    burlona: "local:burlona",
    preocupada: "local:preocupada",
  });
  const [editingEmotion, setEditingEmotion] = useState<WaifuEmotion | null>(null);
  const [urlInput, setUrlInput] = useState("");

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    const cfg = { apiKey: apiKey.trim(), avatars };
    await saveConfig(cfg);
    onSave(cfg);
  };

  const confirmUrl = () => {
    if (editingEmotion && urlInput.trim()) {
      setAvatars((prev) => ({ ...prev, [editingEmotion]: urlInput.trim() }));
    }
    setEditingEmotion(null);
    setUrlInput("");
  };

  return (
    <View style={[s.root, { backgroundColor: theme.bg }]}>
      <StatusBar style={theme === DARK ? "light" : "dark"} />
      <SafeAreaView edges={["top", "left", "right"]} style={[s.safeTop, { backgroundColor: theme.surface }]}>
        <ScrollView contentContainerStyle={s.scroll}>
          <Text style={[s.title, { color: accent }]}>NextWAIFU</Text>
          <Text style={[s.subtitle, { color: theme.textMuted }]}>
            Dale vida a tu compañera ideal
          </Text>

          <Text style={[s.label, { color: theme.textMuted }]}>Gemini API Key</Text>
          <View style={s.keyRow}>
            <TextInput
              style={[s.keyInput, { backgroundColor: theme.surfaceAlt, borderColor: theme.border, color: theme.text }]}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="Pega tu API key aquí..."
              placeholderTextColor={theme.textMuted}
              secureTextEntry={!showKey}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={[s.showBtn, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}
              onPress={() => setShowKey((p) => !p)}
            >
              <Text style={s.showBtnTxt}>{showKey ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>

          <Text style={[s.label, { marginTop: 24, color: theme.textMuted }]}>Emociones / Avatares</Text>
          {(Object.keys(EMOTION_LABELS) as WaifuEmotion[]).map((emo) => (
            <View key={emo} style={[s.avatarRow, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
              <View style={[s.thumbBorder, { borderColor: accent }]}>
                <Image source={resolveAvatar(avatars[emo])} style={s.thumb} resizeMode="cover" />
              </View>
              <View style={s.avatarInfo}>
                <Text style={[s.avatarName, { color: theme.textSecondary }]}>{EMOTION_LABELS[emo]}</Text>
                <TouchableOpacity
                  style={[s.changeBtn, { backgroundColor: theme.border }]}
                  onPress={() => {
                    setEditingEmotion(emo);
                    setUrlInput(avatars[emo].startsWith("local:") ? "" : avatars[emo]);
                  }}
                >
                  <Text style={[s.changeBtnTxt, { color: accent }]}>Cambiar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {editingEmotion && (
            <View style={[s.modalOverlay, { backgroundColor: theme.overlay }]}>
              <View style={[s.modalCard, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
                <Text style={[s.modalTitle, { color: accent }]}>
                  {"URL para \"" + EMOTION_LABELS[editingEmotion] + "\""}
                </Text>
                <TextInput
                  style={[s.modalInput, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }]}
                  value={urlInput}
                  onChangeText={setUrlInput}
                  placeholder="https://ejemplo.com/imagen.png"
                  placeholderTextColor={theme.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Text style={[s.modalHint, { color: theme.textMuted }]}>
                  En el futuro se conectará un Image Picker.
                </Text>
                <View style={s.modalBtns}>
                  <TouchableOpacity
                    style={[s.modalCancel, { backgroundColor: theme.border }]}
                    onPress={() => { setEditingEmotion(null); setUrlInput(""); }}
                  >
                    <Text style={[s.modalCancelTxt, { color: theme.textMuted }]}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.modalConfirm, { backgroundColor: accent }]} onPress={confirmUrl}>
                    <Text style={s.modalConfirmTxt}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[s.saveBtn, { backgroundColor: accent, shadowColor: accent }, !apiKey.trim() && s.saveBtnOff]}
            onPress={handleSave}
            disabled={!apiKey.trim()}
            activeOpacity={0.7}
          >
            <Text style={s.saveBtnTxt}>Empezar a charlar 💬</Text>
          </TouchableOpacity>

          <Text style={[s.footer, { color: theme.textMuted }]}>NextWAIFU v0.2 — Open Source</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  safeTop: {},
  scroll: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 15, textAlign: "center", marginBottom: 32 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 },
  keyRow: { flexDirection: "row", gap: 8 },
  keyInput: { flex: 1, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },
  showBtn: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  showBtnTxt: { fontSize: 18 },
  avatarRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 12, padding: 10, marginBottom: 8, gap: 12 },
  thumbBorder: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, overflow: "hidden" },
  thumb: { width: 52, height: 52, borderRadius: 26 },
  avatarInfo: { flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  avatarName: { fontSize: 14, fontWeight: "500" },
  changeBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  changeBtnTxt: { fontSize: 12, fontWeight: "600" },
  modalOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center", padding: 24, zIndex: 100 },
  modalCard: { width: "100%", borderWidth: 1, borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  modalInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, marginBottom: 8 },
  modalHint: { fontSize: 11, marginBottom: 16, fontStyle: "italic" },
  modalBtns: { flexDirection: "row", gap: 10 },
  modalCancel: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  modalCancelTxt: { fontSize: 13, fontWeight: "600" },
  modalConfirm: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  modalConfirmTxt: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },
  saveBtn: { marginTop: 28, paddingVertical: 16, borderRadius: 14, alignItems: "center", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  saveBtnOff: { backgroundColor: "#27272A", shadowOpacity: 0 },
  saveBtnTxt: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  footer: { marginTop: 24, textAlign: "center", fontSize: 11 },
});
