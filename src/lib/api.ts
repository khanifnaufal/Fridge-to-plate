import axios from 'axios';

// Interfaces for Spoonacular API
export interface RecipeIngredient {
  id: number;
  amount: number;
  unit: string;
  name: string;
  original: string;
  image: string;
}

export interface RecipeResponse {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: RecipeIngredient[];
  usedIngredients: RecipeIngredient[];
}

const spoonacularApi = axios.create({
  baseURL: 'https://api.spoonacular.com',
  params: {
    apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
  },
});

export const fetchRecipesByIngredients = async (ingredients: string[]): Promise<RecipeResponse[]> => {
  if (ingredients.length === 0) return [];

  const { data } = await spoonacularApi.get<RecipeResponse[]>('/recipes/findByIngredients', {
    params: {
      ingredients: ingredients.join(','),
      number: 12,
      ignorePantry: true,
      ranking: 1, // Maximize used ingredients
    },
  });

  // Calculate strict match percentage client-side for precise sorting
  return data.sort((a, b) => {
    const totalA = a.usedIngredientCount + a.missedIngredientCount;
    const matchA = totalA === 0 ? 0 : a.usedIngredientCount / totalA;

    const totalB = b.usedIngredientCount + b.missedIngredientCount;
    const matchB = totalB === 0 ? 0 : b.usedIngredientCount / totalB;

    return matchB - matchA; // Sort descending (best match first)
  });
};

export interface RecipeDetails {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  aggregateLikes: number;
  healthScore: number;
  summary: string;
  extendedIngredients: {
    id: number;
    original: string;
    amount: number;
    unit: string;
    name: string;
  }[];
  analyzedInstructions: {
    name: string;
    steps: {
      number: number;
      step: string;
    }[];
  }[];
}

export const fetchRecipeDetails = async (id: string): Promise<RecipeDetails> => {
  const { data } = await spoonacularApi.get<RecipeDetails>(`/recipes/${id}/information`);
  return data;
};

export const fetchRandomRecipes = async (number: number = 10): Promise<RecipeResponse[]> => {
  const { data } = await spoonacularApi.get('/recipes/random', {
    params: { number },
  });
  
  // Map random recipe details to RecipeResponse format expected by UI
  return data.recipes.map((r: any) => ({
    id: r.id,
    title: r.title,
    image: r.image,
    usedIngredientCount: r.extendedIngredients?.length || 0,
    missedIngredientCount: 0,
    missedIngredients: [],
    usedIngredients: r.extendedIngredients || []
  }));
};


export interface Nutrient {
  title: string;
  amount: string;
  indented: boolean;
  percentOfDailyNeeds: number;
}

export interface NutritionWidget {
  calories: string;
  carbs: string;
  fat: string;
  protein: string;
  bad: Nutrient[];
  good: Nutrient[];
}

export interface PriceIngredient {
  name: string;
  price: number; // in US cents
  image: string;
  amount: {
    metric: {
      value: number;
      unit: string;
    };
    us: {
      value: number;
      unit: string;
    };
  };
}

export interface PriceBreakdown {
  ingredients: PriceIngredient[];
  totalCost: number; // in US cents
  totalCostPerServing: number; // in US cents
}

export const fetchRecipeNutrition = async (id: string): Promise<NutritionWidget> => {
  const { data } = await spoonacularApi.get<NutritionWidget>(`/recipes/${id}/nutritionWidget.json`);
  return data;
};

export const fetchRecipePriceBreakdown = async (id: string): Promise<PriceBreakdown> => {
  const { data } = await spoonacularApi.get<PriceBreakdown>(`/recipes/${id}/priceBreakdownWidget.json`);
  return data;
};

export interface IngredientSubstitutes {
  ingredient: string;
  substitutes: string[];
  message: string;
}

export const fetchIngredientSubstitutes = async (name: string): Promise<IngredientSubstitutes> => {
  const { data } = await spoonacularApi.get<IngredientSubstitutes>('/food/ingredients/substitutes', {
    params: { ingredientName: name },
  });
  return data;
};

export interface MealPlanRecipe {
  id: number;
  imageType: string;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
}

export interface DayMealPlan {
  meals: MealPlanRecipe[];
  nutrients: {
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
  };
}

export interface WeeklyMealPlan {
  week: {
    monday: DayMealPlan;
    tuesday: DayMealPlan;
    wednesday: DayMealPlan;
    thursday: DayMealPlan;
    friday: DayMealPlan;
    saturday: DayMealPlan;
    sunday: DayMealPlan;
  };
}

export const generateMealPlan = async (timeFrame: 'week' = 'week', targetCalories?: number): Promise<WeeklyMealPlan> => {
  const { data } = await spoonacularApi.get<WeeklyMealPlan>('/mealplanner/generate', {
    params: { timeFrame, targetCalories },
  });
  return data;
};

export const searchRecipes = async (query: string, number: number = 10): Promise<RecipeResponse[]> => {
  const { data } = await spoonacularApi.get('/recipes/complexSearch', {
    params: { query, number },
  });
  
  return data.results.map((r: any) => ({
    id: r.id,
    title: r.title,
    image: r.image,
    usedIngredientCount: 0,
    missedIngredientCount: 0,
    missedIngredients: [],
    usedIngredients: []
  }));
};
