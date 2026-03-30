import { useState, useEffect } from 'react';
import { RecipeDetails } from '@/lib/api';

const FAVORITES_KEY = 'fridge_to_plate_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<RecipeDetails[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
    setIsLoaded(true);
  }, []);

  const addFavorite = (recipe: RecipeDetails) => {
    try {
      const newFavorites = [...favorites, recipe];
      setFavorites(newFavorites);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (e) {
      console.error('Failed to save favorite. Storage might be full.', e);
    }
  };

  const removeFavorite = (id: number) => {
    try {
      const newFavorites = favorites.filter(r => r.id !== id);
      setFavorites(newFavorites);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (e) {
      console.error('Failed to remove favorite', e);
    }
  };

  const isFavorite = (id: number) => {
    return favorites.some(r => r.id === id);
  };

  const getFavoriteById = (id: number) => {
    return favorites.find(r => r.id === id);
  };

  return {
    favorites,
    isLoaded,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteById
  };
}
