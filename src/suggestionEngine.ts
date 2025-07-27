import { promises as fs } from "fs";
import path from "path";
import { neurolink } from "@/aiProvider";
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
  cuisine: string,
): Promise<string> {
  const foodLogPath = path.join(process.cwd(), "food_log.json");
  const foodLog = await fs.readFile(foodLogPath, "utf-8");

  const prompt = `
    Based on the following diet history:
    ${foodLog}

    Please suggest a healthy and balanced ${diet} meal plan for one day (breakfast, lunch, dinner, and an optional snack) with a ${cuisine} influence.
    For each meal, provide a brief reason for the suggestion, considering the user's diet history and nutritional needs.
    You should try to incorporate some of the items from the food history in your suggestions.
    Provide the response as a JSON object matching the provided schema. Do not include any other text or explanations.
  `;

  const result = await neurolink.generate({
    input: {
      text: prompt,
    },
    provider: "google-ai",
    schema: mealPlanSchema,
    maxTokens: 4096,
    systemPrompt: "You are a helpful assistant that only responds with JSON.",
  });

  if (!result || !result.content) {
    throw new Error("Failed to generate meal suggestion.");
  }

  try {
    const cleanedContent = result.content.replace(/```json\n|```/g, "");
    const parsedResult: MealPlan = JSON.parse(cleanedContent);

    let formattedSuggestion = `Your Meal Plan\n\n`;
    formattedSuggestion += `- Breakfast: ${parsedResult.breakfast.name} (Reason: ${parsedResult.breakfast.reason})\n`;
    formattedSuggestion += `- Lunch:     ${parsedResult.lunch.name} (Reason: ${parsedResult.lunch.reason})\n`;
    formattedSuggestion += `- Dinner:    ${parsedResult.dinner.name} (Reason: ${parsedResult.dinner.reason})\n`;
    if (parsedResult.snack) {
      formattedSuggestion += `- Snack:     ${parsedResult.snack.name} (Reason: ${parsedResult.snack.reason})\n`;
    }

    return formattedSuggestion;
  } catch (error) {
    throw new Error(
      `Failed to parse meal suggestion. AI response: ${result.content}`,
    );
  }
}
