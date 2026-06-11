import crypto from "crypto";
import path from "path";
import fs from "fs";

const VALID_HASH = "9e5683f11231694265d32c2e60e5975dd88833e5776b58e42a1482c782378839";

const MIME_TYPES: Record<string, string> = {
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".mp3": "audio/mpeg",
};

export default async function handler(req: any, res: any) {
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
}
