import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Logo from '../Logo';

export default function RegisterScreen({ onRegister, onBack }: { onRegister: (data: any) => Promise<string | null>, onBack: () => void }) {
  const [formData, setFormData] = useState({ full_name: '', email: '', username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = await onRegister(formData);
    if (err) setError(err);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] p-6 relative">
      <button onClick={onBack} className="absolute top-8 left-8 text-stone-500 hover:text-stone-900 font-semibold flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-stone-100"><ArrowRight size={18} className="rotate-180" /> Volver</button>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 p-10 border border-stone-100">
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo className="mb-4" />
          <h1 className="text-2xl font-extrabold text-stone-900 mb-1 mt-2">Crear Cuenta</h1>
          <p className="text-stone-500 text-sm">Regístrate como adoptante</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-semibold text-center border border-rose-100">{error}</div>}
          <div><label className="block text-sm font-bold text-stone-700 mb-1 pl-2">Nombre Completo</label><input type="text" required value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" /></div>
          <div><label className="block text-sm font-bold text-stone-700 mb-1 pl-2">Correo Electrónico</label><input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" /></div>
          <div><label className="block text-sm font-bold text-stone-700 mb-1 pl-2">Usuario</label><input type="text" required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" /></div>
          <div><label className="block text-sm font-bold text-stone-700 mb-1 pl-2">Contraseña</label><input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" /></div>
          <button type="submit" disabled={loading} className="w-full bg-amber-500 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 mt-2">{loading ? 'Registrando...' : 'Registrarse'}</button>
        </form>
      </motion.div>
    </div>
  );
}
