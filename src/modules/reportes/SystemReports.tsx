import React, { useEffect, useState } from 'react';
import { Activity, Users } from 'lucide-react';

export default function SystemReports() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => { fetch('/api/stats').then(r => r.json()).then(setStats); }, []);

  if (!stats) return <div className="p-8 text-center text-stone-500">Cargando reportes...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold text-stone-900 mb-8">Informes del Sistema</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center"><Activity size={32} /></div>
            <div><p className="text-stone-500 font-bold uppercase tracking-wider text-sm mb-1">Tasa de Adopción</p><p className="text-4xl font-extrabold text-stone-900">{stats.totalPets > 0 ? Math.round((stats.adoptedPets / stats.totalPets) * 100) : 0}%</p></div>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-3 mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${stats.totalPets > 0 ? Math.round((stats.adoptedPets / stats.totalPets) * 100) : 0}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Users size={32} /></div>
          <div><p className="text-stone-500 font-bold uppercase tracking-wider text-sm mb-1">Usuarios Activos</p><p className="text-4xl font-extrabold text-stone-900">{stats.totalUsers}</p></div>
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-8">
        <h3 className="text-xl font-bold text-stone-800 mb-6">Resumen General</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-stone-50 rounded-2xl"><span className="font-bold text-stone-600">Total Mascotas Registradas</span><span className="font-extrabold text-stone-900">{stats.totalPets}</span></div>
          <div className="flex justify-between items-center p-4 bg-stone-50 rounded-2xl"><span className="font-bold text-stone-600">Mascotas Adoptadas</span><span className="font-extrabold text-emerald-600">{stats.adoptedPets}</span></div>
          <div className="flex justify-between items-center p-4 bg-stone-50 rounded-2xl"><span className="font-bold text-stone-600">Solicitudes Pendientes</span><span className="font-extrabold text-amber-600">{stats.pendingAdoptions}</span></div>
          <div className="flex justify-between items-center p-4 bg-stone-50 rounded-2xl"><span className="font-bold text-stone-600">Mascotas en Tratamiento</span><span className="font-extrabold text-rose-600">{stats.treatmentPets || 0}</span></div>
        </div>
      </div>
    </div>
  );
}
