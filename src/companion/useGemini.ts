import { useEffect, useRef, useState } from "react";
import { GEMINI_PROXY_URL } from "../config";
import { loadMessages, saveMessages } from "../shared/storage";
import { parseEmotion } from "./emotions";
import {
    ChatMessage,
    GeminiRequest,
    GeminiResponse,
    WaifuEmotion,
} from "./types";

const SYSTEM_PROMPT = `Sigue la identidad y el rol indicados. Responde primero al estado de ánimo, recuerda solo detalles reales y no inventes recuerdos. Sé breve, 2-3 frases. Devuelve únicamente el mensaje que leerá el usuario: no escribas análisis, encabezados, markdown ni campos como Mood, Analysis, Response o User. Termina siempre con una etiqueta exacta: [EMOCION:emocionada], [EMOCION:molesta], [EMOCION:pensativa], [EMOCION:sorprendida], [EMOCION:timida] o [EMOCION:triste].`;

const generateId = (): string => Math.random().toString(36).substring(2, 15);
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const requestGemini = async (
  url: string,
  body: GeminiRequest,
  apiKey: string,
): Promise<Response> => {
  for (let attempt = 0; attempt <= 2; attempt += 1) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    if (
      response.ok ||
      !RETRYABLE_STATUS_CODES.has(response.status) ||
      attempt === 2
    ) {
      return response;
    }

    await wait(800 * 2 ** attempt);
  }

  throw new Error("No se pudo contactar con Gemini");
};

const trimHistory = (msgs: ChatMessage[]): GeminiRequest["contents"] =>
  msgs
    .filter((m) => m.id !== "welcome")
    .slice(-20)
    .map((m) => ({
      role: m.isUser ? "user" : "model",
      parts: [{ text: m.text }],
    }));

const buildRequest = (
  msgs: ChatMessage[],
  name?: string,
  identity?: string,
  personality?: string,
): GeminiRequest => ({
  contents: trimHistory(msgs),
  systemInstruction: {
    parts: [
      {
        text: `${SYSTEM_PROMPT}\nNombre: ${(name?.trim() || "Ruika").slice(0, 40)}.\nIdentidad: ${(identity?.trim() || "Ruika es tranquila, inteligente y reservada.").slice(0, 500)}\nRol: ${(personality?.trim() || "Tranquila, tierna y competitiva.").slice(0, 300)}`,
      },
    ],
  },
  generationConfig: {
    temperature: 0.9,
    maxOutputTokens: 150,
    topP: 0.95,
    topK: 40,
  },
});

export function useGemini(
  apiKey: string,
  name?: string,
  identity?: string,
  personality?: string,
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<WaifuEmotion>("timida");
  const loaded = useRef(false);

  useEffect(() => {
    loadMessages().then((saved) => {
      if (saved.length > 0) {
        setMessages(saved);
      } else {
        setMessages([
          {
            id: "welcome",
            text: "¡Hola! Estoy aquí para acompañarte. ¿Cómo te sientes hoy? 💜",
            isUser: false,
          },
        ]);
      }
      loaded.current = true;
    });
  }, []);

  useEffect(() => {
    if (loaded.current && messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { id: generateId(), text, isUser: true };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);
    setCurrentEmotion("pensativa");

    try {
      const body = buildRequest(
        [...messages, userMsg],
        name,
        identity,
        personality,
      );

      const res = await requestGemini(GEMINI_PROXY_URL, body, apiKey.trim());

      if (!res.ok) {
        const errorBody = await res.text();
        let detail = "Respuesta no válida del servicio";
        try {
          const parsed = JSON.parse(errorBody) as {
            error?: { message?: string };
          };
          detail = parsed.error?.message || detail;
        } catch {
          if (errorBody.trim()) detail = errorBody.slice(0, 180);
        }
        throw new Error(`Gemini API ${res.status}: ${detail}`);
      }

      const data: GeminiResponse = await res.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!raw) throw new Error("Empty response");

      const { cleanText, emotion } = parseEmotion(raw);
      setCurrentEmotion(emotion);
      setMessages((prev) => [
        ...prev,
        { id: generateId(), text: cleanText, isUser: false },
      ]);
    } catch (err) {
      console.error("Gemini request failed:", err);
      const errorText = err instanceof Error ? err.message : "";
      let userMessage: string;

      if (/401|403|invalid.*key|API key/i.test(errorText)) {
        userMessage = "Tu API key no es válida. Verifícala en la configuración.";
      } else if (/429|rate.?limit|too many/i.test(errorText)) {
        userMessage = "Demasiadas peticiones. Espera unos segundos e intenta de nuevo.";
      } else if (/503|502|500|504|high demand|ocupado|unavailable/i.test(errorText)) {
        userMessage = "El servicio está ocupado ahora mismo. Esperemos un momento.";
      } else if (/Failed to fetch|network|ECONNREFUSED|timeout/i.test(errorText)) {
        userMessage = "No se pudo conectar. Revisa tu conexión a internet.";
      } else {
        userMessage = "Algo no salió bien. Verifica tu conexión o clave.";
      }

      setCurrentEmotion("triste");
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          text: `${userMessage} Estoy aquí para ayudarte. 💜`,
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    inputText,
    setInputText,
    isLoading,
    currentEmotion,
    sendMessage,
  };
}
