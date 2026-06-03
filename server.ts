import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { getQuoteForMindset } from "./src/quotes";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());

app.post("/api/manifestation", async (req: express.Request, res: express.Response): Promise<any> => {
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
});

async function setupServer() {
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
