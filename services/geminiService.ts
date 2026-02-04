import { ScanResult, UserProfile } from "../types";

// Frontend service that talks to the backend API (no direct Gemini access in browser)
// For Vercel / production, set VITE_API_BASE_URL to your backend URL.
// In dev, we default to the local Express server on port 5000.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : "");

export async function analyzeIngredients(
  imageBuffer: string,
  profile: UserProfile
): Promise<ScanResult> {
  const response = await fetch(`${API_BASE_URL}/api/analyze-ingredients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageBuffer, profile }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    if (response.status === 400) {
      const errorData = await response.json();
      throw new Error(
        `Validation error: ${
          errorData.details?.join(", ") || "Invalid input"
        }`
      );
    }
    throw new Error("Analysis failed. Please try again.");
  }

  return response.json();
}

export async function analyzeText(
  text: string,
  profile: UserProfile
): Promise<ScanResult> {
  const response = await fetch(`${API_BASE_URL}/api/analyze-text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, profile }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    if (response.status === 400) {
      const errorData = await response.json();
      throw new Error(
        `Validation error: ${
          errorData.details?.join(", ") || "Invalid input"
        }`
      );
    }
    throw new Error("Analysis failed. Please try again.");
  }

  return response.json();
}
