'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" aria-hidden="true" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-sm text-slate-800 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700 transition-all active:scale-95 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500/50"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 animate-in zoom-in spin-in-180 duration-500 text-orange-400" />
      ) : (
        <Moon className="w-5 h-5 animate-in zoom-in spin-in-12 duration-500 text-indigo-500" />
      )}
    </button>
  );
}
