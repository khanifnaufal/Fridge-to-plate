'use client';

import { use } from 'react';
import { useRecipeDetails } from '@/hooks/useRecipes';
import { useFavorites } from '@/hooks/useFavorites';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, Heart, Activity } from 'lucide-react';
import NutritionWidget from '@/components/features/NutritionWidget';
import PriceEstimator from '@/components/features/PriceEstimator';

export default function RecipePage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { data: recipe, isLoading, isError } = useRecipeDetails(params.id);
  const { isFavorite, addFavorite, removeFavorite, isLoaded } = useFavorites();

  const saved = recipe ? isFavorite(recipe.id) : false;

  if (isLoading) {
    return (
      <main className="min-h-screen animate-pulse bg-slate-50 dark:bg-slate-950">
        <div className="h-64 sm:h-96 bg-slate-200 dark:bg-slate-800 w-full" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 w-2/3 rounded-lg mb-4" />
            <div className="flex gap-4">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 w-24 rounded-md" />
              <div className="h-6 bg-slate-200 dark:bg-slate-800 w-24 rounded-md" />
            </div>
            <div className="mt-8 space-y-4">
               <div className="h-4 bg-slate-200 dark:bg-slate-800 w-full rounded" />
               <div className="h-4 bg-slate-200 dark:bg-slate-800 w-5/6 rounded" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !recipe) {
    return (
      <main className="min-h-screen py-20 px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Recipe not found</h1>
        <Link href="/" className="text-orange-500 hover:underline mt-4 inline-block">Go back home</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Image Header */}
      <div className="relative h-64 sm:h-80 md:h-[400px] w-full bg-slate-900 border-b border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
        
        <Link 
          href="/" 
          className="absolute top-6 left-4 sm:left-6 lg:left-8 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-md rounded-full text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Recipes
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-10 animate-in slide-in-from-bottom-8 duration-700 fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-none border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
              {recipe.title}
            </h1>
            
            {recipe && (
              <div className="flex-shrink-0 flex flex-col items-end gap-3 self-start sm:self-center mr-2">
                {isLoaded && (
                  <button
                    onClick={() => saved ? removeFavorite(recipe.id) : addFavorite(recipe)}
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                      saved 
                        ? 'bg-rose-100 text-rose-600 hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/30 w-full sm:w-auto' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 w-full sm:w-auto'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                    <span>{saved ? 'Saved Offline' : 'Save Offline'}</span>
                  </button>
                )}
                <PriceEstimator recipeId={recipe.id.toString()} />
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pb-8 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span>{recipe.readyInMinutes} mins</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <span>{recipe.aggregateLikes} likes</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              <span>{recipe.healthScore} health score</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Ingredients Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-6 bg-orange-50/50 dark:bg-orange-500/5 rounded-2xl border border-orange-100 dark:border-orange-500/10">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  Ingredients
                </h2>
                <ul className="space-y-3">
                  {recipe.extendedIngredients?.map((ing: any, i: number) => (
                    <li key={`${ing.id}-${i}`} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{ing.amount} {ing.unit}</span>
                        {' '}{ing.name}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <NutritionWidget recipeId={recipe.id.toString()} />
            </div>

            {/* Main Content: Instructions */}
            <div className="lg:col-span-2 space-y-8">
              {recipe.summary && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">About this recipe</h2>
                  <div 
                     className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed"
                     dangerouslySetInnerHTML={{ __html: recipe.summary }}
                  />
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Instructions</h2>
                {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? (
                  <div className="space-y-6">
                    {recipe.analyzedInstructions[0].steps.map((step: any) => (
                      <div key={step.number} className="flex gap-4">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center border border-orange-200 dark:border-orange-500/20">
                          {step.number}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
                          {step.step}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No detailed instructions available for this recipe.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
