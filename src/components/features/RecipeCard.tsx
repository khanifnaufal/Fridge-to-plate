'use client';

import { RecipeResponse } from '@/lib/api';
import { ChefHat, AlertCircle, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useShoppingList } from '@/hooks/useShoppingList';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function RecipeCard({ recipe }: { recipe: RecipeResponse }) {
  const { addIngredients } = useShoppingList();
  const [addedTemp, setAddedTemp] = useState(false);
  const totalIngredients = recipe.usedIngredientCount + recipe.missedIngredientCount;
  const matchPercentage = Math.round((recipe.usedIngredientCount / totalIngredients) * 100) || 0;

  const isPerfectMatch = matchPercentage === 100;
  const matchColor = isPerfectMatch 
    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 dark:text-emerald-400' 
    : matchPercentage > 50 
      ? 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 dark:text-amber-400' 
      : 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 dark:text-rose-400';

  return (
    <Link href={`/recipe/${recipe.id}`} className="group relative block bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:border-orange-300 dark:hover:border-orange-500/50 transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={recipe.image}
          alt={recipe.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        <div className={cn("absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm transition-colors", matchColor)}>
          {matchPercentage}% Match
        </div>
      </div>

      <div className="p-5 sm:p-6 transition-colors">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-1 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {recipe.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4 transition-colors">
          <ChefHat className="w-4 h-4 text-orange-400" />
          <span>{recipe.usedIngredientCount} ingredients you have</span>
        </div>

        {recipe.missedIngredientCount > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 dark:text-rose-400">
                <AlertCircle className="w-3.5 h-3.5" />
                Need {recipe.missedIngredientCount} more:
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addIngredients(recipe.missedIngredients);
                  setAddedTemp(true);
                  setTimeout(() => setAddedTemp(false), 2000);
                }}
                className={cn("flex items-center justify-center p-1.5 rounded-full transition-all border", 
                  addedTemp 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" 
                    : "bg-white text-orange-500 border-slate-200/60 hover:bg-orange-50 hover:border-orange-200 dark:bg-slate-900 dark:text-orange-400 dark:border-slate-800 dark:hover:bg-orange-500/10 dark:hover:border-orange-500/30"
                )}
                title="Add missing ingredients to shopping list"
              >
                {addedTemp ? <CheckCircle2 className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recipe.missedIngredients.slice(0, 3).map((ing) => (
                <span key={ing.id} className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md transition-colors">
                  {ing.name}
                </span>
              ))}
              {recipe.missedIngredients.length > 3 && (
                <span className="text-[10px] px-2 py-1 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 rounded-md transition-colors">
                  +{recipe.missedIngredients.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
