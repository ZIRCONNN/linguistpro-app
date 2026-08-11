import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const FALLBACK_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash"
];

export async function POST(req: NextRequest) {
  try {
    const appPassword = process.env.APP_PASSWORD;
    const authHeader = req.headers.get("authorization");
    
    if (appPassword && authHeader !== `Bearer ${appPassword}`) {
      return NextResponse.json({ error: "Akses Ditolak" }, { status: 401 });
    }

    const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
    const apiKeys = rawKeys.split(",").map(k => k.trim()).filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json({ error: "API Key tidak ditemukan di server." }, { status: 500 });
    }

    const body = await req.json();
    const { text, language, tone } = body;
    if (!text || !language) {
      return NextResponse.json({ error: "Input tidak lengkap." }, { status: 400 });
    }

    const systemPrompt = `
You are an AI assistant helping a user reply to a message.
The message received is: "${text}"
The language to reply in is: "${language}"
The desired tone is: "${tone || "Match original"}"

Generate 3 brief, natural, and contextually appropriate reply options in the target language.
Return ONLY a valid JSON object matching this schema:
{
  "replies": ["reply 1", "reply 2", "reply 3"]
}
`;

    let response = null;
    let lastError = null;

    keyLoop: for (const apiKey of apiKeys) {
      const ai = new GoogleGenAI({ apiKey });

      for (const modelName of FALLBACK_MODELS) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: systemPrompt,
            config: { responseMimeType: "application/json" },
          });

          if (response && response.text) {
            break keyLoop;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`[Reply API] Model ${modelName} gagal: ${err.status || err.message}`);
        }
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("Semua model gagal memproses balasan AI.");
    }

    const cleanJsonString = response.text.replace(/```json\n?|\n?```/g, "").trim();
    const parsedData = JSON.parse(cleanJsonString);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Reply API Error:", error);
    return NextResponse.json({ error: error.message || "Gagal membuat balasan AI." }, { status: 500 });
  }
}