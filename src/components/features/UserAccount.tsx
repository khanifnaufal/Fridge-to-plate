'use client';

import { useAuth } from '@/hooks/useAuth';
import { User, LogOut, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function UserAccount() {
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:block text-right mr-1">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Signed In</p>
          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate max-w-[100px]">{user.email}</p>
        </div>
        <button
          onClick={signOut}
          className="p-2 sm:p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all shadow-sm group"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="p-2 sm:p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all shadow-sm group flex items-center gap-2"
      title="Sign In"
    >
      <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className="hidden sm:block text-xs font-bold mr-1">Sign In</span>
    </Link>
  );
}
