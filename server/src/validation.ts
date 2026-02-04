import type { Request, Response, NextFunction } from "express";

export function validateAnalyzeIngredients(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { imageBuffer, profile } = req.body ?? {};

  if (!imageBuffer || !profile) {
    return res.status(400).json({
      error: "imageBuffer and profile are required",
      details: ["Missing imageBuffer or profile in request body"],
    });
  }

  next();
}

export function validateAnalyzeText(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { text, profile } = req.body ?? {};

  if (!text || !profile) {
    return res.status(400).json({
      error: "text and profile are required",
      details: ["Missing text or profile in request body"],
    });
  }

  next();
}

