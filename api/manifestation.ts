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
