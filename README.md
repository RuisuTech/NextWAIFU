# NextWAIFU 💜

Compañera virtual empática y emocional impulsada por Google Gemini. Una app móvil built with React Native (Expo) y TypeScript que combina un sistema de avatares reactivos con personalización visual dinámica.

## Características

- **Gemini 2.5 Flash** — Chat con IA usando el modelo más reciente de Google
- **Avatares reactivos** — La imagen de tu WAIFU cambia según la emoción detectada en cada respuesta
- **5 emociones** — Feliz, Pensativa, Orgullosa, Burlona, Preocupada
- **Modo Oscuro / Claro** — Tema intercambiable con persistencia local
- **4 colores de acento** — Morado, Rosa, Azul, Verde (se aplican en tiempo real)
- **Configuración persistente** — API key, avatares y preferencias se guardan con AsyncStorage
- **Sistema de prompts sentimental** — La IA responde con empatía, cariño y cercanía

## Arquitectura

```
src/
  companion/          # Lógica del modelo y emociones
    types.ts          # WaifuEmotion, AppConfig, Gemini*, ThemeColors
    emotions.ts       # Regex parser de etiquetas [EMOCION:...]
    useGemini.ts      # Hook: envía solo los últimos 4 mensajes al API
  shared/             # Servicios y utilidades
    storage.ts        # AsyncStorage: config y tema
    theme.ts          # Paletas DARK/LIGHT y colores de acento
  features/           # Componentes por feature
    configuration/    # Pantalla de setup inicial
    chat/             # Pantalla principal con avatar + burbujas
    customization/    # Modal de opciones (tema, color, ajustes)
app/                  # Expo Router (punto de entrada)
```

## Requisitos

- Node.js 18+
- npm o yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Una **API Key de Google Gemini** (gratis en [Google AI Studio](https://aistudio.google.com))

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/NextWAIFU.git
cd NextWAIFU

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npx expo start
```

## Uso

1. Al abrir la app verás la pantalla de **Setup**
2. Pega tu **Gemini API Key** en el campo correspondiente
3. (Opcional) Cambia los avatares de las emociones pegando URLs de imágenes
4. Toca **"Empezar a charlar 💬"**
5. Usa el botón ⚙️ para acceder al menú de opciones:
   - Ajustar NextWAIFU (volver al setup)
   - Cambiar tema (Oscuro / Claro)
   - Seleccionar color de acento

## Despliegue

### Web (Vercel)

El proyecto ya viene configurado con `vercel.json`. Para desplegar:

```bash
# 1. Exportar la versión web estática
npx expo export --platform web

# 2. Desplegar en Vercel (requiere CLI de Vercel)
npx vercel --prod
```

> La configuración de Vercel incluye rewrites para SPA, headers de seguridad y build automático.

### Android (EAS Build)

Para compilar la app de Android localmente necesitas [Expo CLI](https://docs.expo.dev/eas/cli/):

```bash
# 1. Instalar EAS CLI (si no lo tienes)
npm install -g eas-cli

# 2. Autenticarte con tu cuenta de Expo
eas login

# 3. Configurar el proyecto (solo la primera vez)
eas build:configure
```

## Descarga

### Android — APK (Testing / Distribución interna)

Genera un `.apk` para instalar directamente en dispositivos Android sin pasar por la Play Store:

```bash
eas build --profile preview --platform android
```

Al finalizar, EAS te proporcionará un **enlace de descarga** del APK que podrás abrir en tu dispositivo Android.

### Android — AAB (Google Play Store)

Genera un `.aab` (app bundle) listo para subir a la Play Console:

```bash
eas build --profile production --platform android
```

### Web

La versión web estática está desplegada y accesible directamente desde el navegador. Si tienes acceso a Vercel, accede desde tu dashboard con `npx vercel --prod`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npx expo start` | Iniciar servidor de desarrollo |
| `npx expo start --android` | Abrir en Android |
| `npx expo start --ios` | Abrir en iOS |
| `npx expo start --web` | Abrir en navegador |
| `npm run lint` | Ejecutar ESLint |

## Stack

- **Runtime:** React Native 0.81 + Expo SDK 54
- **Routing:** Expo Router v6
- **Language:** TypeScript 5.9 (strict)
- **API:** Google Gemini 2.5 Flash (REST)
- **Persistencia:** @react-native-async-storage/async-storage

## Licencia

MIT
