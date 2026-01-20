
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSecurityAdvice = async (username: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, professional welcome message for a user named ${username} who just logged into their secure dashboard. Include one unique tip about cybersecurity (like MFA, phishing, or password rotation). Keep it under 100 words.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text || "Welcome back! Stay safe online.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Welcome back! Ensure your security settings are up to date.";
  }
};

export const analyzePasswordStrength = async (password: string): Promise<{score: number, feedback: string}> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the strength of the following password and provide a score from 1 to 5 and a brief feedback. Password: "${password}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING }
          },
          required: ["score", "feedback"]
        }
      },
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { score: 3, feedback: "Analysis unavailable, but ensure you use special characters." };
  }
};
