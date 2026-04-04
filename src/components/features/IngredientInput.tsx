'use client';

import { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { X, Info, Loader2, Sparkles, Plus } from 'lucide-react';
import { autocompleteIngredients, AutocompleteIngredient } from '@/lib/api';

interface IngredientInputProps {
  onIngredientsChange: (ingredients: string[]) => void;
}

export default function IngredientInput({ onIngredientsChange }: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<AutocompleteIngredient[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load existing ingredients from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fridge_to_plate_user_ingredients');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setIngredients(parsed);
        onIngredientsChange(parsed);
      } catch (e) {
        console.error('Failed to parse saved ingredients');
      }
    }
  }, []);

  // Debounced autocomplete fetch (500ms to save API points)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!inputValue.trim() || inputValue.includes(',')) {
        setSuggestions([]);
        return;
      }

      setIsFetching(true);
      try {
        const data = await autocompleteIngredients(inputValue);
        setSuggestions(data);
        setShowSuggestions(true);
        setHighlightedIndex(-1);
      } catch (e) {
        console.error('Failed to fetch autocomplete suggestions');
      } finally {
        setIsFetching(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addIngredient = (item: string) => {
    const cleanItem = item.trim().toLowerCase();
    if (cleanItem && !ingredients.includes(cleanItem)) {
      const newArr = [...ingredients, cleanItem];
      setIngredients(newArr);
      onIngredientsChange(newArr);
      localStorage.setItem('fridge_to_plate_user_ingredients', JSON.stringify(newArr));
    }
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        addIngredient(suggestions[highlightedIndex].name);
      } else if (inputValue.trim()) {
        const newItems = inputValue
          .split(',')
          .map(i => i.trim().toLowerCase())
          .filter(i => i.length > 0);
        
        const finalArr = [...ingredients];
        let changed = false;
        newItems.forEach(i => {
          if (!finalArr.includes(i)) {
            finalArr.push(i);
            changed = true;
          }
        });

        if (changed) {
          setIngredients(finalArr);
          onIngredientsChange(finalArr);
          localStorage.setItem('fridge_to_plate_user_ingredients', JSON.stringify(finalArr));
        }
        setInputValue('');
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const removeIngredient = (item: string) => {
    const newArr = ingredients.filter((i) => i !== item);
    setIngredients(newArr);
    onIngredientsChange(newArr);
    localStorage.setItem('fridge_to_plate_user_ingredients', JSON.stringify(newArr));
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center relative">
      <div className="flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-blue-50/80 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 rounded-full text-blue-700 dark:text-blue-300 text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-sm transition-colors">
        <Sparkles className="w-3 h-3 text-blue-500" />
        Type ingredients & select suggestions
      </div>

      <div className="relative w-full z-30">
        <input
          ref={inputRef}
          type="text"
          className="w-full px-6 py-4.5 text-base md:text-lg text-slate-800 dark:text-slate-100 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
          placeholder="What's in your fridge? (hit Enter)"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => inputValue.trim() && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isFetching && <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />}
          <div className="text-slate-300 dark:text-slate-700 text-[10px] font-black uppercase tracking-tighter hidden sm:block">
            Enter ⏎
          </div>
        </div>

        {/* Autocomplete Dropdown */}
        {showSuggestions && (suggestions.length > 0 || isFetching) && (
          <div 
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200 z-50"
          >
            {isFetching && suggestions.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">Searching Ingredients...</p>
              </div>
            ) : (
              <div className="p-2">
                {suggestions.map((s, idx) => (
                  <button
                    key={s.id || s.name}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all text-left ${
                      highlightedIndex === idx 
                        ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20 shadow-sm' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/30 border-transparent'
                    } border`}
                    onClick={() => addIngredient(s.name)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 capitalize tracking-tight">{s.name}</p>
                      {s.aisle && <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{s.aisle}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Plus className={`w-4 h-4 ${highlightedIndex === idx ? 'text-orange-500 scale-110' : 'text-slate-200 dark:text-slate-700'} transition-all`} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-6 min-h-[44px]">
        {ingredients.map((item) => (
          <span
            key={item}
            className="group flex items-center px-4 py-2 bg-gradient-to-br from-orange-50/80 to-white/80 dark:from-orange-500/10 dark:to-slate-900/50 backdrop-blur-md border border-orange-200/50 dark:border-orange-500/20 text-orange-850 dark:text-orange-400 rounded-full text-xs font-bold shadow-sm animate-in zoom-in-95 duration-200 transition-all hover:border-orange-500/30"
          >
            {item}
            <button
              onClick={() => removeIngredient(item)}
              className="ml-2 -mr-1 p-0.5 rounded-full text-orange-300 dark:text-orange-700 hover:text-white dark:hover:text-white hover:bg-orange-500 dark:hover:bg-orange-600 focus:outline-none transition-all"
              aria-label={`Remove ${item}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {ingredients.length === 0 && (
          <span className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.2em] animate-pulse">
            No ingredients added yet
          </span>
        )}
      </div>
    </div>
  );
}
