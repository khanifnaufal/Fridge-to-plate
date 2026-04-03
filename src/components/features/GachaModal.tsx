'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchRandomRecipes, RecipeResponse } from '@/lib/api';
import { X, Sparkles, ChefHat, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useShoppingList } from '@/hooks/useShoppingList';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface GachaModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: RecipeResponse[];
}

export default function GachaModal({ isOpen, onClose, recipes: initialRecipes }: GachaModalProps) {
  const [recipes, setRecipes] = useState<RecipeResponse[]>(initialRecipes);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeResponse | null>(null);
  const { addIngredients } = useShoppingList();
  const [addedTemp, setAddedTemp] = useState(false);

  const startRoll = useCallback((itemsToRoll: RecipeResponse[]) => {
    if (!itemsToRoll || itemsToRoll.length === 0) return;
    
    setIsRolling(true);
    setSelectedRecipe(null);
    let speed = 50;
    let elapsed = 0;
    let currentLocalIndex = Math.floor(Math.random() * itemsToRoll.length);
    const duration = 3000 + Math.random() * 1000; // 3-4 seconds

    const roll = () => {
      currentLocalIndex = (currentLocalIndex + 1) % itemsToRoll.length;
      setCurrentIndex(currentLocalIndex);
      elapsed += speed;

      // Slow down effect
      if (elapsed > duration * 0.7) {
        speed += 20; 
      } else if (elapsed > duration * 0.4) {
        speed += 5;
      }

      if (elapsed < duration) {
        setTimeout(roll, speed);
      } else {
        // Stop
        setIsRolling(false);
        setSelectedRecipe(itemsToRoll[currentLocalIndex]);
      }
    };

    setTimeout(roll, speed);
  }, []);

  // Start roll automatically when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialRecipes && initialRecipes.length > 0) {
        setRecipes(initialRecipes);
        startRoll(initialRecipes);
      } else {
        setIsLoading(true);
        fetchRandomRecipes(10).then(data => {
          setRecipes(data);
          setIsLoading(false);
          startRoll(data);
        }).catch(err => {
          console.error("Failed to fetch random recipes", err);
          setIsLoading(false);
          onClose(); // Close if failed
        });
      }
    } else {
      setSelectedRecipe(null);
      setIsRolling(false);
    }
  }, [isOpen, initialRecipes, onClose, startRoll]);

  if (!isOpen) return null;

  const currentRecipe = recipes[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => !isRolling && !isLoading && onClose()}
      />

      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200/50 dark:border-slate-800 transform transition-all duration-500",
        (isRolling || isLoading) ? "scale-95" : "scale-100",
        selectedRecipe ? "animate-in zoom-in spin-in-2" : ""
      )}>
        {!isRolling && !isLoading && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            {isLoading ? "Fetching secret recipes..." : isRolling ? "Cooking up magic..." : "Your Random Recipe!"}
          </h2>
        </div>

        {/* Roulette Display */}
        {isLoading ? (
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6 border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : recipes.length > 0 && currentRecipe ? (
          <div className={cn(
            "relative w-full aspect-square rounded-2xl overflow-hidden mb-6 border-4 flex flex-col transition-colors duration-300",
            !isRolling && selectedRecipe 
              ? "border-amber-400 dark:border-amber-500 shadow-[0_0_30px_rgba(251,191,36,0.3)]" 
              : "border-slate-100 dark:border-slate-800"
          )}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={currentRecipe.image} 
              alt={currentRecipe.title}
              className={cn(
                "w-full h-full object-cover transition-all",
                isRolling ? "blur-[2px] opacity-80" : "blur-0 opacity-100 scale-105 duration-700"
              )}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-6 pt-12">
              <h3 className={cn(
                "text-white font-bold text-lg leading-tight transition-transform",
                isRolling ? "translate-y-2 opacity-50" : "translate-y-0 opacity-100"
              )}>
                {currentRecipe.title}
              </h3>
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {isRolling || isLoading ? (
            <div className="w-full flex justify-center py-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          ) : (
            <>
              {selectedRecipe && (
                <>
                  <Link 
                    href={`/recipe/${selectedRecipe.id}`}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold rounded-xl text-center transition-all shadow-md hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2"
                  >
                    <ChefHat className="w-5 h-5" />
                    Let&apos;s Cook This!
                  </Link>
                  <button
                    onClick={() => {
                      const allIngredients = selectedRecipe.usedIngredients || [];
                      if (allIngredients.length > 0) {
                        addIngredients(allIngredients);
                        setAddedTemp(true);
                        setTimeout(() => setAddedTemp(false), 2000);
                      }
                    }}
                    className={cn(
                      "w-full py-3 px-4 font-bold rounded-xl text-center transition-all flex items-center justify-center gap-2 border",
                      addedTemp
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                        : "bg-white text-orange-500 border-orange-200 hover:bg-orange-50 dark:bg-slate-900 dark:text-orange-400 dark:border-orange-500/30 dark:hover:bg-orange-500/10"
                    )}
                  >
                    {addedTemp ? <CheckCircle2 className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                    {addedTemp ? "Added to Cart" : "Buy Ingredients"}
                  </button>
                </>
              )}
              <button
                onClick={() => startRoll(recipes)}
                className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-center transition-colors"
              >
                Spin Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
