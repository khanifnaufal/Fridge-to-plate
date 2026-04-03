'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchRecipePriceBreakdown } from '@/lib/api';
import { Loader2, DollarSign, ReceiptText, ChefHat, Wallet, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceEstimatorProps {
  recipeId: string;
  className?: string;
}

const EXCHANGE_RATE_IDR = 16000; // 1 USD = 16,000 IDR

export default function PriceEstimator({ recipeId, className }: PriceEstimatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: priceData, isLoading, isError } = useQuery({
    queryKey: ['priceBreakdown', recipeId],
    queryFn: () => fetchRecipePriceBreakdown(recipeId),
    staleTime: 1000 * 60 * 60 * 24, // 24h
  });

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const formatUSD = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatIDR = (cents: number) => {
    const totalIdr = Math.round((cents / 100) * EXCHANGE_RATE_IDR);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(totalIdr).replace(/\,00$/, '');
  };

  if (isLoading) return (
    <div className={cn("inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse", className)}>
      <Loader2 className="w-3 h-3 animate-spin text-emerald-500" />
      <span className="text-[10px] font-bold text-slate-400">Loading budget...</span>
    </div>
  );

  if (isError || !priceData) return null;

  return (
    <>
      {/* TRIGGER: COMPACT VIEW */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "group flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-5 py-3 sm:py-1.5 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-left",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500 text-white shadow-emerald-500/20 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Wallet className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none mb-0.5">Budget info</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-800 dark:text-slate-100">{formatUSD(priceData.totalCostPerServing)}</span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 italic">≈ {formatIDR(priceData.totalCostPerServing)}</span>
            </div>
          </div>
        </div>
      </button>

      {/* MODAL OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsOpen(false)}>
          {/* MODAL CARD */}
          <div 
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 sm:p-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Cooking Budget</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Estimated cost breakdown</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Container */}
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-6 sm:p-8">
              {/* Hero Cost */}
              <div className="bg-emerald-600 rounded-3xl p-6 text-white mb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl" />
                <div className="relative z-10">
                  <p className="text-emerald-100/80 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                    <ChefHat className="w-3.5 h-3.5" /> Total per serving
                  </p>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-4xl font-black">{formatUSD(priceData.totalCostPerServing)}</h3>
                    <span className="text-lg font-bold text-emerald-100/90 italic">≈ {formatIDR(priceData.totalCostPerServing)}</span>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <ReceiptText className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                    Ingredient Expenses
                  </h3>
                </div>
                
                <div className="grid gap-2.5">
                  {priceData.ingredients.map((ing, i) => (
                    <div key={`${ing.name}-${i}`} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800/50 group/item transition-colors hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500/30">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm group-hover/item:scale-105 transition-transform duration-300">
                          <img 
                            src={ing.image ? `https://spoonacular.com/cdn/ingredients_100x100/${ing.image}` : 'https://spoonacular.com/cdn/ingredients_100x100/placeholder.png'} 
                            alt={ing.name}
                            className="w-full h-full object-cover p-1.5"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-slate-700 dark:text-slate-200 block text-sm leading-tight capitalize">{ing.name}</span>
                          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                            {ing.amount.metric.value.toFixed(1).replace(/\.0$/, '')} {ing.amount.metric.unit}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">{formatUSD(ing.price)}</div>
                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{formatIDR(ing.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Global Total */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center px-2">
                 <div className="flex flex-col">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Total Estimated Cost</span>
                   <span className="text-[10px] text-slate-400 mt-1 italic">For {priceData.ingredients.length} ingredients</span>
                 </div>
                 <div className="text-right">
                   <div className="text-xl font-black text-slate-800 dark:text-slate-100 leading-none">{formatUSD(priceData.totalCost)}</div>
                   <div className="text-xs font-bold text-slate-400 mt-1 tracking-wide">{formatIDR(priceData.totalCost)}</div>
                 </div>
              </div>
            </div>

            {/* Footer Disclaimer */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-4">
              <Info className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 italic leading-relaxed">
                *Prices are based on average US market rates converted to IDR (1 USD = {EXCHANGE_RATE_IDR.toLocaleString('id-ID')} IDR). Local grocery prices may vary by region and season.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
