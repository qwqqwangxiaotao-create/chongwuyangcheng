import { GoogleGenAI } from "@google/genai";
import { PetConfig } from "../types";

let ai: GoogleGenAI | null = null;

try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize Gemini:", error);
}

export const generatePetReaction = async (
  petConfig: PetConfig,
  action: 'feed' | 'bathe' | 'pet',
  currentAffection: number,
  extraContext?: string
): Promise<string> => {
  if (!ai) {
    // Fallback responses if API key is missing
    const fallbacks = [
      `${petConfig.displayName} 看起来很开心！`,
      `${petConfig.displayName} 很享受。`,
      `${petConfig.emoji} ❤️`,
      `${petConfig.displayName} 感到被爱。`,
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      你正在扮演一个养成游戏中的虚拟宠物。
      类型: ${petConfig.displayName} (${petConfig.type}).
      饮食习性: ${petConfig.diet}.
      性格: ${petConfig.description}.
      当前好感度: ${currentAffection}.
      
      主人刚刚进行了这个操作: ${action} (action translation: feed=喂食, bathe=洗澡, pet=抚摸).
      ${extraContext ? `额外情境: ${extraContext}` : ''}
      
      请以宠物的视角写一句非常简短、可爱、反应式的心理活动或叫声。
      请使用中文回答。
      字数限制在 15 字以内。
      使用一个适合情绪的表情符号。
      不要使用标签 (hashtags)。
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text.trim() || `${petConfig.displayName} 很开心！`;
  } catch (error) {
    console.error("Gemini generation error:", error);
    return `${petConfig.displayName} 爱你！`;
  }
};