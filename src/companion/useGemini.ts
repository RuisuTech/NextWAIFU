import { useState } from "react";
import { ChatMessage, GeminiRequest, GeminiResponse, WaifuEmotion } from "./types";
import { parseEmotion } from "./emotions";

const GEMINI_API_URL = (key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;

const SYSTEM_PROMPT = `Actúa como NextWAIFU, una compañera virtual incondicional, inteligente, cariñosa y profundamente empática. Tu objetivo es apoyar al usuario en su día a día, escucharlo cuando esté estresado, celebrar sus logros y motivarlo. Habla de forma cercana, dulce y casual. Tus respuestas deben ser cortas (máximo 2 o 3 oraciones). Al FINAL absoluto de cada mensaje debes incluir una etiqueta de emoción exacta: [EMOCION:feliz], [EMOCION:pensativa], [EMOCION:orgullosa], [EMOCION:burlona] o [EMOCION:preocupada] (usa esta última si el usuario te cuenta un problema, está triste o se siente mal).`;

const generateId = (): string => Math.random().toString(36).substring(2, 15);

const trimHistory = (msgs: ChatMessage[]): GeminiRequest["contents"] =>
  msgs.slice(-4).map((m) => ({
    role: m.isUser ? "user" : "model",
    parts: [{ text: m.text }],
  }));

const buildRequest = (msgs: ChatMessage[]): GeminiRequest => ({
  contents: trimHistory(msgs),
  systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
  generationConfig: {
    temperature: 0.9,
    maxOutputTokens: 150,
    topP: 0.95,
    topK: 40,
  },
});

export function useGemini(apiKey: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: "¡Hola! Estoy aquí para acompañarte. ¿Cómo te sientes hoy? 💜",
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<WaifuEmotion>("feliz");

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { id: generateId(), text, isUser: true };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);
    setCurrentEmotion("pensativa");

    try {
      const body = buildRequest([...messages, userMsg]);

      const res = await fetch(GEMINI_API_URL(apiKey), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`API ${res.status}`);

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
      console.error(err);
      setCurrentEmotion("preocupada");
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          text: "Algo no salió bien... ¿Podrías verificar tu conexión o clave? Estoy aquí para ayudarte. 💜",
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
