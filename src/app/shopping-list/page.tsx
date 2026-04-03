'use client';

import { useShoppingList } from '@/hooks/useShoppingList';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Circle, Trash2, ShoppingCart, ShoppingBag, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ShoppingListPage() {
  const { items, isLoaded, toggleItem, removeItem, clearCompleted, clearAll } = useShoppingList();

  const completedCount = items.filter(i => i.checked).length;
  const pendingCount = items.length - completedCount;

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center py-20 px-4">
        <div className="animate-pulse space-y-6 w-full max-w-2xl">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 w-1/3 rounded-md mb-8" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 w-full rounded-2xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm rounded-full text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="flex items-end justify-between mb-8 animate-in slide-in-from-bottom-4 duration-500 fade-in">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-orange-500" />
            Shopping List
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {items.length} items total • {pendingCount} left to buy
          </p>
        </div>
        
        {completedCount > 0 && (
          <button
            onClick={clearCompleted}
            className="text-sm font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition-colors"
          >
            Clear bought
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200/60 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-none animate-in zoom-in-95 duration-500 fade-in">
          <div className="w-20 h-20 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Your list is empty</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8">
            Looks like you have everything you need! Find new recipes to add missing ingredients here.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-colors shadow-md hover:shadow-lg"
          >
            Explore Recipes
          </Link>
        </div>
      ) : (
        <div className="space-y-4 animate-in slide-in-from-bottom-8 duration-700 fade-in">
          {items.map((item) => (
            <div 
              key={item.id} 
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 group",
                item.checked 
                  ? "bg-slate-50/50 dark:bg-slate-800/20 border-transparent" 
                  : "bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-orange-500/30"
              )}
            >
              <button 
                onClick={() => toggleItem(item.id)}
                className="shrink-0 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500/50 rounded-full"
              >
                {item.checked ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 transition-transform active:scale-90" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 group-hover:text-amber-400 transition-colors active:scale-90" />
                )}
              </button>
              
              {item.image && (
                 /* eslint-disable-next-line @next/next/no-img-element */
                 <img 
                   src={item.image.startsWith('http') ? item.image : `https://img.spoonacular.com/ingredients_100x100/${item.image}`}
                   alt={item.name}
                   onError={(e) => { e.currentTarget.style.display = 'none'; }}
                   className={cn("w-10 h-10 object-contain mx-2 transition-opacity", item.checked ? "opacity-40 grayscale" : "")}
                 />
              )}

              <span className={cn(
                "flex-grow text-lg font-medium transition-all",
                item.checked 
                  ? "text-slate-400 dark:text-slate-500 line-through" 
                  : "text-slate-700 dark:text-slate-200"
              )}>
                {item.name}
              </span>
              
              <button 
                onClick={() => removeItem(item.id)}
                className="shrink-0 opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full transition-all focus:opacity-100 focus:outline-none"
                title="Remove item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          {items.length > 0 && (
            <div className="pt-8 flex justify-center opacity-70 hover:opacity-100 transition-opacity">
               <button
                onClick={clearAll}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:text-rose-400 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors border border-rose-100 dark:border-rose-900/30"
               >
                 <AlertTriangle className="w-4 h-4" />
                 Clear All Items
               </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
