import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Logo from '../Logo';

export default function LoginScreen({ onLogin, onBack }: { onLogin: (u: string, p: string) => Promise<string | null>, onBack: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = await onLogin(username, password);
    if (err) setError(err);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] p-6 relative">
      <button onClick={onBack} className="absolute top-8 left-8 text-stone-500 hover:text-stone-900 font-semibold flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-stone-100"><ArrowRight size={18} className="rotate-180" /> Volver</button>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 p-10 border border-stone-100">
        <div className="text-center mb-10 flex flex-col items-center">
          <Logo className="mb-6" />
          <h1 className="text-3xl font-extrabold text-stone-900 mb-2 mt-4">Iniciar Sesión</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-semibold text-center border border-rose-100">{error}</div>}
          <div><label className="block text-sm font-bold text-stone-700 mb-2 pl-2">Usuario</label><input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" /></div>
          <div><label className="block text-sm font-bold text-stone-700 mb-2 pl-2">Contraseña</label><input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" /></div>
          <button type="submit" disabled={loading} className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 mt-4">{loading ? 'Verificando...' : 'Ingresar'}</button>
        </form>
      </motion.div>
    </div>
  );
}
