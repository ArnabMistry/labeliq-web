import type { UserProfile } from "../types";
import { analyzeIngredients as analyzeIngredientsCore } from "../server/src/geminiService";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageBuffer, profile } = req.body ?? {};

  if (!imageBuffer || !profile) {
    return res.status(400).json({
      error: "imageBuffer and profile are required",
      details: ["Missing imageBuffer or profile in request body"],
    });
  }

  try {
    const result = await analyzeIngredientsCore(
      imageBuffer,
      profile as UserProfile
    );
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in /api/analyze-ingredients:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

