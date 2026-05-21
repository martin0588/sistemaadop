import { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from '../Logo';

export default function ForgotPasswordScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      setMessage(
        data.message ||
          'Si el correo existe, se enviaron instrucciones.'
      );
    } catch {
      setMessage('Solicitud registrada. Si el correo existe, se enviaron instrucciones.');
    }
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 p-10 border border-stone-100"
      >
        <div className="text-center mb-10 flex flex-col items-center">
          <Logo className="mb-6" />

          <h1 className="text-3xl font-extrabold text-stone-900 mb-2 mt-4">
            Recuperar Contraseña
          </h1>

          <p className="text-stone-500 font-medium text-sm">
            Ingresa tu correo electrónico
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-amber-600 transition-colors"
          >
            Enviar enlace
          </button>

          {message && (
            <div className="text-center text-sm text-stone-600 font-semibold">
              {message}
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
}