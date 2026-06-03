import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const FALLBACKS = [
  { text: "The sun rises not just for the world, but for the greatness within you.", category: "Vibrant", emoji: "✨" },
  { text: "Your thoughts are seeds. Plant them with care in the fertile soil of the morning.", category: "Serene", emoji: "🌌" },
  { text: "True power is found in the stillness before the storm. Be the calm center.", category: "Steady", emoji: "⚖️" },
  { text: "The way we start our day determines the quality of our life. Intentionality is the compass of the soul.", category: "Vibrant", emoji: "🌅" },
  { text: "Consistency is the silent engine of greatness.", category: "Steady", emoji: "🏔️" },
  { text: "Nature does not hurry, yet everything is accomplished.", category: "Serene", emoji: "🌿" },
];

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      return null;
    }
    try {
      aiClient = new GoogleGenAI({ apiKey });
    } catch {
      return null;
    }
  }
  return aiClient;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { notes, mindset } = req.body;
  const client = getGeminiClient();

  if (!client) {
    let category: "Vibrant" | "Steady" | "Serene" = "Serene";
    if (mindset === "Creative Fire" || mindset === "Unstoppable Confidence" || mindset === "Vitality Rush") {
      category = "Vibrant";
    } else if (mindset === "Zen Focus") {
      category = "Steady";
    }
    const filtered = FALLBACKS.filter((f) => f.category === category);
    const selected = filtered[Math.floor(Math.random() * filtered.length)] || FALLBACKS[0];
    const responseText = notes?.trim()
      ? `Rise with focus on ${notes.trim()}. ${selected.text}`
      : selected.text;
    return res.json({ success: true, text: responseText, category: selected.category, emoji: selected.emoji, isFallback: true });
  }

  try {
    const prompt = `You are an expert wellness guide, zen master, and motivational philosopher. 
Generate a morning manifestation quote or intent that fits perfectly inside a premium morning ritual dashboard.
The user's active mindset is: "${mindset || "Deep Calm"}".
The user's custom thoughts, reflections, or goals for today are: "${notes || "a peaceful and deliberate start"}".

Instructions:
1. Keep the quote beautiful, inspiring, and concise (under 25 words).
2. Maintain strong calm authority, reassuring wisdom, and editorial elegance.
3. Select an appropriate category out of: "Vibrant" (energetic, motivation, fire), "Steady" (discipline, routine, resilience), or "Serene" (calmness, mindfulness, peace).
4. Select one single appropriate emoji matching this morning aura.

Return the result in this exact JSON structure:
{
  "text": "The crafted morning quote",
  "category": "Vibrant" | "Steady" | "Serene",
  "emoji": "✨"
}`;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The crafted morning quote" },
            category: { type: Type.STRING, enum: ["Vibrant", "Steady", "Serene"], description: "The mood category of the quote" },
            emoji: { type: Type.STRING, description: "A single appropriate emoji" },
          },
          required: ["text", "category", "emoji"],
        },
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error("Empty response from Gemini model");

    const parsed = JSON.parse(text);
    return res.json({ success: true, text: parsed.text, category: parsed.category, emoji: parsed.emoji, isFallback: false });
  } catch (error: any) {
    const selected = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    return res.json({ success: true, text: selected.text, category: selected.category, emoji: selected.emoji, error: error.message, isFallback: true });
  }
}
