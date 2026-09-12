export const config = { runtime: "edge" };

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  const userApiKey = req.headers.get("x-api-key");
  if (!userApiKey?.trim()) {
    return Response.json(
      { error: { message: "API key requerida en header x-api-key" } },
      { status: 401, headers: CORS_HEADERS },
    );
  }

  const body = await req.json();

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${encodeURIComponent(userApiKey.trim())}`;

  const geminiRes = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await geminiRes.json();
  return Response.json(data, { status: geminiRes.status, headers: CORS_HEADERS });
}
