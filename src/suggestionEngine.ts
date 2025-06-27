import { aiProvider } from "@/aiProvider";
import { FoodEntry, MealPlan } from "@/types";
import { z } from "zod";

const mealSchema = z.object({
  name: z.string().describe("The name of the meal."),
  reason: z.string().describe("A brief reason for suggesting this meal."),
});

const mealPlanSchema = z.object({
  breakfast: mealSchema,
  lunch: mealSchema,
  dinner: mealSchema,
  snack: mealSchema.optional(),
});

export async function getMealSuggestion(
  diet: string,
  cuisine: string
): Promise<string> {
  const provider = await aiProvider;

  const dietHistoryResource = "file:///Users/yaswanth.reddy/Desktop/food_tracker/server/food_log.json";

  const prompt = `
    Based on the provided diet history, please suggest a healthy and balanced ${diet} meal plan for one day (breakfast, lunch, dinner, and an optional snack) with a ${cuisine} influence.
    For each meal, provide a brief reason for the suggestion, considering the user's diet history and nutritional needs.
    You should try to incorporate some of the items from the food history in your suggestions.
    Provide the response as a JSON object matching the provided schema.
  `;

  const result = await provider.generateText(
    {
      prompt: prompt,
      schema: mealPlanSchema,
      context: [{ uri: dietHistoryResource }],
      maxTokens: 4096,
    } as any
  );

  if (!result || !result.text) {
    throw new Error("Failed to generate meal suggestion.");
  }

  const parsedResult: MealPlan = JSON.parse(result.text);

  let formattedSuggestion = `Your Meal Plan\n\n`;
  formattedSuggestion += `- Breakfast: ${parsedResult.breakfast.name} (Reason: ${parsedResult.breakfast.reason})\n`;
  formattedSuggestion += `- Lunch:     ${parsedResult.lunch.name} (Reason: ${parsedResult.lunch.reason})\n`;
  formattedSuggestion += `- Dinner:    ${parsedResult.dinner.name} (Reason: ${parsedResult.dinner.reason})\n`;
  if (parsedResult.snack) {
    formattedSuggestion += `- Snack:     ${parsedResult.snack.name} (Reason: ${parsedResult.snack.reason})\n`;
  }

  return formattedSuggestion;
}
