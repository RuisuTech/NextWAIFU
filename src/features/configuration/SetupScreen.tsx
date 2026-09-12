import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Image,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    AppConfig,
    BACKGROUNDS,
    DEFAULT_AVATARS,
    EMOTION_LABELS,
    ThemeColors,
    WaifuEmotion,
} from "../../companion/types";
import { saveConfig } from "../../shared/storage";

type SetupView = "menu" | "api" | "avatar" | "identity" | "background" | "voice";

const DEFAULT_AVATARS_CONFIG: Record<WaifuEmotion, string> = {
  emocionada: "local:emocionada",
  molesta: "local:molesta",
  pensativa: "local:pensativa",
  sorprendida: "local:sorprendida",
  timida: "local:timida",
  triste: "local:triste",
};

const webInputReset =
  Platform.OS === "web" ? ({ outlineStyle: "none" } as never) : null;

function resolveAvatar(uri: string) {
  if (uri.startsWith("local:")) {
    const key = uri.replace("local:", "") as WaifuEmotion;
    return DEFAULT_AVATARS[key] ?? DEFAULT_AVATARS.timida;
  }
  return { uri };
}

interface Props {
  onSave: (cfg: AppConfig) => void;
  theme: ThemeColors;
  accent: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function SetupScreen({
  onSave,
  theme,
  accent,
  isDarkMode,
  onToggleTheme,
}: Props) {
  const { width } = useWindowDimensions();
  const [view, setView] = useState<SetupView>("menu");
  const [apiKey, setApiKey] = useState("");
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState("");
  const [elevenLabsVoiceId, setElevenLabsVoiceId] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [characterName, setCharacterName] = useState("Ruika");
  const [identity, setIdentity] = useState(
    "Ruika es una chica tranquila, inteligente y reservada, difícil de leer al principio. Con confianza se vuelve más tierna, juguetona y cercana. Tiene carácter, es muy competitiva y disfruta de las bromas y la complicidad. Demuestra su cariño de forma sutil y natural, sin exagerar. Es una compañera que escucha, acompaña y motiva, pero siempre mantiene su propia personalidad.",
  );
  const [personality, setPersonality] = useState(
    "Tranquila, reservada, inteligente, tierna, juguetona y competitiva.",
  );
  const [avatars, setAvatars] = useState(DEFAULT_AVATARS_CONFIG);
  const [editingEmotion, setEditingEmotion] = useState<WaifuEmotion | null>(
    null,
  );
  const [urlInput, setUrlInput] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const contentWidth = Math.min(width - 32, 520);
  const canStart = Boolean(apiKey.trim());

  const handleSave = async () => {
    if (!canStart) {
      setView("api");
      return;
    }
    const config: AppConfig = {
      apiKey: apiKey.trim(),
      avatars,
      name: characterName.trim() || "Ruika",
      identity:
        identity.trim() ||
        "Ruika es tranquila, inteligente y reservada; escucha, acompaña y motiva manteniendo su propia personalidad.",
      personality:
        personality.trim() ||
        "Tranquila, reservada, inteligente, tierna, juguetona y competitiva.",
      elevenLabsApiKey: elevenLabsApiKey.trim(),
      elevenLabsVoiceId: elevenLabsVoiceId.trim(),
    };
    await saveConfig(config);
    onSave(config);
  };

  const handleSaveAndReturn = async () => {
    if (apiKey.trim()) {
      await saveConfig({
        apiKey: apiKey.trim(),
        avatars,
        name: characterName.trim() || "Ruika",
        identity: identity.trim(),
        personality: personality.trim(),
        elevenLabsApiKey: elevenLabsApiKey.trim(),
        elevenLabsVoiceId: elevenLabsVoiceId.trim(),
      });
    }
    setView("menu");
  };

  const openAvatarEditor = (emotion: WaifuEmotion) => {
    setEditingEmotion(emotion);
    setUrlInput(avatars[emotion].startsWith("local:") ? "" : avatars[emotion]);
  };

  const confirmAvatar = () => {
    if (editingEmotion && urlInput.trim()) {
      setAvatars((current) => ({
        ...current,
        [editingEmotion]: urlInput.trim(),
      }));
    }
    setEditingEmotion(null);
    setUrlInput("");
  };

  return (
    <View style={[s.root, { backgroundColor: theme.bg }]}>
      <StatusBar style={theme.text === "#FFFFFF" ? "light" : "dark"} />
      <Image
        source={isDarkMode ? BACKGROUNDS.dark : BACKGROUNDS.light}
        style={s.background}
        resizeMode="cover"
      />
      <View
        style={[
          s.backgroundShade,
          {
            backgroundColor: isDarkMode
              ? "rgba(10, 8, 12, 0.34)"
              : "rgba(255, 242, 226, 0.34)",
          },
        ]}
      />
      <SafeAreaView
        style={s.safeArea}
        edges={["top", "bottom", "left", "right"]}
      >
        <ScrollView
          contentContainerStyle={[s.screen, { width: contentWidth }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={s.brandBlock}>
            <Text style={[s.brand, { color: accent }]}>NEXTWAIFU</Text>
            <Text style={[s.version, { color: theme.textMuted }]}>
              VISUAL NOVEL / CONFIGURATION
            </Text>
          </View>

          {view === "menu" ? (
            <View style={s.menuView}>
              <View
                style={[
                  s.preview,
                  { borderColor: accent, backgroundColor: theme.surface },
                ]}
              >
                <Image
                  source={resolveAvatar(avatars.timida)}
                  style={s.previewImage}
                  resizeMode="contain"
                />
                <View style={s.previewCopy}>
                  <Text style={[s.previewName, { color: theme.text }]}>
                    {characterName || "Ruika"}
                  </Text>
                  <Text
                    style={[s.previewHint, { color: theme.textMuted }]}
                    numberOfLines={2}
                  >
                    {personality || "Tu compañera virtual"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                accessibilityLabel="Empezar a charlar"
                style={[s.startButton, { backgroundColor: accent }]}
                onPress={handleSave}
                activeOpacity={0.72}
              >
                <Text style={s.startLabel}>EMPEZAR A CHARLAR</Text>
                <Text style={s.startArrow}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity accessibilityLabel="Configurar voz de ElevenLabs" style={[s.menuOption, { borderColor: theme.border, borderLeftColor: accent, backgroundColor: theme.surface }]} onPress={() => setView("voice")} activeOpacity={0.72}>
                <Text style={[s.optionNumber, { color: accent }]}>05</Text>
                <View style={s.optionCopy}>
                  <Text style={[s.optionTitle, { color: theme.text }]}>VOZ</Text>
                  <Text style={[s.optionHint, { color: theme.textMuted }]}>{elevenLabsApiKey && elevenLabsVoiceId ? "ElevenLabs conectada" : "Añade una voz personalizada"}</Text>
                </View>
                <Text style={[s.optionArrow, { color: theme.textMuted }]}>›</Text>
              </TouchableOpacity>

              <Text style={[s.sectionLabel, { color: theme.textMuted }]}>
                PREPARAR PARTIDA
              </Text>
              <TouchableOpacity
                accessibilityLabel="Configurar API Key"
                style={[
                  s.menuOption,
                  {
                    borderColor: theme.border,
                    borderLeftColor: accent,
                    backgroundColor: theme.surface,
                  },
                ]}
                onPress={() => setView("api")}
                activeOpacity={0.72}
              >
                <Text style={[s.optionNumber, { color: accent }]}>01</Text>
                <View style={s.optionCopy}>
                  <Text style={[s.optionTitle, { color: theme.text }]}>
                    API KEY
                  </Text>
                  <Text style={[s.optionHint, { color: theme.textMuted }]}>
                    {canStart ? "Conectada" : "Añade tu conexión Gemini"}
                  </Text>
                </View>
                <Text style={[s.optionArrow, { color: theme.textMuted }]}>
                  ›
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="Configurar avatares"
                style={[
                  s.menuOption,
                  {
                    borderColor: theme.border,
                    borderLeftColor: accent,
                    backgroundColor: theme.surface,
                  },
                ]}
                onPress={() => setView("avatar")}
                activeOpacity={0.72}
              >
                <Text style={[s.optionNumber, { color: accent }]}>02</Text>
                <View style={s.optionCopy}>
                  <Text style={[s.optionTitle, { color: theme.text }]}>
                    AVATAR
                  </Text>
                  <Text style={[s.optionHint, { color: theme.textMuted }]}>
                    Rostros para cada emoción
                  </Text>
                </View>
                <Text style={[s.optionArrow, { color: theme.textMuted }]}>
                  ›
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="Configurar identidad y personalidad"
                style={[
                  s.menuOption,
                  {
                    borderColor: theme.border,
                    borderLeftColor: accent,
                    backgroundColor: theme.surface,
                  },
                ]}
                onPress={() => setView("identity")}
                activeOpacity={0.72}
              >
                <Text style={[s.optionNumber, { color: accent }]}>03</Text>
                <View style={s.optionCopy}>
                  <Text style={[s.optionTitle, { color: theme.text }]}>
                    IDENTIDAD
                  </Text>
                  <Text style={[s.optionHint, { color: theme.textMuted }]}>
                    Identidad, rol y forma de hablar
                  </Text>
                </View>
                <Text style={[s.optionArrow, { color: theme.textMuted }]}>
                  ›
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="Configurar fondo y modo"
                style={[
                  s.menuOption,
                  {
                    borderColor: theme.border,
                    borderLeftColor: accent,
                    backgroundColor: theme.surface,
                  },
                ]}
                onPress={() => setView("background")}
                activeOpacity={0.72}
              >
                <Text style={[s.optionNumber, { color: accent }]}>04</Text>
                <View style={s.optionCopy}>
                  <Text style={[s.optionTitle, { color: theme.text }]}>
                    FONDO
                  </Text>
                  <Text style={[s.optionHint, { color: theme.textMuted }]}>
                    Escena y modo de iluminación
                  </Text>
                </View>
                <Text style={[s.optionArrow, { color: theme.textMuted }]}>
                  ›
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={s.detailView}>
              <TouchableOpacity
                accessibilityLabel="Volver al menú"
                style={s.backButton}
                onPress={() => setView("menu")}
                activeOpacity={0.72}
              >
                <Text style={[s.backText, { color: accent }]}>‹ MENÚ</Text>
              </TouchableOpacity>

              {view === "api" && (
                <View>
                  <Text style={[s.detailTitle, { color: theme.text }]}>
                    API KEY
                  </Text>
                  <Text style={[s.detailHint, { color: theme.textMuted }]}>
                    Conecta tu partida con Google Gemini.
                  </Text>
                  <View style={s.apiRow}>
                    <TextInput
                      accessibilityLabel="Clave API de Gemini"
                      style={[
                        s.textInput,
                        {
                          backgroundColor: theme.surface,
                          borderColor:
                            focusedField === "api" ? accent : theme.border,
                          color: theme.text,
                        },
                        webInputReset,
                      ]}
                      value={apiKey}
                      onChangeText={setApiKey}
                      placeholder="Pega tu API key aquí..."
                      placeholderTextColor={theme.textMuted}
                      secureTextEntry={!showKey}
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() => setFocusedField("api")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <TouchableOpacity
                      accessibilityLabel={
                        showKey ? "Ocultar API Key" : "Mostrar API Key"
                      }
                      style={[
                        s.eyeButton,
                        {
                          borderColor: theme.border,
                          backgroundColor: theme.surface,
                        },
                      ]}
                      onPress={() => setShowKey((current) => !current)}
                      activeOpacity={0.72}
                    >
                      <Text>{showKey ? "🙈" : "👁️"}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {view === "avatar" && (
                <View>
                  <Text style={[s.detailTitle, { color: theme.text }]}>
                    AVATAR
                  </Text>
                  <Text style={[s.detailHint, { color: theme.textMuted }]}>
                    Asigna una imagen a cada estado emocional.
                  </Text>
                  {(Object.keys(EMOTION_LABELS) as WaifuEmotion[]).map(
                    (emotion) => (
                      <View
                        key={emotion}
                        style={[
                          s.avatarRow,
                          {
                            backgroundColor: theme.surface,
                            borderColor: theme.border,
                          },
                        ]}
                      >
                        <Image
                          source={resolveAvatar(avatars[emotion])}
                          style={[s.avatarThumb, { borderColor: accent }]}
                          resizeMode="cover"
                        />
                        <Text style={[s.avatarEmotion, { color: theme.text }]}>
                          {EMOTION_LABELS[emotion]}
                        </Text>
                        <TouchableOpacity
                          accessibilityLabel={`Editar avatar ${EMOTION_LABELS[emotion]}`}
                          style={[
                            s.smallButton,
                            { backgroundColor: theme.border },
                          ]}
                          onPress={() => openAvatarEditor(emotion)}
                          activeOpacity={0.72}
                        >
                          <Text
                            style={[s.smallButtonText, { color: theme.text }]}
                          >
                            EDITAR
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ),
                  )}
                </View>
              )}

              {view === "identity" && (
                <View>
                  <Text style={[s.detailTitle, { color: theme.text }]}>
                    IDENTIDAD
                  </Text>
                  <Text style={[s.detailHint, { color: theme.textMuted }]}>
                    Escribe las instrucciones que definen quién es y cómo se
                    comporta.
                  </Text>
                  <Text style={[s.fieldLabel, { color: theme.textMuted }]}>
                    NOMBRE VISIBLE
                  </Text>
                  <TextInput
                    style={[
                      s.textInput,
                      {
                        backgroundColor: theme.surface,
                        borderColor:
                          focusedField === "name" ? accent : theme.border,
                        color: theme.text,
                      },
                      webInputReset,
                    ]}
                    value={characterName}
                    onChangeText={setCharacterName}
                    placeholder="Ej. Ruika"
                    placeholderTextColor={theme.textMuted}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <Text style={[s.fieldLabel, { color: theme.textMuted }]}>
                    IDENTIDAD CENTRAL
                  </Text>
                  <TextInput
                    style={[
                      s.personalityInput,
                      {
                        backgroundColor: theme.surface,
                        borderColor:
                          focusedField === "identity" ? accent : theme.border,
                        color: theme.text,
                      },
                      webInputReset,
                    ]}
                    value={identity}
                    onChangeText={setIdentity}
                    multiline
                    maxLength={500}
                    placeholder="Ruika es una chica tranquila..."
                    placeholderTextColor={theme.textMuted}
                    onFocus={() => setFocusedField("identity")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <Text
                    style={[
                      s.characterCount,
                      {
                        color:
                          identity.length >= 500 ? accent : theme.textMuted,
                      },
                    ]}
                  >
                    {identity.length}/500 caracteres
                  </Text>
                  <Text style={[s.fieldLabel, { color: theme.textMuted }]}>
                    ROL / PERSONALIDAD
                  </Text>
                  <TextInput
                    style={[
                      s.personalityInput,
                      {
                        backgroundColor: theme.surface,
                        borderColor:
                          focusedField === "personality"
                            ? accent
                            : theme.border,
                        color: theme.text,
                      },
                      webInputReset,
                    ]}
                    value={personality}
                    onChangeText={setPersonality}
                    multiline
                    maxLength={300}
                    placeholder="Tranquila, reservada e inteligente..."
                    placeholderTextColor={theme.textMuted}
                    onFocus={() => setFocusedField("personality")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <Text
                    style={[
                      s.characterCount,
                      {
                        color:
                          personality.length >= 300 ? accent : theme.textMuted,
                      },
                    ]}
                  >
                    {personality.length}/300 caracteres
                  </Text>
                </View>
              )}

              {view === "background" && (
                <View>
                  <Text style={[s.detailTitle, { color: theme.text }]}>
                    FONDO
                  </Text>
                  <Text style={[s.detailHint, { color: theme.textMuted }]}>
                    Elige la escena que acompaña tu historia.
                  </Text>
                  <View style={s.backgroundChoices}>
                    <TouchableOpacity
                      accessibilityLabel="Usar fondo de día"
                      style={[
                        s.backgroundChoice,
                        {
                          borderColor: !isDarkMode ? accent : theme.border,
                          backgroundColor: theme.surface,
                        },
                      ]}
                      onPress={() => isDarkMode && onToggleTheme()}
                      activeOpacity={0.78}
                    >
                      <Image
                        source={BACKGROUNDS.light}
                        style={s.backgroundPreview}
                        resizeMode="cover"
                      />
                      <Text style={[s.backgroundLabel, { color: theme.text }]}>
                        DÍA
                      </Text>
                      <Text
                        style={[
                          s.backgroundStatus,
                          { color: !isDarkMode ? accent : theme.textMuted },
                        ]}
                      >
                        {!isDarkMode ? "ACTIVO" : "CLARO"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      accessibilityLabel="Usar fondo de noche"
                      style={[
                        s.backgroundChoice,
                        {
                          borderColor: isDarkMode ? accent : theme.border,
                          backgroundColor: theme.surface,
                        },
                      ]}
                      onPress={() => !isDarkMode && onToggleTheme()}
                      activeOpacity={0.78}
                    >
                      <Image
                        source={BACKGROUNDS.dark}
                        style={s.backgroundPreview}
                        resizeMode="cover"
                      />
                      <Text style={[s.backgroundLabel, { color: theme.text }]}>
                        NOCHE
                      </Text>
                      <Text
                        style={[
                          s.backgroundStatus,
                          { color: isDarkMode ? accent : theme.textMuted },
                        ]}
                      >
                        {isDarkMode ? "ACTIVO" : "OSCURO"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    accessibilityLabel="Cambiar modo de iluminación"
                    style={[s.modeButton, { backgroundColor: accent }]}
                    onPress={onToggleTheme}
                    activeOpacity={0.72}
                  >
                    <Text style={s.modeButtonText}>
                      CAMBIAR A {isDarkMode ? "DÍA" : "NOCHE"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {view === "voice" && (
                <View>
                  <Text style={[s.detailTitle, { color: theme.text }]}>VOZ</Text>
                  <Text style={[s.detailHint, { color: theme.textMuted }]}>Usa una voz de ElevenLabs para que Ruika hable. Necesitas API Key y Voice ID.</Text>
                  <Text style={[s.fieldLabel, { color: theme.textMuted }]}>ELEVENLABS API KEY</Text>
                  <TextInput accessibilityLabel="API Key de ElevenLabs" style={[s.textInput, { backgroundColor: theme.surface, borderColor: focusedField === "elevenKey" ? accent : theme.border, color: theme.text }, webInputReset]} value={elevenLabsApiKey} onChangeText={setElevenLabsApiKey} placeholder="xi-..." placeholderTextColor={theme.textMuted} secureTextEntry={!showKey} autoCapitalize="none" autoCorrect={false} onFocus={() => setFocusedField("elevenKey")} onBlur={() => setFocusedField(null)} />
                  <Text style={[s.fieldLabel, { color: theme.textMuted }]}>VOICE ID</Text>
                  <TextInput accessibilityLabel="Voice ID de ElevenLabs" style={[s.textInput, { backgroundColor: theme.surface, borderColor: focusedField === "voiceId" ? accent : theme.border, color: theme.text }, webInputReset]} value={elevenLabsVoiceId} onChangeText={setElevenLabsVoiceId} placeholder="ID de tu voz personalizada" placeholderTextColor={theme.textMuted} autoCapitalize="none" autoCorrect={false} maxLength={64} onFocus={() => setFocusedField("voiceId")} onBlur={() => setFocusedField(null)} />
                  <Text style={[s.characterCount, { color: elevenLabsVoiceId.length >= 64 ? accent : theme.textMuted }]}>{elevenLabsVoiceId.length}/64 caracteres</Text>
                  <Text style={[s.voiceHint, { color: theme.textMuted }]}>La API Key se guarda localmente en este prototipo. Para producción conviene usar un backend.</Text>
                </View>
              )}
            </View>
          )}

          {view !== "menu" && (
            <TouchableOpacity
              accessibilityLabel="Guardar y volver al menú"
              style={[s.saveButton, { backgroundColor: accent }]}
              onPress={handleSaveAndReturn}
              activeOpacity={0.72}
            >
              <Text style={s.saveLabel}>GUARDAR Y VOLVER</Text>
            </TouchableOpacity>
          )}
          <Text style={[s.footer, { color: theme.textMuted }]}>
            NEXTWAIFU // CAPÍTULO 01
          </Text>
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={Boolean(editingEmotion)}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingEmotion(null)}
      >
        <TouchableWithoutFeedback onPress={() => setEditingEmotion(null)}>
          <View style={[s.modalOverlay, { backgroundColor: theme.overlay }]}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  s.modalCard,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <Text style={[s.modalTitle, { color: accent }]}>
                  IMAGEN /{" "}
                  {editingEmotion
                    ? EMOTION_LABELS[editingEmotion].toUpperCase()
                    : ""}
                </Text>
                <TextInput
                  style={[
                    s.textInput,
                    {
                      backgroundColor: theme.surfaceAlt,
                      borderColor:
                        focusedField === "avatar" ? accent : theme.border,
                      color: theme.text,
                    },
                    webInputReset,
                  ]}
                  value={urlInput}
                  onChangeText={setUrlInput}
                  placeholder="https://ejemplo.com/imagen.png"
                  placeholderTextColor={theme.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setFocusedField("avatar")}
                  onBlur={() => setFocusedField(null)}
                />
                <View style={s.modalActions}>
                  <TouchableOpacity
                    style={[s.modalButton, { borderColor: theme.border }]}
                    onPress={() => setEditingEmotion(null)}
                  >
                    <Text
                      style={[s.modalButtonText, { color: theme.textMuted }]}
                    >
                      CANCELAR
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      s.modalButton,
                      { backgroundColor: accent, borderColor: accent },
                    ]}
                    onPress={confirmAvatar}
                  >
                    <Text style={s.modalConfirmText}>CONFIRMAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  backgroundShade: { ...StyleSheet.absoluteFillObject },
  safeArea: { flex: 1, alignItems: "center" },
  screen: { flexGrow: 1, justifyContent: "center", paddingVertical: 28 },
  brandBlock: { alignItems: "center", marginBottom: 24 },
  brand: { fontSize: 30, fontWeight: "900", letterSpacing: 4 },
  version: { fontSize: 10, letterSpacing: 1.5, marginTop: 6 },
  menuView: { width: "100%" },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },
  previewImage: { width: 82, height: 82 },
  previewCopy: { flex: 1, marginLeft: 12 },
  previewName: { fontSize: 20, fontWeight: "800" },
  previewHint: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  startButton: {
    minHeight: 58,
    borderRadius: 12,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    boxShadow: "0px 5px 10px rgba(200,121,82,0.3)",
    elevation: 5,
  },
  startLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  startArrow: { color: "#FFFFFF", fontSize: 28, fontWeight: "300" },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  menuOption: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderLeftWidth: 3,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  optionNumber: { width: 34, fontSize: 11, fontWeight: "800" },
  optionCopy: { flex: 1 },
  optionTitle: { fontSize: 14, fontWeight: "800", letterSpacing: 1 },
  optionHint: { fontSize: 12, marginTop: 3 },
  optionArrow: { fontSize: 26, paddingLeft: 8 },
  detailView: { width: "100%" },
  backButton: { alignSelf: "flex-start", paddingVertical: 8, marginBottom: 12 },
  backText: { fontSize: 12, fontWeight: "800", letterSpacing: 1 },
  detailTitle: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 6,
  },
  detailHint: { fontSize: 13, lineHeight: 19, marginBottom: 20 },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
    marginTop: 18,
    marginBottom: 7,
  },
  characterCount: { alignSelf: "flex-end", fontSize: 10, marginTop: 5 },
  apiRow: { flexDirection: "row", gap: 8 },
  textInput: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  personalityInput: {
    minHeight: 110,
    textAlignVertical: "top",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    lineHeight: 20,
  },
    voiceHint: {
      fontSize: 11,
      lineHeight: 16,
      marginTop: 12,
      fontStyle: "italic",
    },
  eyeButton: {
    width: 48,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarRow: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
  },
  avatarThumb: { width: 48, height: 48, borderRadius: 24, borderWidth: 2 },
  backgroundChoices: { flexDirection: "row", gap: 10 },
  backgroundChoice: { flex: 1, borderWidth: 2, borderRadius: 12, padding: 6 },
  backgroundPreview: { width: "100%", height: 132, borderRadius: 8 },
  backgroundLabel: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 8,
  },
  backgroundStatus: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginTop: 3,
  },
  modeButton: {
    minHeight: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  modeButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  avatarEmotion: { flex: 1, fontSize: 14, fontWeight: "700", marginLeft: 12 },
  smallButton: { borderRadius: 9, paddingHorizontal: 10, paddingVertical: 9 },
  smallButtonText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.8 },
  saveButton: {
    minHeight: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  saveLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 480,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  modalActions: { flexDirection: "row", gap: 8, marginTop: 14 },
  modalButton: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.8 },
  modalConfirmText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  footer: {
    textAlign: "center",
    fontSize: 10,
    letterSpacing: 1.2,
    marginTop: 24,
  },
});
