import { neurolink } from "@/aiProvider";
import { FoodEntry } from "@/types";
import { z } from "zod";

const nutritionSchema = z.object({
  calories: z.number().describe("Amount of calories"),
  protein: z.number().describe("Amount of Protein in grams"),
  fat: z.number().describe("Amount of fat in grams"),
  carbohydrates: z.number().describe("Amount of carbohydrates in grams"),
});

export async function getNutritionalInfo(
  foodName: string,
): Promise<Omit<FoodEntry, "name" | "timestamp">> {
  const result = await neurolink.generate({
    input: {
      text: `Provide the nutritional information for a regular serving of ${foodName}. Respond with only a valid JSON object that adheres to the provided schema. Do not include any other text or explanations.`,
    },
    provider: "google-ai",
    schema: nutritionSchema,
    systemPrompt: "You are a helpful assistant that only responds with JSON.",
  });

  console.log("Raw AI Response:", result.content);

  if (!result || !result.content) {
    throw new Error(`Failed to get nutritional info for ${foodName}.`);
  }

  try {
    const cleanedContent = result.content.replace(/```json\n|```/g, "");
    const parsedResult = JSON.parse(cleanedContent);

    if (parsedResult.error) {
      throw new Error(`AI error: ${parsedResult.error}`);
    }

    return {
      calories: parsedResult.calories,
      protein: parsedResult.protein,
      fat: parsedResult.fat,
      carbohydrates: parsedResult.carbohydrates,
    };
  } catch (error) {
    throw new Error(
      `Failed to parse nutritional info for ${foodName}. AI response: ${result.content}`,
    );
  }
}
