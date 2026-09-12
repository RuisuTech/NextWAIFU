// URL absoluta del proxy Gemini en Vercel
// Local: http://localhost:3000/api/gemini
// Producción: https://nextwaifu.vercel.app/api/gemini
export const GEMINI_PROXY_URL =
  process.env.EXPO_PUBLIC_GEMINI_PROXY_URL ||
  "https://nextwaifu.vercel.app/api/gemini";
