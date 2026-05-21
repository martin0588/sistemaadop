import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Eye, EyeOff, User, Lock } from 'lucide-react';
import Logo from '../Logo';

export default function LoginScreen({
  onLogin,
  onBack,
  onForgotPassword,
}: {
  onLogin: (u: string, p: string) => Promise<string | null>;
  onBack: () => void;
  onForgotPassword: () => void;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Ingresa tu usuario.');
      return;
    }

    if (!password.trim()) {
      setError('Ingresa tu contraseña.');
      return;
    }

    setLoading(true);

    const err = await onLogin(username.trim(), password);

    if (err) setError(err);

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] p-6 relative">
      <button
        onClick={onBack}
        className="absolute top-8 left-8 text-stone-500 hover:text-stone-900 font-semibold flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-stone-100"
      >
        <ArrowRight size={18} className="rotate-180" />
        Volver
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 p-10 border border-stone-100"
      >
        <div className="text-center mb-10 flex flex-col items-center">
          <Logo className="mb-6" />
          <h1 className="text-3xl font-extrabold text-stone-900 mb-2 mt-4">
            Iniciar Sesión
          </h1>
          <p className="text-sm text-stone-500 font-semibold">
            Accede a Huellitas Bolivia
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-semibold text-center border border-rose-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2 pl-2">
              Usuario
            </label>

            <div className="relative">
              <User
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2 pl-2">
              Contraseña
            </label>

            <div className="relative">
              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              />

              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-stone-600 font-semibold cursor-pointer">
              <input
               
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-amber-500"
              />
              
            </label>

            <button
                 type="button"
                 onClick={onForgotPassword}
                 className="text-amber-600 hover:text-amber-700 font-bold"
>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}