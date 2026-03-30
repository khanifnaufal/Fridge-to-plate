'use client';

import { useState } from 'react';
import { ChefHat, Loader2, UtensilsCrossed } from 'lucide-react';
import IngredientInput from '@/components/features/IngredientInput';
import RecipeCard from '@/components/features/RecipeCard';
import EmptyState from '@/components/features/EmptyState';
import { useRecipes } from '@/hooks/useRecipes';

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  
  const { data: recipes, isLoading, isError } = useRecipes(ingredients);

  return (
    <main className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-5 animate-in slide-in-from-top-4 duration-700 fade-in">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-orange-100 to-rose-100 rounded-3xl mb-2 shadow-sm">
          <UtensilsCrossed className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-800 leading-[1.1]">
          Apa yang ada di <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Kulkas Anda?</span>
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-slate-500 max-w-2xl mx-auto">
          Ubah bahan-bahan sisa di kulkas menjadi hidangan luar biasa. Cukup masukkan apa yang Anda miliki, kami resepkan untuk Anda!
        </p>
      </div>

      {/* Input Section */}
      <div className="w-full relative z-10 mb-12 sm:mb-16">
        <IngredientInput onIngredientsChange={setIngredients} />
      </div>

      {/* Results Section */}
      <div className="w-full flex-grow relative min-h-[300px]">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col justify-center items-center py-20 bg-slate-50/80 backdrop-blur-sm z-20 rounded-3xl animate-in fade-in duration-200">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <span className="text-lg text-slate-600 font-medium animate-pulse">Meracik resep khusus untuk Anda...</span>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="w-full p-6 text-center text-rose-600 bg-rose-50/80 backdrop-blur-sm rounded-2xl border border-rose-200 animate-in fade-in zoom-in-95">
            <p className="font-semibold text-lg mb-1">Terjadi kesalahan</p>
            <p className="text-sm">Gagal mengambil data resep. Pastikan koneksi internet stabil & API Key Spoonacular sudah benar di .env.local Anda.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && ingredients.length === 0 && (
          <EmptyState />
        )}

        {/* No Results from API */}
        {!isLoading && !isError && ingredients.length > 0 && recipes && recipes.length === 0 && (
          <div className="w-full text-center py-20 text-slate-500 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm animate-in fade-in zoom-in-95">
            <div className="flex justify-center mb-4">
              <ChefHat className="w-12 h-12 text-slate-300" />
            </div>
            <p className="text-lg font-medium text-slate-700">Tidak ada resep yang cocok</p>
            <p className="text-sm mt-1">Coba gunakan bahan yang lebih umum atau kurangi bahan yang spesifik.</p>
          </div>
        )}

        {/* Successful Results */}
        {!isLoading && !isError && recipes && recipes.length > 0 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 fade-in fill-mode-both">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Pilihan Resep ({recipes.length})
              </h2>
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Diurutkan berdasar kecocokan
              </span>
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
      
      {/* Footer */}
      <footer className="mt-20 sm:mt-32 pb-4 text-center text-slate-400 text-sm font-medium flex-col flex items-center gap-2">
        <ChefHat className="w-5 h-5 text-slate-300" />
        <p>Built for reducing food waste. Powered by Spoonacular API.</p>
      </footer>
    </main>
  );
}
