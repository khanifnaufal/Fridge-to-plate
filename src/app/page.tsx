'use client';

import { useState } from 'react';
import { ChefHat, Loader2, UtensilsCrossed, Sparkles } from 'lucide-react';
import IngredientInput from '@/components/features/IngredientInput';
import RecipeCard from '@/components/features/RecipeCard';
import EmptyState from '@/components/features/EmptyState';
import GachaModal from '@/components/features/GachaModal';
import { useRecipes } from '@/hooks/useRecipes';

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const { data: recipes, isLoading, isError } = useRecipes(ingredients);
  const [isGachaOpen, setIsGachaOpen] = useState(false);

  return (
    <main className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-5 p-2 animate-in slide-in-from-top-4 duration-700 fade-in">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-500/20 dark:to-rose-500/20 rounded-3xl mb-2 shadow-sm transition-colors">
          <UtensilsCrossed className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 dark:text-orange-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-tight sm:leading-tight lg:leading-[1.2] transition-colors">
          What&apos;s in your <span className="inline-block py-1 px-1 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500 ...">
            Fridge?
          </span>
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto transition-colors">
          Turn your leftover ingredients into extraordinary dishes. Just enter what you have, and we&apos;ll give you the recipe!
        </p>
      </div>

      <div className="w-full relative z-10 mb-6 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button
          onClick={() => setIsGachaOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-200 to-orange-200 hover:from-amber-300 hover:to-orange-300 dark:from-amber-500/20 dark:to-orange-500/20 dark:hover:from-amber-500/30 dark:hover:to-orange-500/30 text-amber-800 dark:text-amber-300 rounded-full font-bold transition-all transform hover:scale-105 hover:-translate-y-1 shadow-md hover:shadow-lg border border-amber-300/50 dark:border-amber-500/30"
        >
          <Sparkles className="w-5 h-5" />
          <span>Feeling Lucky? (Pick Random)</span>
        </button>
      </div>

      <div className="w-full relative z-10 mb-12 sm:mb-16">
        <IngredientInput onIngredientsChange={setIngredients} />
      </div>

      <div className="w-full flex-grow relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col justify-center items-center py-20 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm z-20 rounded-3xl animate-in fade-in duration-200 transition-colors">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <span className="text-lg text-slate-600 dark:text-slate-300 font-medium animate-pulse">Crafting recipes just for you...</span>
          </div>
        )}

        {isError && (
          <div className="w-full p-6 text-center text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 backdrop-blur-sm rounded-2xl border border-rose-200 dark:border-rose-900/50 animate-in fade-in zoom-in-95 transition-colors">
            <p className="font-semibold text-lg mb-1">Something went wrong</p>
            <p className="text-sm">Failed to fetch recipes. Please check your internet connection or Spoonacular API key.</p>
          </div>
        )}

        {!isLoading && !isError && ingredients.length === 0 && (
          <EmptyState />
        )}

        {!isLoading && !isError && ingredients.length > 0 && recipes && recipes.length === 0 && (
          <div className="w-full text-center py-20 text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95 transition-colors">
            <div className="flex justify-center mb-4">
              <ChefHat className="w-12 h-12 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">No matching recipes found</p>
            <p className="text-sm mt-1">Try using more common ingredients or removing specific ones.</p>
          </div>
        )}

        {!isLoading && !isError && recipes && recipes.length > 0 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 fade-in fill-mode-both">
            <div className="flex items-center justify-between px-2 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
                  Recipe Ideas ({recipes.length})
                </h2>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 inline-block transition-colors">
                  Sorted by best match
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {recipes.map((recipe, index) => (
                <div key={recipe.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-in slide-in-from-bottom-4 duration-500 fade-in fill-mode-both">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="mt-20 sm:mt-32 pb-4 text-center text-slate-400 text-sm font-medium flex-col flex items-center gap-2">
        <ChefHat className="w-5 h-5 text-slate-300 dark:text-slate-600" />
        <p>Built for reducing food waste. Powered by Spoonacular API.</p>
      </footer>

      <GachaModal 
        isOpen={isGachaOpen} 
        onClose={() => setIsGachaOpen(false)} 
        recipes={recipes || []} 
      />
    </main>
  );
}
