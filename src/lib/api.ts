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
  baseURL: 'https://api.spoonacular.com/recipes',
  params: {
    apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
  },
});

export const fetchRecipesByIngredients = async (ingredients: string[]): Promise<RecipeResponse[]> => {
  if (ingredients.length === 0) return [];

  const { data } = await spoonacularApi.get<RecipeResponse[]>('/findByIngredients', {
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
