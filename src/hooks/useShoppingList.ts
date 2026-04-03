import { useState, useEffect, useCallback } from 'react';
import { RecipeIngredient } from '@/lib/api';

export interface ShoppingItem {
  id: number;
  name: string;
  image?: string;
  checked: boolean;
  addedAt: number;
}

const STORAGE_KEY = 'fridge_to_plate_shopping_list';

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load shopping list', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage (only when items change and are loaded, but avoid infinite loops)
  const saveItems = useCallback((newItems: ShoppingItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    setItems(newItems);
    window.dispatchEvent(new Event('shoppingListUpdated'));
  }, []);

  // Sync state across components and tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setItems(JSON.parse(e.newValue));
      }
    };
    
    const handleCustomChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setItems(JSON.parse(stored));
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('shoppingListUpdated', handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('shoppingListUpdated', handleCustomChange);
    };
  }, []);

  const addIngredients = useCallback((ingredients: RecipeIngredient[]) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const currentItems: ShoppingItem[] = stored ? JSON.parse(stored) : items;
      const newItems = [...currentItems];
      let added = 0;

      ingredients.forEach((ing) => {
        // Prevent duplicate by name
        const exists = newItems.some((item) => item.name.toLowerCase() === ing.name.toLowerCase());
        if (!exists) {
          newItems.unshift({
            id: ing.id || Date.now() + Math.random(),
            name: ing.name,
            image: ing.image,
            checked: false,
            addedAt: Date.now(),
          });
          added++;
        }
      });
      
      if (added > 0) {
        saveItems(newItems);
      }
      return added;
    } catch (e) {
      console.error('Failed to add ingredients to shopping list', e);
      return 0;
    }
  }, [items, saveItems]);

  const toggleItem = useCallback((id: number) => {
    const newItems = items.map((item) => item.id === id ? { ...item, checked: !item.checked } : item);
    saveItems(newItems);
  }, [items, saveItems]);

  const removeItem = useCallback((id: number) => {
    const newItems = items.filter((item) => item.id !== id);
    saveItems(newItems);
  }, [items, saveItems]);

  const clearCompleted = useCallback(() => {
    const newItems = items.filter((item) => !item.checked);
    saveItems(newItems);
  }, [items, saveItems]);

  const clearAll = useCallback(() => {
    saveItems([]);
  }, [saveItems]);

  return {
    items,
    isLoaded,
    addIngredients,
    toggleItem,
    removeItem,
    clearCompleted,
    clearAll,
  };
}
