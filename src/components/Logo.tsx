import React from 'react';
import { Heart, PawPrint } from 'lucide-react';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl text-white shadow-lg shadow-orange-500/30">
        <PawPrint size={26} className="absolute" />
        <Heart size={12} className="absolute bottom-2 right-2 text-rose-200 fill-rose-200" />
      </div>
      <div className="flex flex-col text-left">
        <span className="font-extrabold text-2xl tracking-tight text-stone-900 leading-none">Huellitas</span>
        <span className="font-bold text-sm tracking-widest text-orange-500 uppercase leading-none mt-1">Bolivia</span>
      </div>
    </div>
  );
}
