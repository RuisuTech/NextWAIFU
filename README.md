# NextWAIFU

Compañera virtual con IA que responde con empatía y cambia de expresión según la emoción. Construida con React Native (Expo) y Google Gemini.

## Características

- Chat con Google Gemini 3.5 Flash Lite
- Avatar que cambia según la emoción detectada (6 emociones)
- Modo oscuro / claro (por defecto oscuro)
- Opcionalmente integra ElevenLabs para voz natural (con fallback a voz del sistema)
- Configuración personalizable: nombre, identidad y personalidad de la waifu
- Accesos rápidos desde el chat: cambiar API key, tema y voz
- La configuración se conserva al volver al menú (campos precargados)
- El nombre de la waifu se muestra en el encabezado del chat
- API key protegida mediante proxy (Edge Function en Vercel)
- Desplegable en web (Vercel) y Android (EAS Build)

### Toolbar del chat

| Botón | Función |
|-------|---------|
| MENU | Volver al setup |
| LOGS | Ver historial de conversación |
| NOCHE / DÍA | Cambiar tema |
| IA | Cambiar API key de Gemini |
| VOZ | Configurar ElevenLabs |

## Requisitos

- Node.js 18+
- npm
- Una **API Key de Google Gemini** (gratis en [Google AI Studio](https://aistudio.google.com))

## Instalación

```bash
git clone https://github.com/tu-usuario/NextWAIFU.git
cd NextWAIFU
npm install
npx expo start
```

## Desarrollo local

Para probar localmente con el proxy de Gemini:

```bash
# Terminal 1: proxy
npx vercel dev

# Terminal 2: app
npx expo start --web
```

Crear un archivo `.env` en la raíz:

```
EXPO_PUBLIC_GEMINI_PROXY_URL=http://localhost:3000/api/gemini
```

## Despliegue

### Web (Vercel)

```bash
npx expo export --platform web
npx vercel --prod
```

En producción la URL del proxy es `https://nextwaifu.vercel.app/api/gemini` (configurada por defecto en `src/config.ts`).

### Android

```bash
# APK (testing)
eas build --profile preview --platform android

# AAB (Play Store)
eas build --profile production --platform android
```

## Estructura

```
api/
  gemini.ts            # Edge Function: proxy a Gemini API
app/
  _layout.tsx          # Root layout
  (tabs)/
    index.tsx          # Pantalla principal
src/
  companion/
    types.ts           # Tipos y constantes
    emotions.ts        # Parser de emociones
    useGemini.ts       # Hook de chat con Gemini
    useElevenLabs.ts   # Hook de voz con ElevenLabs
  features/
    chat/              # Pantalla de chat
    configuration/     # Pantalla de setup
    customization/     # Menú de opciones
  shared/
    storage.ts         # Persistencia con AsyncStorage
    theme.ts           # Paletas de colores
    config.ts          # URL del proxy
assets/
  images/              # Iconos y splash
  images/avatars/      # Avatares por emoción y fondos
```

## Stack

- React Native 0.81 + Expo SDK 54
- Expo Router v6
- TypeScript 5.9
- Google Gemini 3.5 Flash Lite
- ElevenLabs (opcional)

## Licencia

MIT
