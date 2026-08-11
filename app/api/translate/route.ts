import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const FALLBACK_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-3-flash",
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
      return NextResponse.json({ error: "API Key tidak ditemukan di server" }, { status: 500 });
    }

    const body = await req.json();
    const { text, targetLanguage, targetRegister } = body;
    if (!text || !targetLanguage) {
      return NextResponse.json({ error: "Input tidak lengkap." }, { status: 400 });
    }

    // UPDATE: Menambahkan "original_romanization" ke schema
    const systemPrompt = `
Act as an expert linguist. Translate the input text.
Return ONLY a valid JSON object matching this schema:
{
  "detected_language": "string",
  "original_romanization": "string (Pinyin/Romaji/etc ONLY if the INPUT text is non-alphabetic, otherwise null)",
  "grammar_check": {
    "has_errors": boolean,
    "corrected_text": "string",
    "feedback": "string"
  },
  "translation": {
    "translated_text": "string",
    "romanization": "string (Pinyin/Romaji/etc ONLY if the TARGET text is non-alphabetic, otherwise null)",
    "iso_language_code": "string",
    "explanation": "string"
  }
}

Input: "${text}"
Target: "${targetLanguage}"
Register: "${targetRegister || "Match original"}"
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
          console.warn(`Model ${modelName} terlewati: ${err.status || err.message}`);
        }
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("Semua model cadangan gagal.");
    }

    const cleanJsonString = (response.text || "{}").replace(/```json\n?|\n?```/g, "").trim();
    return NextResponse.json(JSON.parse(cleanJsonString));

  } catch (error: any) {
    return NextResponse.json(
      { error: "Gagal memproses terjemahan: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}