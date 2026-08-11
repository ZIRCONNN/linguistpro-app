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
      return NextResponse.json({ error: "API Key tidak ditemukan" }, { status: 500 });
    }

    const { word, context, language } = await req.json();
    if (!word) return NextResponse.json({ error: "Kata tidak valid." }, { status: 400 });

    const systemPrompt = `
You are a linguistic dictionary. Analyze the word/phrase: "${word}" in the language: "${language}".
Context sentence it was used in: "${context}".

Return ONLY a valid JSON:
{
  "definition": "string (brief definition in context)",
  "formal_synonyms": ["string", "string"],
  "casual_synonyms": ["string", "string"],
  "usage_example": "string"
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
        }
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("Gagal memuat kamus.");
    }

    const cleanJsonString = response.text.replace(/```json\n?|\n?```/g, "").trim();
    return NextResponse.json(JSON.parse(cleanJsonString));
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal memuat kamus." }, { status: 500 });
  }
}