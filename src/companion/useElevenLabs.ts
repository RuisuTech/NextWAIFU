import { useAudioPlayer } from "expo-audio";
import { useCallback, useEffect } from "react";

const ELEVENLABS_URL = (voiceId: string) =>
  `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`;

const blobToDataUri = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo preparar el audio"));
    reader.readAsDataURL(blob);
  });

export function useElevenLabs(apiKey?: string, voiceId?: string) {
  const player = useAudioPlayer(null);

  const stop = useCallback(() => {
    player.pause();
    player.seekTo(0);
  }, [player]);

  const speak = useCallback(async (text: string) => {
    if (!apiKey?.trim() || !voiceId?.trim() || !text.trim()) return false;

    const response = await fetch(ELEVENLABS_URL(voiceId.trim()), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey.trim(),
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.42,
          similarity_boost: 0.78,
          style: 0.28,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      if (response.status === 402) {
        throw new Error("ElevenLabs requiere un plan de pago para usar esta voz mediante la API. Se usará la voz local.");
      }
      throw new Error(`ElevenLabs ${response.status}: ${detail.slice(0, 180)}`);
    }

    const audioUri = await blobToDataUri(await response.blob());
    player.replace(audioUri);
    player.play();
    return true;
  }, [apiKey, player, voiceId]);

  useEffect(() => () => stop(), [stop]);

  return { speak, stop };
}
