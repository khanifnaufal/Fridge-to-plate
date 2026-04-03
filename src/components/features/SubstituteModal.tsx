'use client';

import { useState, useEffect } from 'react';
import { useIngredientSubstitutes } from '@/hooks/useRecipes';
import { X, Sparkles, AlertCircle, RefreshCw, Loader2, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubstituteModalProps {
  ingredientName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SubstituteModal({ ingredientName, isOpen, onClose }: SubstituteModalProps) {
  const { data, isLoading, isError } = useIngredientSubstitutes(ingredientName);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-orange-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Warm Gradient */}
        <div className="bg-gradient-to-r from-orange-400 to-amber-500 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">Substitution Idea</h2>
                <p className="text-orange-100/80 text-xs font-bold uppercase tracking-widest mt-0.5">Ingredients Substitutes</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Ingredient Being Substituted */}
          <div className="mb-8 p-4 bg-orange-50 dark:bg-orange-500/5 rounded-2xl border border-orange-100 dark:border-orange-500/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold shrink-0">
               {ingredientName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">Don't have this?</p>
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 capitalize">{ingredientName}</h3>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5" /> Recommended Alternatives
            </h4>

            {isLoading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : isError ? (
              <div className="py-8 text-center bg-rose-50 dark:bg-rose-950/20 rounded-3xl border border-rose-100 dark:border-rose-900/50">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
                <p className="text-rose-600 dark:text-rose-400 font-bold">Oops! Something went wrong.</p>
                <p className="text-xs text-rose-400 mt-1">Failed to load substitute suggestions.</p>
              </div>
            ) : data?.substitutes && data.substitutes.length > 0 ? (
              <div className="grid gap-3">
                {data.substitutes.map((sub, index) => (
                  <div 
                    key={index} 
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-orange-50 dark:bg-slate-800/50 dark:hover:bg-orange-500/10 border border-slate-100/50 hover:border-orange-200 dark:border-slate-800 dark:hover:border-orange-500/30 transition-all duration-300"
                  >
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-700 shadow-sm group-hover:scale-110 transition-transform text-emerald-500">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{sub}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Info className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-bold">No easy swap found</p>
                <p className="text-xs text-slate-400 max-w-[200px] mx-auto mt-2 leading-relaxed">
                  We couldn't find a direct substitute for this in our database. You might try searching for a similar recipe!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Advice */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed italic text-center font-medium">
            *Pro-tip: Ingredient swaps can change the final taste or texture of your dish. Happy cooking!
          </p>
        </div>
      </div>
    </div>
  );
}
