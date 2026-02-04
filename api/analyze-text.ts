import type { UserProfile } from "../types";
import { analyzeText as analyzeTextCore } from "../server/src/geminiService";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, profile } = req.body ?? {};

  if (!text || !profile) {
    return res.status(400).json({
      error: "text and profile are required",
      details: ["Missing text or profile in request body"],
    });
  }

  try {
    const result = await analyzeTextCore(text, profile as UserProfile);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in /api/analyze-text:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

