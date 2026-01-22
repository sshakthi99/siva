
import { GoogleGenAI } from "@google/genai";
import { CrimeReport } from "../types";

// Always use process.env.API_KEY directly when initializing the GoogleGenAI instance.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchIntelligenceData = async (query: string): Promise<CrimeReport> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for official public criminal lists, wanted fugitives, and security alerts related to: ${query}. Focus on data from Interpol, FBI, and national security agencies. Extract names, crimes, and last known locations where available from public records.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Directly access the text property from the response object.
    const summary = response.text || "No intelligence data retrieved.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = chunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        web: {
          uri: chunk.web.uri,
          title: chunk.web.title
        }
      }));

    return {
      summary,
      sources,
      timestamp: new Date().toISOString(),
      status: 'active'
    };
  } catch (error) {
    console.error("Error fetching intelligence data:", error);
    throw error;
  }
};
