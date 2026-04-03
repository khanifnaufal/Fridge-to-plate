import { useQuery } from '@tanstack/react-query';
import { fetchRecipesByIngredients, fetchRecipeDetails, fetchIngredientSubstitutes } from '@/lib/api';

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

export const useRecipeDetails = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      // Offline support: check localStorage first
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('fridge_to_plate_favorites');
          if (stored) {
            const favorites = JSON.parse(stored);
            const savedRecipe = favorites.find((r: any) => r.id === Number(id));
            if (savedRecipe) return savedRecipe;
          }
        } catch (e) {
          console.error('Failed to read from localStorage', e);
        }
      }
      
      // Fallback to API
      return fetchRecipeDetails(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60 * 24, // 24h caching 
    refetchOnWindowFocus: false,
  });
};

export const useIngredientSubstitutes = (name: string) => {
  return useQuery({
    queryKey: ['substitutes', name.toLowerCase()],
    queryFn: () => fetchIngredientSubstitutes(name),
    enabled: !!name,
    staleTime: 1000 * 60 * 60 * 24, // 24h caching
    refetchOnWindowFocus: false,
  });
};

