'use client';

import { useAuth } from '@/hooks/useAuth';
import MealPlannerView from '@/components/features/MealPlannerView';
import { Loader2, ChefHat, LogIn, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MealPlannerPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-100 dark:border-slate-800 rounded-full border-t-orange-500 animate-spin" />
          <ChefHat className="absolute inset-0 m-auto w-6 h-6 text-orange-500" />
        </div>
        <p className="text-slate-500 font-medium animate-pulse">Syncing your kitchen...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen py-20 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="mb-12 relative">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-500/10 dark:to-rose-500/10 rounded-[3rem] flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-orange-500" />
          </div>
          <div className="absolute -top-4 -right-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl shadow-orange-500/10">
            <LogIn className="w-6 h-6 text-orange-500" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-white mb-6 tracking-tight">
          Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Weekly Planner</span>
        </h1>
        
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-xl leading-relaxed">
          Sign in to save your meal plans and access them on any device. Start organizing your taste buds today!
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/login"
            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black rounded-[2rem] shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            Sign In / Sign Up
            <LogIn className="w-5 h-5" />
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-10 py-5 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto">
      <header className="mb-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-orange-500 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          BACK TO DASHBOARD
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                Personalized
              </span>
              <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                Connected: {user.email}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-white tracking-tight">
              Gourmet <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Scheduler</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/shopping-list"
              className="px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              Generate Shopper List
            </Link>
          </div>
        </div>
      </header>

      <MealPlannerView userId={user.id} />
    </main>
  );
}
