'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchRecipeNutrition } from '@/lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, Flame, Loader2 } from 'lucide-react';

export default function NutritionWidget({ recipeId }: { recipeId: string }) {
  const { data: nutrition, isLoading, isError } = useQuery({
    queryKey: ['nutrition', recipeId],
    queryFn: () => fetchRecipeNutrition(recipeId),
    staleTime: 1000 * 60 * 60 * 24, // 24h
  });

  if (isLoading) {
    return (
      <div className="w-full h-72 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 animate-pulse transition-colors pb-8">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin mb-4" />
        <span className="text-slate-500 font-medium tracking-wide">Analyzing nutrients...</span>
      </div>
    );
  }

  if (isError || !nutrition) {
    return (
      <div className="w-full p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 transition-colors">
        <Activity className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Nutrition data unavailable for this recipe.</p>
      </div>
    );
  }

  const parseValue = (val: string) => parseFloat(val.replace(/[^0-9.]/g, '')) || 0;

  const data = [
    { name: 'Carbs', value: parseValue(nutrition.carbs), color: '#fbbf24', suffix: 'g' }, // amber-400
    { name: 'Protein', value: parseValue(nutrition.protein), color: '#f43f5e', suffix: 'g' }, // rose-500
    { name: 'Fat', value: parseValue(nutrition.fat), color: '#34d399', suffix: 'g' }, // emerald-400
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-2 mb-6 sm:mb-8">
        <div className="p-2 rounded-full bg-orange-50 dark:bg-orange-500/10">
          <Flame className="w-6 h-6 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Nutrition Facts</h2>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="90%"
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                cornerRadius={10}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: any) => [`${value}g`, name]}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
                  fontWeight: 'bold',
                  padding: '12px 16px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 leading-none">
              {parseValue(nutrition.calories)}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1.5">
              Calories
            </span>
          </div>
        </div>

        {/* Legend / Stats */}
        <div className="flex flex-col gap-4 w-full flex-grow pt-6 mt-2 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
            Macronutrients
          </h3>
          {data.map((item) => (
            <div key={item.name} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-default">
              <div className="flex items-center gap-3.5">
                <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                <span className="font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
              </div>
              <span className="font-bold text-lg text-slate-800 dark:text-slate-200">
                {item.value} <span className="text-sm text-slate-400">{item.suffix}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
