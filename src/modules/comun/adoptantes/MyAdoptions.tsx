import React, { useEffect, useState } from 'react';
import { Adoption, User } from '../../../types';

export default function MyAdoptions({ user }: { user: User }) {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  useEffect(() => {
    fetch('/api/adoptions').then(r => r.json()).then(data => setAdoptions(data.filter((a: any) => a.user_id === user.id)));
  }, [user.id]);

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-stone-900 mb-8">Mis Solicitudes de Adopción</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adoptions.length === 0 ? <p className="text-stone-500">Aún no has solicitado ninguna adopción.</p> : adoptions.map(a => (
          <div key={a.id} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
            <h3 className="text-xl font-bold text-stone-900 mb-2">{a.pet_name}</h3>
            <p className="text-stone-500 text-sm mb-4">Solicitado el {new Date(a.request_date).toLocaleDateString()}</p>
            <div className={`inline-block px-4 py-2 rounded-xl text-sm font-bold ${a.status === 'Aprobado' ? 'bg-emerald-100 text-emerald-700' : a.status === 'Rechazado' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>Estado: {a.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
