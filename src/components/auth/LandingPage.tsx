import React from 'react';
import { motion } from 'motion/react';
import { Check, Heart, HeartHandshake, Search, Sparkles, Users } from 'lucide-react';
import Logo from '../Logo';

export default function LandingPage({ onLoginClick, onRegisterClick }: { onLoginClick: () => void, onRegisterClick: () => void }) {
  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col font-sans overflow-x-hidden">
      <nav className="px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full relative z-10">
        <Logo />
        <div className="flex gap-3">
          <button onClick={onLoginClick} className="text-stone-600 font-bold hover:text-stone-900 px-4 py-2 transition-colors">Ingresar</button>
          <button onClick={onRegisterClick} className="bg-amber-500 text-white px-6 py-2.5 rounded-full font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20">Registrarse</button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-6xl mx-auto py-12 lg:py-24 relative z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-rose-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-32 h-32 bg-teal-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-amber-100 text-amber-700 font-bold text-sm tracking-wide mb-6">
            <Sparkles size={16} /> Adopta, no compres 🐾
          </span>
          <h1 className="text-6xl md:text-8xl font-extrabold text-stone-900 tracking-tight leading-[1.1] mb-8">
            Encuentra a tu <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">mejor amigo</span>
          </h1>
          <p className="text-xl text-stone-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Conectamos mascotas rescatadas con familias amorosas. Únete a nuestra plataforma como adoptante, voluntario o veterinario y haz la diferencia en sus vidas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onRegisterClick} className="w-full sm:w-auto bg-stone-900 text-white px-8 py-4 rounded-full font-extrabold text-lg hover:bg-stone-800 transition-transform hover:scale-105 shadow-xl shadow-stone-900/20 flex items-center justify-center gap-2">
              <Heart size={20} className="text-rose-400 fill-rose-400" /> Quiero Adoptar
            </button>
            <button onClick={() => alert('¡Gracias por tu interés! Por favor envía un correo a voluntariado@huellitasbolivia.org para más información.')} className="w-full sm:w-auto bg-white text-stone-700 border-2 border-stone-200 px-8 py-4 rounded-full font-extrabold text-lg hover:border-amber-500 hover:text-amber-600 transition-all shadow-sm flex items-center justify-center gap-2">
              <Users size={20} /> Ser Voluntario
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl relative z-10">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-100 rotate-[-2deg] hover:rotate-0 transition-transform">
            <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400&h=400" alt="Dog" className="w-full h-40 object-cover rounded-2xl mb-3" referrerPolicy="no-referrer" />
            <p className="font-bold text-stone-800 text-center">Perros Felices</p>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-100 rotate-[3deg] hover:rotate-0 transition-transform translate-y-4">
            <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400&h=400" alt="Cat" className="w-full h-40 object-cover rounded-2xl mb-3" referrerPolicy="no-referrer" />
            <p className="font-bold text-stone-800 text-center">Gatos Curiosos</p>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-100 rotate-[-1deg] hover:rotate-0 transition-transform">
            <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400&h=400" alt="Puppy" className="w-full h-40 object-cover rounded-2xl mb-3" referrerPolicy="no-referrer" />
            <p className="font-bold text-stone-800 text-center">Cachorros</p>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-100 rotate-[2deg] hover:rotate-0 transition-transform translate-y-4">
            <img src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=400&h=400" alt="Kitten" className="w-full h-40 object-cover rounded-2xl mb-3" referrerPolicy="no-referrer" />
            <p className="font-bold text-stone-800 text-center">Rescatados</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-32 w-full max-w-5xl text-left relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-stone-900 mb-4">¿Cómo funciona?</h2>
            <p className="text-stone-500 text-lg">Un proceso simple para encontrar a tu compañero ideal.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Search size={32} /></div>
              <h3 className="text-xl font-extrabold text-stone-900 mb-3">1. Explora</h3>
              <p className="text-stone-500 leading-relaxed">Navega por nuestro catálogo de mascotas rescatadas. Filtra por especie, edad y encuentra al animal que mejor se adapte a tu estilo de vida.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><HeartHandshake size={32} /></div>
              <h3 className="text-xl font-extrabold text-stone-900 mb-3">2. Solicita</h3>
              <p className="text-stone-500 leading-relaxed">Crea tu cuenta gratuita y envía una solicitud de adopción. Nuestro equipo de voluntarios revisará tu perfil cuidadosamente.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Check size={32} /></div>
              <h3 className="text-xl font-extrabold text-stone-900 mb-3">3. Adopta</h3>
              <p className="text-stone-500 leading-relaxed">Una vez aprobada la solicitud, coordinaremos la entrega. ¡Prepárate para darle la bienvenida a tu nuevo mejor amigo!</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
