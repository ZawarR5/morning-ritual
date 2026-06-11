import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { getQuoteForMindset } from "./src/quotes";

const VALID_HASH = "9e5683f11231694265d32c2e60e5975dd88833e5776b58e42a1482c782378839";

const MIME_TYPES: Record<string, string> = {
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".mp3": "audio/mpeg",
};

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());

app.post("/api/verify-secret", (req: express.Request, res: express.Response) => {
  const { hash } = req.body;
  if (!hash || typeof hash !== "string") {
    return res.json({ success: false });
  }
  if (hash === VALID_HASH) {
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    const hmac = crypto.createHmac("sha256", VALID_HASH).update(String(expiry)).digest("hex");
    const token = `${expiry}.${hmac}`;
    return res.json({ success: true, token });
  }
  return res.json({ success: false });
});

app.get("/api/secret-asset", (req: express.Request, res: express.Response) => {
  const { file, token } = req.query;
  if (!file || !token) {
    return res.status(400).json({ success: false, error: "Missing file or token" });
  }
  const [expiryStr, hmac] = (token as string).split(".");
  if (!expiryStr || !hmac) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
  if (Date.now() > parseInt(expiryStr, 10)) {
    return res.status(401).json({ success: false, error: "Token expired" });
  }
  const expectedHmac = crypto.createHmac("sha256", VALID_HASH).update(expiryStr).digest("hex");
  if (hmac !== expectedHmac) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
  const sanitized = path.basename(file as string);
  const filePath = path.join(process.cwd(), "private-assets", "secret", sanitized);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: "File not found" });
  }
  const ext = path.extname(sanitized).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const data = fs.readFileSync(filePath);
  res.setHeader("Content-Type", contentType);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "private, max-age=3600");
  return res.send(data);
});

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
