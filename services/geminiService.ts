import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

// Initialize Gemini Client
// Note: In a production environment, this should be handled via a backend proxy to protect the key.
// For this specific frontend-only request, we use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePrompt = async (promptText: string): Promise<AIAnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following coding prompt used to generate a web application or component. 
      Extract a concise title (max 5 words) in Korean, a one-sentence summary (max 20 words) in Korean, and up to 3 relevant technical tags (e.g., "Dashboard", "Chart", "Login").
      
      Prompt:
      ${promptText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "summary", "tags"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback in case of error
    return {
      title: "제목 없는 Vibe",
      summary: "프롬프트를 자동으로 분석할 수 없습니다.",
      tags: ["Vibe"]
    };
  }
};