import React, { useState } from 'react';
import { Check, User as UserIcon } from 'lucide-react';
import { User } from '../../../types';

export default function UserProfile({ user, setUser }: { user: User, setUser: (u: User) => void }) {
  const [formData, setFormData] = useState({ full_name: user.full_name || '', email: user.email || '', profile_pic: user.profile_pic || '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    const res = await fetch(`/api/users/${user.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-extrabold text-stone-900 mb-8">Mi Perfil</h2>
      <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-shrink-0 flex flex-col items-center">
            {formData.profile_pic ? (
              <img src={formData.profile_pic} alt="Perfil" className="w-32 h-32 rounded-full object-cover border-4 border-stone-50 shadow-lg" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-32 h-32 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shadow-lg"><UserIcon size={48} /></div>
            )}
            <span className="mt-4 px-4 py-1.5 bg-stone-100 text-stone-600 rounded-full text-xs font-bold uppercase tracking-wider">{user.role}</span>
          </div>
          <form onSubmit={handleSubmit} className="flex-1 w-full space-y-5">
            {success && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-sm font-semibold flex items-center gap-2 border border-emerald-100"><Check size={18} /> Perfil actualizado correctamente</div>}
            <div><label className="block text-sm font-bold text-stone-700 mb-2 pl-2">Usuario</label><input type="text" disabled value={user.username} className="w-full bg-stone-100 border border-stone-200 text-stone-500 rounded-2xl px-5 py-3 font-medium cursor-not-allowed" /></div>
            <div><label className="block text-sm font-bold text-stone-700 mb-2 pl-2">Nombre Completo</label><input type="text" required value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" /></div>
            <div><label className="block text-sm font-bold text-stone-700 mb-2 pl-2">Correo Electrónico</label><input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" /></div>
            <div><label className="block text-sm font-bold text-stone-700 mb-2 pl-2">URL Foto de Perfil</label><input type="text" value={formData.profile_pic} onChange={e => setFormData({ ...formData, profile_pic: e.target.value })} className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" /></div>
            <button type="submit" disabled={loading} className="w-full bg-amber-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 mt-4">{loading ? 'Guardando...' : 'Guardar Cambios'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
