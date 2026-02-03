
import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult, UserProfile, Verdict, RiskLevel } from "../types";

// Always initialize with the named parameter and direct environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    productName: { type: Type.STRING },
    overallVerdict: { 
      type: Type.STRING, 
      description: "One of: SAFE, CAUTION, AVOID" 
    },
    summary: { type: Type.STRING },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          technicalName: { type: Type.STRING },
          purpose: { type: Type.STRING },
          riskLevel: { 
            type: Type.STRING, 
            description: "One of: LOW, MEDIUM, HIGH" 
          },
          warning: { type: Type.STRING },
          regulatoryNote: { type: Type.STRING }
        },
        required: ["name", "purpose", "riskLevel"]
      }
    }
  },
  required: ["overallVerdict", "summary", "ingredients"]
};

export async function analyzeIngredients(
  imageBuffer: string, 
  profile: UserProfile
): Promise<ScanResult> {
  // Call generateContent with the model name and contents
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBuffer
            }
          },
          {
            text: `Extract ingredients from this image and provide a health/safety analysis.
            User Context:
            - Allergies: ${profile.allergies.join(", ") || "None"}
            - Conditions: ${profile.conditions.join(", ") || "None"}
            - Profession: ${profile.profession || "General"}
            - Goals: ${profile.goals.join(", ") || "General health"}
            
            Strictly follow the JSON schema. Use a calm, clinical tone. Avoid fear-mongering. 
            Flag ingredients that conflict with the user's allergies or profession (e.g., stimulants for pilots or certain banned substances for athletes).`
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA
    }
  });

  // Extract text using the .text property
  const jsonStr = response.text.trim();
  return JSON.parse(jsonStr) as ScanResult;
}

export async function analyzeText(
  text: string, 
  profile: UserProfile
): Promise<ScanResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            text: `Analyze these ingredients: "${text}"
            User Context:
            - Allergies: ${profile.allergies.join(", ") || "None"}
            - Conditions: ${profile.conditions.join(", ") || "None"}
            - Profession: ${profile.profession || "General"}
            - Goals: ${profile.goals.join(", ") || "General health"}
            
            Follow the JSON schema. Neutral, clinical tone required.`
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA
    }
  });

  // response.text is a property, not a method
  return JSON.parse(response.text.trim()) as ScanResult;
}
