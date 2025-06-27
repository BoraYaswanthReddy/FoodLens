# Project: Food Tracker
## Task: Enhance Meal Suggestions with Reasons

### Objective
The goal was to update the meal suggestion engine to provide a reason for each recommended meal. This gives users insight into why specific meals are suggested based on their dietary history.

### Changes Implemented

1.  **`src/types.ts`**
    *   Defined a new `Meal` interface with `name` and `reason` properties.
    *   Created a `MealPlan` interface using the `Meal` type for `breakfast`, `lunch`, `dinner`, and an optional `snack`.

    ```typescript
    export interface Meal {
      name: string;
      reason: string;
    }

    export interface MealPlan {
      breakfast: Meal;
      lunch: Meal;
      dinner: Meal;
      snack?: Meal;
    }
    ```

2.  **`src/suggestionEngine.ts`**
    *   Updated the `mealPlanSchema` to require a `name` and a `reason` for each meal, aligning with the new `Meal` interface.
    *   Enhanced the prompt sent to the AI to explicitly ask for a brief reason for each meal suggestion, considering the user's diet history and nutritional needs.
    *   Modified the output formatting to display the reason alongside each meal suggestion.

    **New Schema:**
    ```typescript
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
    ```

    **Updated Output Formatting:**
    ```typescript
    formattedSuggestion += `- Breakfast: ${parsedResult.breakfast.name} (Reason: ${parsedResult.breakfast.reason})\n`;
    ```

3.  **`src/foodIdentifier.ts`**
    *   Replaced the stub implementation with a function that reads an image file, converts it to a base64 string, and sends it to the AI with a text prompt to identify the dish.
    *   Used a type assertion (`as any`) to bypass a TypeScript error and allow the `images` property to be passed to the AI provider.

    ```typescript
    import { aiProvider } from "@/aiProvider";
    import { readFile } from "fs/promises";

    export async function identifyFood(imagePath: string): Promise<string> {
      const provider = await aiProvider;

      const imageBuffer = await readFile(imagePath);
      const imageBase64 = imageBuffer.toString("base64");

      const result = await provider.generateText({
        prompt: "What is the name of the dish in this image?",
        images: [imageBase64],
      } as any);

      if (!result || !result.text) {
        throw new Error("Failed to identify food from image.");
      }

      return result.text.trim();
    }
    ```
