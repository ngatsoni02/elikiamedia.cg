
import { GoogleGenAI } from "@google/genai";

if (!import.meta.env.VITE_GEMINI_API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled. Please set VITE_GEMINI_API_KEY in your environment.");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY! });

export const generateArticleContent = async (title: string, category: string): Promise<string> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY environment variable not set.");
  }
  
  const prompt = `Rédige un article de presse en français pour un média en ligne nommé ELIKIA MEDIA, qui se concentre sur l'actualité africaine.

Le titre de l'article est : "${title}"
La catégorie est : "${category}"

L'article doit être bien structuré, informatif et engageant. Utilise des balises HTML simples pour la mise en forme : <p> pour les paragraphes et <h2> pour les sous-titres. N'inclus pas de balise <html>, <body> ou <head>. Commence directement par le contenu de l'article. L'article doit faire environ 3-4 paragraphes.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw new Error("Failed to generate article content.");
  }
};
