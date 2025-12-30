
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  chat: async (message: string) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: message,
      config: { thinkingConfig: { thinkingBudget: 16000 } }
    });
    return response.text;
  },

  search: async (query: string) => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: { tools: [{ googleSearch: {} }] },
    });
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text,
      links: chunks.map((c: any) => ({
        title: c.web?.title || 'Source',
        uri: c.web?.uri
      })).filter((l: any) => l.uri)
    };
  },

  findNearby: async (query: string, lat?: number, lng?: number) => {
    const ai = getAI();
    const config: any = { tools: [{ googleMaps: {} }, { googleSearch: {} }] };
    
    if (lat && lng) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: { latitude: lat, longitude: lng }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find the best ${query} nearby. Provide locations and details.`,
      config
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text,
      places: chunks.map((c: any) => ({
        title: c.maps?.title || c.web?.title || 'Location',
        uri: c.maps?.uri || c.web?.uri
      })).filter((l: any) => l.uri)
    };
  }
};
