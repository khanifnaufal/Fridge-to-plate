'use client';

import { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragStartEvent, 
  DragEndEvent, 
  defaultDropAnimationSideEffects,
  closestCenter,
} from '@dnd-kit/core';
import { useMealPlan, MealEntry } from '@/hooks/useMealPlan';
import { useFavorites } from '@/hooks/useFavorites';
import { ChefHat, ShoppingBasket, Sparkles, Calendar, Search, Plus, Trash2, Clock, X, Loader2 } from 'lucide-react';
import { RecipeDetails, generateMealPlan } from '@/lib/api';
import Link from 'next/link';

// Helper components & types
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const SLOTS = [
  { id: 1, name: 'Breakfast', icon: '🍳' },
  { id: 2, name: 'Lunch', icon: '🍲' },
  { id: 3, name: 'Dinner', icon: '🍽️' },
];

import RecipeSearchModal from './RecipeSearchModal';

export default function MealPlannerView({ userId }: { userId: string }) {
  const { mealPlan, isLoading, addMeal, removeMeal, clearWeek } = useMealPlan(userId);
  const { favorites } = useFavorites();
  const [activeRecipe, setActiveRecipe] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState<{ day: string; slot: number } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const recipe = favorites.find(f => f.id === active.id);
    setActiveRecipe(recipe);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveRecipe(null);

    if (over && over.id) {
      const { day, slot } = over.data.current as { day: string; slot: number };
      const recipe = favorites.find(f => f.id === active.id);
      if (recipe) {
        try {
          await addMeal(day, slot, recipe);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const onGenerateWeek = async () => {
    setIsGenerating(true);
    try {
      const plan = await generateMealPlan('week');
      const dayKeys = Object.keys(plan.week);
      for (const day of dayKeys) {
        const dayPlan = (plan.week as any)[day];
        for (let i = 0; i < Math.min(dayPlan.meals.length, 3); i++) {
          const meal = dayPlan.meals[i];
          const slot = i + 1;
          await addMeal(day, slot, {
            id: meal.id,
            title: meal.title,
            image: `https://spoonacular.com/recipeImages/${meal.id}-312x231.${meal.imageType}`,
            readyInMinutes: meal.readyInMinutes
          });
        }
      }
    } catch (e) {
      console.error('Failed to generate meal plan', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleModalSelect = async (recipe: any) => {
    if (searchModalOpen) {
      try {
        await addMeal(searchModalOpen.day, searchModalOpen.slot, recipe);
        setSearchModalOpen(null);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Side Panel: Favorites */}
          <aside className="w-full lg:w-80 flex flex-col gap-6">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/20 dark:shadow-black/20 lg:sticky lg:top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-xl">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Collectibles</h2>
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium leading-relaxed">
                Drag & drop your saved recipes to build your perfect week.
              </p>

              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
                {favorites.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30">
                    <ChefHat className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">No recipes saved yet.</p>
                  </div>
                ) : (
                  favorites.map(recipe => (
                    <DraggableRecipe key={recipe.id} recipe={recipe} />
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* Main Content: Calendar */}
          <div className="flex-1 space-y-8">
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-orange-400 to-rose-400 rounded-2xl shadow-lg shadow-orange-500/20">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                      Meal Planner
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Plan, prep, and enjoy your week.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={clearWeek}
                    className="px-5 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-rose-500 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl transition-all"
                    disabled={isLoading || isGenerating}
                  >
                    Clear All
                  </button>
                  <button
                    onClick={onGenerateWeek}
                    disabled={isGenerating || isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    <span>Smart Fill Week</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-6">
                {DAYS.map(day => (
                  <CalendarDay 
                    key={day} 
                    day={day} 
                    entries={mealPlan.filter(m => m.day === day)} 
                    onRemove={removeMeal}
                    onSearch={(slot) => setSearchModalOpen({ day, slot })}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.4',
              },
            },
          }),
        }}>
          {activeRecipe ? (
            <div className="w-64 bg-white dark:bg-slate-900 border-2 border-orange-500 rounded-2xl p-4 shadow-2xl flex items-center gap-4 cursor-grabbing scale-105 rotate-2 transition-transform ring-4 ring-orange-500/10">
              <img src={activeRecipe.image} className="w-14 h-14 rounded-xl object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-white truncate">
                  {activeRecipe.title}
                </h4>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-orange-500 font-bold uppercase">
                  <Sparkles className="w-3 h-3" />
                  <span>Planning...</span>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <RecipeSearchModal
        isOpen={!!searchModalOpen}
        onClose={() => setSearchModalOpen(null)}
        onSelect={handleModalSelect}
        day={searchModalOpen?.day || ''}
        slotName={SLOTS.find(s => s.id === searchModalOpen?.slot)?.name || ''}
      />
    </>
  );
}

// Sub-components
import { useDraggable, useDroppable } from '@dnd-kit/core';

function DraggableRecipe({ recipe }: { recipe: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: recipe.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl flex items-center gap-4 cursor-grab hover:border-orange-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 active:cursor-grabbing transition-all ${isDragging ? 'opacity-40 grayscale blur-[1px]' : ''} hover:shadow-lg hover:shadow-slate-200/10`}
    >
      <div className="relative overflow-hidden rounded-xl">
        <img src={recipe.image} className="w-14 h-14 object-cover" alt="" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>
      <div className="flex-1 min-w-0 py-1">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-orange-500 transition-colors">
          {recipe.title}
        </h4>
        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500 font-medium">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-orange-400" />
            <span>{recipe.readyInMinutes}m</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarDay({ day, entries, onRemove, onSearch }: { day: string; entries: MealEntry[]; onRemove: (d: string, s: number) => void; onSearch: (s: number) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="pb-1 text-center">
        <h3 className="text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">{day.substring(0, 3)}</h3>
      </div>
      <div className="flex flex-col gap-4">
        {SLOTS.map(slot => (
          <MealSlot 
            key={slot.id} 
            day={day} 
            slot={slot} 
            entry={entries.find(e => e.slot === slot.id)} 
            onRemove={onRemove}
            onSearch={onSearch}
          />
        ))}
      </div>
    </div>
  );
}

function MealSlot({ day, slot, entry, onRemove, onSearch }: { day: string; slot: { id: number; name: string; icon: string }; entry?: MealEntry; onRemove: (d: string, s: number) => void; onSearch: (s: number) => void }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${day}-${slot.id}`,
    data: { day, slot: slot.id }
  });

  return (
    <div 
      ref={setNodeRef}
      className={`group min-h-[160px] rounded-3xl border-2 transition-all p-3 relative flex flex-col ${
        isOver 
          ? 'bg-orange-50/50 dark:bg-orange-500/5 border-orange-500 border-dashed scale-[1.03] z-10 shadow-xl shadow-orange-500/10' 
          : 'bg-white/80 dark:bg-slate-900 border-slate-100/50 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-lg'
      }`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <span className="text-xs">{slot.icon}</span>
          {slot.name}
        </span>
        {entry && (
          <button 
            onClick={() => onRemove(day, slot.id)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {entry ? (
        <Link href={`/recipe/${entry.recipe_id}`} className="flex-1 flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-2xl shadow-sm">
            <img src={entry.recipe_image} className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h4 className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 line-clamp-2 leading-relaxed px-1">
            {entry.recipe_title}
          </h4>
        </Link>
      ) : (
        <button 
          onClick={() => onSearch(slot.id)}
          className="flex-1 flex flex-col items-center justify-center gap-3 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 rounded-2xl transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 items-center justify-center flex text-slate-300 dark:text-slate-600 group-hover:bg-orange-50 dark:group-hover:bg-orange-500/10 group-hover:text-orange-400 transition-all">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest group-hover:text-orange-400 transition-colors">Add Item</span>
        </button>
      )}
    </div>
  );
}
