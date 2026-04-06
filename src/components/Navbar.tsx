'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Heart, Calendar } from 'lucide-react';
import CartIcon from '@/components/features/CartIcon';
import UserAccount from '@/components/features/UserAccount';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  
  // Hide navbar on recipe detail pages to avoid collision with the back button
  if (pathname?.startsWith('/recipe/')) {
    return null;
  }

  return (
    <>
      {/* Top Bar - Left Side */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-2 sm:gap-3">
        <Link 
          href="/meal-planner"
          className="p-2 sm:p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all shadow-sm flex items-center gap-2 group"
          title="Meal Planner"
        >
          <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </Link>
        <CartIcon />
        <Link 
          href="/saved"
          className="p-2 sm:p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all shadow-sm flex items-center gap-2 group"
          title="Saved Recipes"
        >
          <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </Link>
      </div>

      {/* Top Bar - Right Side */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3">
        <UserAccount />
        <ThemeToggle />
      </div>
    </>
  );
}
