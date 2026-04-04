import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import { Heart, Calendar } from 'lucide-react';
import CartIcon from '@/components/features/CartIcon';
import UserAccount from '@/components/features/UserAccount';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Fridge-to-Plate | Let your fridge decide',
  description: 'Find amazing recipes based on ingredients you already have!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased min-h-screen transition-colors duration-300`}>
        <Providers>
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
