import { aiProvider } from "@/aiProvider";
import { FoodEntry } from "@/types";
import { z } from "zod";

const nutritionSchema = z.object({
  calories: z.number().describe("Amount of calories"),
  protein: z.number().describe("Amount of Protein in grams"),
  fat: z.number().describe("Amount of fat in grams"),
  carbohydrates: z.number().describe("Amount of carbohydrates in grams"),
});

export async function getNutritionalInfo(foodName: string): Promise<Omit<FoodEntry, 'name' | 'timestamp'>> {
  const provider = await aiProvider;

  const result = await provider.generateText({
    prompt: `Provide the nutritional information for a 100g serving of ${foodName}.`,
    schema: nutritionSchema,
  });

  if (!result) {
    throw new Error(`Failed to get nutritional info for ${foodName}.`);
  }

  const parsedResult = JSON.parse(result.text);

  return {
    calories: parsedResult.calories,
    protein: parsedResult.protein,
    fat: parsedResult.fat,
    carbohydrates: parsedResult.carbohydrates,
  };
}
