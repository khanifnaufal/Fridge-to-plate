import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';

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
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
