import { GoogleGenAI, Type } from '@google/genai';
import { WardrobeItem, GeneratedOutfits, GeneratedShopSuggestions, Outfit } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a mock response. Please provide a valid API key for actual Gemini functionality.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const useMock = !process.env.API_KEY;

export async function generateOutfitsWithGemini(
  wardrobe: WardrobeItem[],
  mood: string,
  occasion: string,
  weather: string,
  count: number = 2, // Default to 2, can be called with 1 for replacement
  avoidOutfits: Outfit[] = [] // Outfits to not generate again
): Promise<GeneratedOutfits> {
  
  if (useMock) {
      console.log(`Using mock outfit generation response for ${count} outfits.`);
      const mockWardrobeIds = wardrobe.slice(0, 4).map(item => item.id);
      if (mockWardrobeIds.length < 2) return { outfits: [] };

      if (count === 1) {
        // Mocking a single, new outfit
        const newItems = mockWardrobeIds.length > 2 ? [mockWardrobeIds[0], mockWardrobeIds[2]] : mockWardrobeIds.slice(0, 2);
        return Promise.resolve({
            outfits: [
                { items: newItems, explanation: "Here is a fresh alternative for you to consider." }
            ]
        });
      }

      return Promise.resolve({
          outfits: [
              { items: mockWardrobeIds.slice(0, 2), explanation: "A classic and comfortable look for a relaxed day." },
              { items: mockWardrobeIds.slice(Math.max(0, mockWardrobeIds.length - 2)), explanation: "This combination is perfect for a casual outing." }
          ].slice(0, count)
      });
  }

  const model = 'gemini-2.5-flash';

  const wardrobeForPrompt = wardrobe.map(item => ({
    id: item.id,
    name: item.displayName,
    category: item.category,
    tags: item.tags.join(', '),
  }));
  
  const avoidOutfitsForPrompt = avoidOutfits.map(o => o.items);

  const prompt = `You are a fashion AI assistant. Using the provided wardrobe and context, create ${count} outfit combination(s).
  ${avoidOutfitsForPrompt.length > 0 ? `The new outfit(s) should be different from the existing ones provided below.` : ''}
  Only use items from the provided wardrobe. Return a JSON object following the specified schema.

  Wardrobe:
  ${JSON.stringify(wardrobeForPrompt, null, 2)}

  Context:
  - Mood: ${mood}
  - Occasion: ${occasion}
  - Weather: ${weather}
  
  ${avoidOutfitsForPrompt.length > 0 ? `Existing outfits to avoid:\n${JSON.stringify(avoidOutfitsForPrompt, null, 2)}` : ''}

  For each outfit, provide an array of item IDs and a short, one-sentence explanation.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            outfits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  items: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Array of item IDs from the wardrobe for this outfit.',
                  },
                  explanation: {
                    type: Type.STRING,
                    description: 'A brief explanation for why this outfit works.',
                  },
                },
                required: ['items', 'explanation'],
              },
            },
          },
          required: ['outfits'],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString) as GeneratedOutfits;

    // Ensure the model respects the count. Sometimes it might give more.
    if (result.outfits.length > count) {
      result.outfits = result.outfits.slice(0, count);
    }
    return result;

  } catch (error) {
    console.error('Error calling Gemini API for outfits:', error);
    throw new Error('Failed to generate outfits from Gemini API.');
  }
}

export async function generateShopSuggestionsWithGemini(
  wardrobe: WardrobeItem[],
  goal: string
): Promise<GeneratedShopSuggestions> {

  if (useMock) {
    console.log("Using mock shop suggestions response.");
    return Promise.resolve({
      suggestions: [
        { name: "Classic White Blazer", reason: "Adds a professional touch to your tops and pants.", url: "https://shop.example.com/blazer" },
        { name: "Leather Loafers", reason: "Comfortable yet polished, perfect for work.", url: "https://shop.example.com/loafers" },
        { name: "Structured Tote Bag", reason: "A versatile bag that completes any professional outfit.", url: "https://shop.example.com/tote" },
      ]
    });
  }
  
  const model = 'gemini-2.5-flash';

  const wardrobeForPrompt = wardrobe.map(item => ({
    name: item.displayName,
    category: item.category,
    tags: item.tags.join(', '),
  }));

  const prompt = `You are a fashion shopping assistant. Based on the user's current wardrobe and their shopping goal, suggest 3 new clothing items that would complement their style.
  Return a JSON object following the specified schema.

  Current Wardrobe:
  ${JSON.stringify(wardrobeForPrompt, null, 2)}

  Shopping Goal: "${goal}"

  For each suggestion, provide the item name, a short reason why it matches their wardrobe and goal, and a fake shopping URL.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: 'The name of the suggested clothing item.',
                  },
                  reason: {
                    type: Type.STRING,
                    description: 'A brief reason why this item is a good suggestion.',
                  },
                  url: {
                    type: Type.STRING,
                    description: 'A fictional shopping URL for the item.',
                  },
                },
                required: ['name', 'reason', 'url'],
              },
            },
          },
          required: ['suggestions'],
        },
      },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as GeneratedShopSuggestions;
  } catch (error) {
    console.error('Error calling Gemini API for shop suggestions:', error);
    throw new Error('Failed to generate shop suggestions from Gemini API.');
  }
}
