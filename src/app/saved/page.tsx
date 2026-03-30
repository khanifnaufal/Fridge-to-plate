'use client';

import { useFavorites } from '@/hooks/useFavorites';
import Link from 'next/link';
import { Heart, ChefHat, ArrowLeft, Clock } from 'lucide-react';
import { RecipeDetails } from '@/lib/api';

export default function SavedRecipesPage() {
  const { favorites, isLoaded, removeFavorite } = useFavorites();

  return (
    <main className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col">
      <div className="flex items-center gap-4 mb-8 sm:mb-12">
        <Link 
          href="/" 
          className="p-2 sm:p-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </Link>
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-500 fill-current" />
            Saved Recipes
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Available offline anytime you need them.
          </p>
        </div>
      </div>

      {!isLoaded && (
        <div className="flex-1 flex justify-center items-center">
          <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-rose-500 animate-spin" />
        </div>
      )}

      {isLoaded && favorites.length === 0 && (
        <div className="flex-1 flex flex-col justify-center items-center text-center max-w-md mx-auto py-20">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">No saved recipes yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            When you find a recipe you love, click the heart icon to save it here for offline cooking.
          </p>
          <Link 
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
          >
            Go find some recipes
          </Link>
        </div>
      )}

      {isLoaded && favorites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {favorites.map((recipe: RecipeDetails, index: number) => (
            <div key={recipe.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-in slide-in-from-bottom-4 duration-500 fade-in fill-mode-both">
              <Link href={`/recipe/${recipe.id}`} className="group relative block bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      removeFavorite(recipe.id);
                    }}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 shadow-sm transition-colors"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>

                <div className="p-5 sm:p-6 transition-colors">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-1 mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {recipe.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span>{recipe.readyInMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ChefHat className="w-4 h-4 text-orange-400" />
                      <span>{recipe.extendedIngredients.length} ingredients</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
