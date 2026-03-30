import { useQuery } from '@tanstack/react-query';
import { fetchRecipesByIngredients } from '@/lib/api';

export const useRecipes = (ingredients: string[]) => {
  // Normalize query key to avoid refetching for same ingredients typed in different order
  const normalizedKey = [...ingredients].map(i => i.trim().toLowerCase()).sort().join(',');

  return useQuery({
    queryKey: ['recipes', normalizedKey],
    queryFn: () => fetchRecipesByIngredients(ingredients),
    enabled: ingredients.length > 0, // Only fetch if we have ingredients
    staleTime: 1000 * 60 * 60 * 24, // 24 hours caching
    refetchOnWindowFocus: false,     // Don't refetch just because user switched tabs
  });
};
