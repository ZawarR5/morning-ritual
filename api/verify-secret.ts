export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { password } = req.body;
  const secretPassword = process.env.SECRET_PASSWORD;

  if (!secretPassword) {
    return res.status(500).json({ success: false, error: "Server not configured" });
  }

  if (password === secretPassword) {
    return res.json({ success: true });
  }

  return res.json({ success: false });
}
