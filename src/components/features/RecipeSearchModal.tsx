'use client';

import { useState, useEffect } from 'react';
import { searchRecipes, RecipeResponse } from '@/lib/api';
import { Search, X, Loader2, Plus, Clock, ChefHat } from 'lucide-react';

interface RecipeSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (recipe: RecipeResponse) => void;
  day: string;
  slotName: string;
}

export default function RecipeSearchModal({ isOpen, onClose, onSelect, day, slotName }: RecipeSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RecipeResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchRecipes(query);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Search className="w-6 h-6 text-orange-500" />
              Add Recipe
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 capitalize leading-relaxed">
              Find the perfect <span className="font-bold text-orange-500">{slotName}</span> for <span className="font-bold text-slate-800 dark:text-slate-200">{day}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 sm:p-8 pt-0 mt-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipes (e.g. Pasta, Salad, Salmon...)"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-0 ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-orange-500 rounded-2xl transition-all outline-none"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 pb-8 custom-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
              <p>Searching for delicious ideas...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => onSelect(recipe)}
                  className="group flex gap-4 p-3 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-orange-500/30 rounded-2xl transition-all text-left ring-1 ring-slate-100 dark:ring-slate-800 hover:shadow-xl hover:shadow-orange-500/5"
                >
                  <img 
                    src={recipe.image} 
                    className="w-20 h-20 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" 
                    alt="" 
                  />
                  <div className="flex-1 min-w-0 py-1">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors">
                      {recipe.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Plus className="w-3 h-3 text-orange-500" />
                        <span>Quick Add</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query && !loading ? (
            <div className="py-20 text-center text-slate-400">
              <ChefHat className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No recipes found. Try a different search!</p>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400">
              <p className="text-balance max-w-xs mx-auto">Enter a keyword to find millions of recipes from around the world.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
