/**
 * Gemini integration disabled for Vercel deployment.
 * All functions return safe defaults.
 */
export type GeminiPrompt = { prompt: string, context?: any };
export async function generateText(_: GeminiPrompt): Promise<{ text: string }> {
  return { text: "" };
}
export async function generateContent(_: GeminiPrompt): Promise<{ content: string }> {
  return { content: "" };
}
export const isGeminiDisabled = true;
