import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeMaterialScrap(description: string) {
  const prompt = `
    You are an AI Material Intelligence expert for EkoKintsugi, a circular luxury footwear brand.
    Analyze the following description of leather scrap material and provide:
    1. Estimated Grade (A, B, or C)
    2. Recommended use (Sheet conversion, Repair, or Recycle)
    3. Estimated CO2 saving potential per kg.
    
    Description: ${description}
    
    Format the response as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text;
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
}
