import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { RecipeDetails } from '@/lib/api';

export interface MealEntry {
  id: string;
  day: string;
  slot: number; // 1: Breakfast, 2: Lunch, 3: Dinner
  recipe_id: number;
  recipe_title: string;
  recipe_image: string;
  ready_in_minutes: number;
}

export function useMealPlan(userId: string | undefined) {
  const [mealPlan, setMealPlan] = useState<MealEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMealPlan = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching meal plan:', error);
    } else {
      setMealPlan(data || []);
    }
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchMealPlan();
  }, [fetchMealPlan]);

  const addMeal = async (day: string, slot: number, recipe: any) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('meal_plans')
      .upsert({
        user_id: userId,
        day,
        slot,
        recipe_id: recipe.id,
        recipe_title: recipe.title,
        recipe_image: recipe.image || recipe.recipe_image,
        ready_in_minutes: recipe.readyInMinutes || recipe.ready_in_minutes || 30,
      }, { onConflict: 'user_id,day,slot' })
      .select();

    if (error) {
      console.error('Error adding meal:', error);
      throw error;
    } else {
      setMealPlan(prev => {
        const filtered = prev.filter(m => !(m.day === day && m.slot === slot));
        return [...filtered, data[0]];
      });
    }
  };

  const removeMeal = async (day: string, slot: number) => {
    if (!userId) return;

    const { error } = await supabase
      .from('meal_plans')
      .delete()
      .match({ user_id: userId, day, slot });

    if (error) {
      console.error('Error removing meal:', error);
    } else {
      setMealPlan(prev => prev.filter(m => !(m.day === day && m.slot === slot)));
    }
  };

  const clearWeek = async () => {
    if (!userId) return;
    const { error } = await supabase
      .from('meal_plans')
      .delete()
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error clearing week:', error);
    } else {
      setMealPlan([]);
    }
  };

  return {
    mealPlan,
    isLoading,
    addMeal,
    removeMeal,
    clearWeek,
    refresh: fetchMealPlan,
  };
}
