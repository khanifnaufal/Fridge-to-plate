import { RecipeResponse } from '@/lib/api';
import { ChefHat, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RecipeCard({ recipe }: { recipe: RecipeResponse }) {
  const totalIngredients = recipe.usedIngredientCount + recipe.missedIngredientCount;
  const matchPercentage = Math.round((recipe.usedIngredientCount / totalIngredients) * 100) || 0;

  // Visual cues based on match
  const isPerfectMatch = matchPercentage === 100;
  const matchColor = isPerfectMatch 
    ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
    : matchPercentage > 50 
      ? 'text-amber-600 bg-amber-50 border-amber-200' 
      : 'text-rose-600 bg-rose-50 border-rose-200';

  return (
    <div className="group relative bg-white border border-slate-200/60 rounded-3xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={recipe.image}
          alt={recipe.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Percentage Badge */}
        <div className={cn("absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm", matchColor)}>
          {matchPercentage}% Cocok
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <h3 className="text-lg font-bold text-slate-800 line-clamp-1 mb-2 group-hover:text-orange-600 transition-colors">
          {recipe.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <ChefHat className="w-4 h-4 text-orange-400" />
          <span>{recipe.usedIngredientCount} bahan ada</span>
        </div>

        {/* Missing Ingredients Section */}
        {recipe.missedIngredientCount > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              Butuh {recipe.missedIngredientCount} bahan lagi:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recipe.missedIngredients.slice(0, 3).map((ing) => (
                <span key={ing.id} className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                  {ing.name}
                </span>
              ))}
              {recipe.missedIngredients.length > 3 && (
                <span className="text-[10px] px-2 py-1 bg-slate-50 text-slate-400 rounded-md">
                  +{recipe.missedIngredients.length - 3} lainnya
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hover Overlay Link behavior could be added here in the future */}
    </div>
  );
}
