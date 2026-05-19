import React, { useState } from 'react';

export default function VerifyEmailScreen({
  email,
  onVerified,
  onBack,
}: {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (data.success) {
        onVerified();
      } else {
        setError(data.message || 'Código incorrecto');
      }
    } catch {
      setError('Error de conexión');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-stone-100">
        <h1 className="text-3xl font-extrabold text-stone-900 text-center mb-3">
          Verificar correo
        </h1>

        <p className="text-center text-stone-500 mb-8">
          Ingresa el código enviado a <b>{email}</b>
        </p>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-semibold text-center border border-rose-100 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <input
            type="text"
            required
            maxLength={6}
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Código de 6 dígitos"
            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 text-center text-2xl font-bold tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-amber-600 transition-colors"
          >
            {loading ? 'Verificando...' : 'Verificar'}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full text-stone-500 font-bold"
          >
            Volver
          </button>
        </form>
      </div>
    </div>
  );
}