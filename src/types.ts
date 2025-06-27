export interface FoodEntry {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  timestamp: string;
}

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
