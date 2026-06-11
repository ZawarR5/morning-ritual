import crypto from "crypto";

const VALID_HASH = "9e5683f11231694265d32c2e60e5975dd88833e5776b58e42a1482c782378839";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

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
}
