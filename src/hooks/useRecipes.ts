import { useQuery } from '@tanstack/react-query';
import { fetchRecipesByIngredients, fetchRecipeDetails, fetchIngredientSubstitutes, searchRecipes, RecipeResponse } from '@/lib/api';

export const useRecipes = (ingredients: string[]) => {
  const normalizedKey = [...ingredients].map(i => i.trim().toLowerCase()).sort().join(',');

  return useQuery({
    queryKey: ['recipes', normalizedKey],
    queryFn: async () => {
      if (ingredients.length === 0) return [];
      
      // Semantic Search Optimization: 
      // If user inputs only one broadly categorized ingredient (e.g., "Meat" / "Daging"),
      // we use complexSearch for better semantic matching (Synonyms like Steak, Iga, etc).
      if (ingredients.length === 1) {
        const query = ingredients[0];
        const results = await fetchRecipesByIngredients(ingredients);
        const searchResults = await searchRecipes(query, 12);
        
        // Merge and deduplicate
        const combined = [...results];
        searchResults.forEach((sr: RecipeResponse) => {
          if (!combined.some(c => c.id === sr.id)) {
            combined.push(sr);
          }
        });
        return combined;
      }

      // Traditional Fridge Search for multiple ingredients
      return fetchRecipesByIngredients(ingredients);
    },
    enabled: ingredients.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour (reduced from 24h for freshness)
    refetchOnWindowFocus: false,
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

