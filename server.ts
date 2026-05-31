import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client to prevent crash if key is loaded late or missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      console.warn("GEMINI_API_KEY is missing or set to placeholder. Server will fallback to smart local templates.");
      return null;
    }
    try {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI client:", e);
      return null;
    }
  }
  return aiClient;
}

// Fallback pool of beautiful, inspiring quotes if API key is not configured of if offline
const FALLBACKS = [
  { text: "The sun rises not just for the world, but for the greatness within you.", category: "Vibrant", emoji: "✨" },
  { text: "Your thoughts are seeds. Plant them with care in the fertile soil of the morning.", category: "Serene", emoji: "🌌" },
  { text: "True power is found in the stillness before the storm. Be the calm center.", category: "Steady", emoji: "⚖️" },
  { text: "The way we start our day determines the quality of our life. Intentionality is the compass of the soul.", category: "Vibrant", emoji: "🌅" },
  { text: "Consistency is the silent engine of greatness.", category: "Steady", emoji: "🏔️" },
  { text: "Nature does not hurry, yet everything is accomplished.", category: "Serene", emoji: "🌿" }
];

// Server-side AI endpoint to generate custom morning manifestation quotes using Gemini
app.post("/api/manifestation", async (req: express.Request, res: express.Response): Promise<any> => {
  const { notes, mindset } = req.body;

  const client = getGeminiClient();
  if (!client) {
    // Elegant fallback simulation matching the requested mindset category
    let category: "Vibrant" | "Steady" | "Serene" = "Serene";
    if (mindset === "Creative Fire" || mindset === "Unstoppable Confidence" || mindset === "Vitality Rush") {
      category = "Vibrant";
    } else if (mindset === "Zen Focus") {
      category = "Steady";
    }

    const filtered = FALLBACKS.filter(f => f.category === category);
    const selected = filtered[Math.floor(Math.random() * filtered.length)] || FALLBACKS[0];

    // Modify a little bit based on user notes if provided
    let responseText = selected.text;
    if (notes && notes.trim().length > 0) {
      responseText = `Rise with focus on ${notes.trim()}. ${selected.text}`;
    }

    return res.json({
      success: true,
      text: responseText,
      category: selected.category,
      emoji: selected.emoji,
      isFallback: true
    });
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
}
`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The crafted morning quote" },
            category: { 
              type: Type.STRING, 
              enum: ["Vibrant", "Steady", "Serene"],
              description: "The mood category of the quote" 
            },
            emoji: { type: Type.STRING, description: "A single appropriate emoji" }
          },
          required: ["text", "category", "emoji"]
        }
      }
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error("Empty response from Gemini model");
    }

    const parsed = JSON.parse(text);
    return res.json({
      success: true,
      text: parsed.text,
      category: parsed.category,
      emoji: parsed.emoji,
      isFallback: false
    });
  } catch (error: any) {
    console.error("Gemini manifestation API error:", error);
    // Graceful error fallback
    const selected = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    return res.json({
      success: true,
      text: selected.text,
      category: selected.category,
      emoji: selected.emoji,
      error: error.message,
      isFallback: true
    });
  }
});

// Setup Vite & static serving
async function setupServer() {
  // Serve static files (audio, images) with range request support
  app.use(express.static(path.join(process.cwd(), 'public'), {
    acceptRanges: true,
    cacheControl: false,
  }));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

setupServer();
