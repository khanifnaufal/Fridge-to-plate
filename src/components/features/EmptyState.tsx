import { Carrot } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-4 mt-8 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-orange-50 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
         <Carrot className="w-12 h-12 sm:w-16 sm:h-16 text-orange-400 absolute rotate-12 drop-shadow-sm" />
         <div className="absolute top-0 right-2 w-4 h-4 rounded-full bg-orange-200 animate-pulse"></div>
         <div className="absolute bottom-4 left-2 w-3 h-3 rounded-full bg-orange-300 animate-pulse delay-75"></div>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 text-center">
        Kulkas Anda Menunggu!
      </h2>
      <p className="text-slate-500 text-center max-w-md mx-auto text-sm sm:text-base leading-relaxed">
        Ketik bahan-bahan makanan yang Anda miliki di atas, dan kami akan menyulapkannya menjadi ide resep lezat hanya untuk Anda.
      </p>
    </div>
  );
}
