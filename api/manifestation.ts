// Hardcoded Gemini API key for serverless use (add to Vercel env vars if possible later)
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyC9-qbjjhk9ME_NDXAL9VDqRde00_vwUAM";

import { getQuoteForMindset } from "../src/quotes";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { notes, mindset } = req.body;
  const quote = getQuoteForMindset(mindset);

  let text = quote.text;
  if (notes?.trim()) {
    text = `Rise with focus on ${notes.trim()}. ${quote.text}`;
  }

  return res.json({
    success: true,
    text,
    category: quote.category,
    emoji: quote.emoji,
    isFallback: false,
  });
}
