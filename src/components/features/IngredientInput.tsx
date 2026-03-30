'use client';

import { useState, KeyboardEvent } from 'react';
import { X, Info } from 'lucide-react';

interface IngredientInputProps {
  onIngredientsChange: (ingredients: string[]) => void;
}

export default function IngredientInput({ onIngredientsChange }: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      
      const newItems = inputValue
        .split(',')
        .map((i) => i.trim().toLowerCase())
        .filter((i) => i.length > 0 && !ingredients.includes(i));
      
      if (newItems.length > 0) {
        const newArr = [...ingredients, ...newItems];
        setIngredients(newArr);
        onIngredientsChange(newArr);
      }
      setInputValue('');
    }
  };

  const removeIngredient = (item: string) => {
    const newArr = ingredients.filter((i) => i !== item);
    setIngredients(newArr);
    onIngredientsChange(newArr);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-blue-50/80 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 rounded-full text-blue-700 dark:text-blue-300 text-xs sm:text-sm shadow-sm transition-colors">
        <Info className="w-4 h-4 text-blue-500 dark:text-blue-400" />
        Type ingredients in English (e.g., &quot;chicken, tomato, egg&quot;)
      </div>

      <div className="relative w-full">
        <input
          type="text"
          className="w-full px-6 py-4 text-base md:text-lg text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/40 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
          placeholder="What's in your fridge? (hit Enter)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 dark:text-slate-600 text-sm hidden sm:block">
          Press Enter ⏎
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-6 min-h-[44px]">
        {ingredients.map((item) => (
          <span
            key={item}
            className="group flex items-center px-4 py-2 bg-orange-100/80 dark:bg-orange-500/10 backdrop-blur-sm border border-orange-200/50 dark:border-orange-500/20 text-orange-800 dark:text-orange-400 rounded-full text-sm font-semibold shadow-sm animate-in zoom-in-95 duration-200 transition-colors"
          >
            {item}
            <button
              onClick={() => removeIngredient(item)}
              className="ml-2 -mr-1 p-0.5 rounded-full text-orange-400 dark:text-orange-500 hover:text-white dark:hover:text-white hover:bg-orange-500 dark:hover:bg-orange-600 focus:outline-none transition-colors"
              aria-label={`Remove ${item}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        {ingredients.length === 0 && (
          <span className="text-sm text-slate-400/80 dark:text-slate-600 italic">No ingredients added yet</span>
        )}
      </div>
    </div>
  );
}
