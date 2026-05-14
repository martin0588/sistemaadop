import React, { useEffect, useState } from 'react';
import { ArrowRight, ClipboardList, Heart, HeartHandshake, PawPrint, Sparkles, Star, Users } from 'lucide-react';
import { Pet, User } from '../../types';
import PetCard from '../mascotas/PetCard';

export default function Dashboard({ setCurrentTab, user }: { setCurrentTab: (tab: string) => void, user: User }) {
  const [stats, setStats] = useState({ totalPets: 0, adoptedPets: 0, pendingAdoptions: 0, totalUsers: 0 });
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([]);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats);
    fetch('/api/pets').then(r => r.json()).then(data => setFeaturedPets(data.filter((p: Pet) => p.status === 'Disponible').slice(0, 3)));
  }, []);

  return (
    <div className="space-y-12 pb-12">
      <div className="relative bg-amber-500 rounded-[3rem] overflow-hidden shadow-xl">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=1200&h=400" alt="Dogs and cats" className="w-full h-full object-cover opacity-20 mix-blend-overlay" referrerPolicy="no-referrer" />
        </div>
        <div className="relative z-10 p-10 md:p-16 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-md">Encuentra a tu mejor amigo</h1>
          <p className="text-amber-50 text-lg md:text-xl max-w-2xl mb-10 font-medium">Dale una segunda oportunidad a un animal rescatado. En Huellitas Bolivia tenemos decenas de colitas esperando por un hogar lleno de amor.</p>
          <button onClick={() => setCurrentTab('pets')} className="bg-white text-amber-600 px-8 py-4 rounded-full font-extrabold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3">
            <Heart className="fill-amber-500" /> Adoptar Ahora
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4"><HeartHandshake size={28} /></div>
          <h3 className="text-3xl font-black text-stone-900 mb-1">{stats.adoptedPets}</h3>
          <p className="text-stone-500 font-medium text-sm uppercase tracking-wider">Adopciones</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4"><PawPrint size={28} /></div>
          <h3 className="text-3xl font-black text-stone-900 mb-1">{stats.totalPets}</h3>
          <p className="text-stone-500 font-medium text-sm uppercase tracking-wider">Rescatados</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4"><ClipboardList size={28} /></div>
          <h3 className="text-3xl font-black text-stone-900 mb-1">{stats.pendingAdoptions}</h3>
          <p className="text-stone-500 font-medium text-sm uppercase tracking-wider">En Proceso</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4"><Users size={28} /></div>
          <h3 className="text-3xl font-black text-stone-900 mb-1">{stats.totalUsers}</h3>
          <p className="text-stone-500 font-medium text-sm uppercase tracking-wider">Voluntarios</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-stone-900 flex items-center gap-2"><Sparkles className="text-amber-500" /> Amigos Destacados</h2>
            <p className="text-stone-500 font-medium mt-2">Ellos están esperando conocerte hoy mismo.</p>
          </div>
          <button onClick={() => setCurrentTab('pets')} className="text-amber-600 font-bold hover:text-amber-700 flex items-center gap-2 hidden sm:flex">Ver todos <ArrowRight size={18} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPets.map(pet => <PetCard key={pet.id} pet={pet} user={user} onUpdate={() => { }} />)}
        </div>
      </div>

      <div className="bg-stone-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500 rounded-full blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 flex items-center justify-center gap-3"><Star className="text-amber-400 fill-amber-400" /> Casos de Éxito</h2>
            <p className="text-stone-400 text-lg max-w-2xl mx-auto">Historias felices de colitas que encontraron su hogar para siempre gracias a nuestra comunidad.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-stone-800/50 backdrop-blur-md p-6 rounded-3xl border border-stone-700 flex gap-6 items-center">
              <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200&h=200" alt="Dog" className="w-24 h-24 rounded-full object-cover border-4 border-stone-700" referrerPolicy="no-referrer" />
              <div>
                <h3 className="text-xl font-bold text-amber-400 mb-1">Toby & Familia Martinez</h3>
                <p className="text-stone-300 text-sm leading-relaxed">"Toby llegó con mucho miedo, pero ahora es el rey de la casa. Gracias Huellitas por unirnos."</p>
              </div>
            </div>
            <div className="bg-stone-800/50 backdrop-blur-md p-6 rounded-3xl border border-stone-700 flex gap-6 items-center">
              <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200&h=200" alt="Cat" className="w-24 h-24 rounded-full object-cover border-4 border-stone-700" referrerPolicy="no-referrer" />
              <div>
                <h3 className="text-xl font-bold text-amber-400 mb-1">Michi & Ana</h3>
                <p className="text-stone-300 text-sm leading-relaxed">"Adoptar a Michi fue la mejor decisión. Es mi compañera de estudio y me llena de alegría todos los días."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
