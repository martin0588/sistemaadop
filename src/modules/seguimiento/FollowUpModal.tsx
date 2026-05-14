import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Adoption, AdoptionFollowUp } from '../../types';

export default function FollowUpModal({ selectedAdoption, followUps, newFollowUpNotes, newFollowUpStatus, setNewFollowUpNotes, setNewFollowUpStatus, addFollowUp, onClose }: {
  selectedAdoption: Adoption;
  followUps: AdoptionFollowUp[];
  newFollowUpNotes: string;
  newFollowUpStatus: string;
  setNewFollowUpNotes: (value: string) => void;
  setNewFollowUpStatus: (value: string) => void;
  addFollowUp: (e: React.FormEvent) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl max-w-lg w-full p-8 relative max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-6 right-6 text-stone-400 hover:text-stone-800"><X size={24} /></button>
        <h3 className="text-2xl font-extrabold text-stone-900 mb-2">Seguimiento de Adopción</h3>
        <p className="text-stone-500 mb-6">Mascota: <span className="font-bold text-stone-800">{selectedAdoption.pet_name}</span> | Adoptante: <span className="font-bold text-stone-800">{selectedAdoption.user_name}</span></p>

        <div className="overflow-y-auto flex-1 mb-6 space-y-4 pr-2">
          {followUps.length === 0 ? <p className="text-stone-500 text-sm">No hay registros de seguimiento aún.</p> : followUps.map(f => (
            <div key={f.id} className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-stone-400">{new Date(f.date).toLocaleDateString()}</span>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${f.status === 'Excelente' ? 'bg-emerald-100 text-emerald-700' : f.status === 'Regular' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{f.status}</span>
              </div>
              <p className="text-sm text-stone-700">{f.notes}</p>
            </div>
          ))}
        </div>

        <form onSubmit={addFollowUp} className="bg-stone-50 p-4 rounded-2xl space-y-3 mt-auto">
          <h4 className="text-sm font-bold text-stone-700">Nuevo Registro</h4>
          <select value={newFollowUpStatus} onChange={e => setNewFollowUpStatus(e.target.value)} className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium">
            <option>Excelente</option><option>Bueno</option><option>Regular</option><option>Preocupante</option>
          </select>
          <textarea required placeholder="Notas del seguimiento..." value={newFollowUpNotes} onChange={e => setNewFollowUpNotes(e.target.value)} rows={3} className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors">Guardar Seguimiento</button>
        </form>
      </motion.div>
    </div>
  );
}
