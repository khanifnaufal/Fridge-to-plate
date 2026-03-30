'use client';

import { useState, KeyboardEvent } from 'react';
import { X, Languages } from 'lucide-react';

interface IngredientInputProps {
  onIngredientsChange: (ingredients: string[]) => void;
}

export default function IngredientInput({ onIngredientsChange }: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      
      // Auto-split by comma so user can type "chicken, egg, tomato" in one go
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
      {/* Helper Warning Notification */}
      <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-blue-50/80 border border-blue-100 rounded-full text-blue-700 text-xs sm:text-sm shadow-sm">
        <Languages className="w-4 h-4 text-blue-500" />
        Spoonacular API membutuhkan bahan dalam <strong>Bahasa Inggris</strong> (misal: "chicken, egg, tomato")
      </div>

      <div className="relative w-full">
        <input
          type="text"
          className="w-full px-6 py-4 text-base md:text-lg text-slate-800 bg-white/80 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400"
          placeholder="Ketik dalam B.Inggris (contoh: chicken, tomato) lalu Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 text-sm hidden sm:block">
          Tekan Enter ⏎
        </div>
      </div>

      {/* Tags Container */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6 min-h-[44px]">
        {ingredients.map((item) => (
          <span
            key={item}
            className="group flex items-center px-4 py-2 bg-orange-100/80 backdrop-blur-sm border border-orange-200/50 text-orange-800 rounded-full text-sm font-semibold shadow-sm animate-in zoom-in-95 duration-200"
          >
            {item}
            <button
              onClick={() => removeIngredient(item)}
              className="ml-2 -mr-1 p-0.5 rounded-full text-orange-400 hover:text-white hover:bg-orange-500 focus:outline-none transition-colors"
              aria-label={`Hapus ${item}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        {ingredients.length === 0 && (
          <span className="text-sm text-slate-400/80 italic">Belum ada bahan yang dimasukkan</span>
        )}
      </div>
    </div>
  );
}
