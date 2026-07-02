import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemeColors } from "../../companion/types";
import { ACCENT_COLORS } from "../../shared/theme";

interface Props {
  visible: boolean;
  onClose: () => void;
  onGoSetup: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  accentColor: string;
  onSelectAccent: (c: string) => void;
  theme: ThemeColors;
}

export function GearMenu({
  visible,
  onClose,
  onGoSetup,
  isDarkMode,
  onToggleTheme,
  accentColor,
  onSelectAccent,
  theme,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[s.overlay, { backgroundColor: theme.overlay }]}>
        <View style={[s.menu, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
          <Text style={[s.title, { color: theme.text }]}>Opciones</Text>

          <TouchableOpacity
            style={[s.option, { borderBottomColor: theme.border }]}
            onPress={() => { onClose(); onGoSetup(); }}
          >
            <Text style={[s.optionText, { color: theme.text }]}>⚙️  Ajustar NextWAIFU</Text>
          </TouchableOpacity>

          <View style={[s.option, s.optionRow, { borderBottomColor: theme.border }]}>
            <Text style={[s.optionText, { color: theme.text }]}>
              {isDarkMode ? "🌙" : "☀️"}  Modo {isDarkMode ? "Oscuro" : "Claro"}
            </Text>
            <View style={s.switchContainer}>
              <TouchableOpacity
                style={[s.themeBtn, { backgroundColor: isDarkMode ? accentColor : theme.border }]}
                onPress={onToggleTheme}
              >
                <Text style={[s.themeBtnTxt, { color: isDarkMode ? "#FFFFFF" : theme.text }]}>
                  {isDarkMode ? "Dark" : "Light"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[s.option, { borderBottomColor: theme.border }]}>
            <Text style={[s.optionText, { color: theme.text, marginBottom: 10 }]}>🎨  Color de Acento</Text>
            <View style={s.colorRow}>
              {ACCENT_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[s.colorDot, { backgroundColor: c }, accentColor === c && s.colorDotActive]}
                  onPress={() => onSelectAccent(c)}
                />
              ))}
            </View>
          </View>

          <TouchableOpacity style={[s.close, { backgroundColor: theme.border }]} onPress={onClose}>
            <Text style={[s.closeTxt, { color: theme.textMuted }]}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  menu: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
  },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
  option: { paddingVertical: 16, borderBottomWidth: 1 },
  optionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  optionText: { fontSize: 16, fontWeight: "500" },
  switchContainer: { flexDirection: "row", alignItems: "center" },
  themeBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  themeBtnTxt: { fontSize: 13, fontWeight: "600" },
  colorRow: { flexDirection: "row", gap: 14, justifyContent: "center" },
  colorDot: { width: 36, height: 36, borderRadius: 18, borderWidth: 3, borderColor: "transparent" },
  colorDotActive: { borderColor: "#FFFFFF", transform: [{ scale: 1.15 }] },
  close: { marginTop: 16, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  closeTxt: { fontSize: 15, fontWeight: "600" },
});
