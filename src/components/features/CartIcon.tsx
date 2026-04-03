'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useShoppingList } from '@/hooks/useShoppingList';

export default function CartIcon() {
  const { items, isLoaded } = useShoppingList();
  const pendingCount = items.filter(i => !i.checked).length;

  return (
    <Link 
      href="/shopping-list"
      className="relative p-2 sm:p-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all shadow-sm flex items-center gap-2 group"
      title="Shopping List"
    >
      <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
      {isLoaded && pendingCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] flex items-center justify-center rounded-full animate-in zoom-in px-1">
          {pendingCount > 99 ? '99+' : pendingCount}
        </span>
      )}
    </Link>
  );
}
