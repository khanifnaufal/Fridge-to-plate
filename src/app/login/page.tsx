'use client';

import AuthForm from '@/components/auth/AuthForm';
import Link from 'next/link';
import { ChefHat, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // If user is already logged in, show a different state or redirect
  // But as per user request, we have a button for the transition, so 
  // maybe we just show "Already Logged In" with a button to the planner.

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center">
          <Link 
            href="/"
            className="mb-8 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow group self-start"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:-translate-x-1 transition-transform" />
          </Link>
          
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-rose-500 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-500/20 mb-6 group transition-transform hover:scale-110">
            <ChefHat className="w-9 h-9 text-white group-hover:rotate-12 transition-transform" />
          </div>
        </div>

        {user ? (
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">You're already logged in!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Logged in as <span className="font-semibold text-slate-800 dark:text-slate-200">{user.email}</span>
            </p>
            <div className="space-y-4">
              <Link
                href="/meal-planner"
                className="block w-full py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 transition-all"
              >
                Go to Meal Planner
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-slate-500 hover:text-rose-500 font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <AuthForm />
        )}
      </div>
    </main>
  );
}

// Fixed Supabase import for signout button
import { supabase } from '@/lib/supabase';
