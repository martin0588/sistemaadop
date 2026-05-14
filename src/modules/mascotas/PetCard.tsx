import React, { useEffect, useState } from 'react';
import { Activity, Check, Edit3, Gift, Heart, Info, PawPrint, Stethoscope, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { MedicalRecord, Pet, User } from '../../types';

export default function PetCard({ pet, user, onUpdate, onEdit }: { pet: Pet, user: User, onUpdate: () => void | Promise<void>, onEdit?: () => void }) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(pet.vet_notes);
  const [showModal, setShowModal] = useState(false);
  const [adoptionRequested, setAdoptionRequested] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [newRecordDesc, setNewRecordDesc] = useState('');
  const [newRecordTreat, setNewRecordTreat] = useState('');

  useEffect(() => {
    if (showModal && (user.role === 'Veterinario' || user.role === 'Administrador' || user.role === 'Adoptante')) {
      fetch(`/api/pets/${pet.id}/medical`).then(r => r.json()).then(setMedicalRecords);
    }
  }, [showModal, pet.id, user.role]);

  const updateStatus = async (status: string) => {
    await fetch(`/api/pets/${pet.id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    onUpdate();
  };

  const saveNotes = async () => {
    await fetch(`/api/pets/${pet.id}/notes`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ vet_notes: notes }) });
    setIsEditingNotes(false);
    onUpdate();
  };

  const handleAdopt = async () => {
    await fetch('/api/adoptions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pet_id: pet.id, user_id: user.id }) });
    setAdoptionRequested(true);
    setTimeout(() => { setAdoptionRequested(false); onUpdate(); }, 2000);
  };

  const addMedicalRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/pets/${pet.id}/medical`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ vet_id: user.id, description: newRecordDesc, treatment: newRecordTreat }) });
    setNewRecordDesc('');
    setNewRecordTreat('');
    fetch(`/api/pets/${pet.id}/medical`).then(r => r.json()).then(setMedicalRecords);
  };

  const statusColors: Record<string, string> = {
    'Disponible': 'bg-emerald-100 text-emerald-700',
    'En Tratamiento': 'bg-amber-100 text-amber-700',
    'En Proceso': 'bg-blue-100 text-blue-700',
    'Adoptado': 'bg-stone-100 text-stone-600',
  };

  return (
    <>
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 flex flex-col group">
        <div className="h-64 overflow-hidden relative"><img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" /><div className="absolute top-4 right-4"><span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[pet.status]}`}>{pet.status}</span></div></div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div><h2 className="text-2xl font-extrabold text-stone-900">{pet.name}</h2><p className="text-stone-500 font-medium">{pet.breed} • {pet.age} años</p></div>
            <div className="flex gap-2">
              {(user.role === 'Administrador' || user.role === 'Voluntario') && onEdit && (
                <button onClick={onEdit} className="w-10 h-10 bg-stone-50 hover:bg-amber-100 hover:text-amber-600 rounded-full flex items-center justify-center text-stone-400 transition-colors"><Edit3 size={20} /></button>
              )}
              <button onClick={() => setShowModal(true)} className="w-10 h-10 bg-stone-50 hover:bg-amber-100 hover:text-amber-600 rounded-full flex items-center justify-center text-stone-400 transition-colors"><Info size={20} /></button>
            </div>
          </div>
          <div className="bg-stone-50 rounded-2xl p-4 mb-6 flex-1">
            <div className="flex items-center justify-between mb-2"><h4 className="text-sm font-bold text-stone-700 flex items-center gap-2"><Stethoscope size={16} className="text-teal-500" /> Notas Médicas</h4>{user.role === 'Veterinario' && !isEditingNotes && <button onClick={() => setIsEditingNotes(true)} className="text-teal-600"><Edit3 size={16} /></button>}</div>
            {isEditingNotes ? <div className="flex flex-col gap-2"><textarea className="w-full text-sm bg-white border border-stone-200 rounded-xl p-3" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /><div className="flex justify-end gap-2"><button onClick={() => setIsEditingNotes(false)} className="text-xs font-bold text-stone-500 px-3 py-1.5">Cancelar</button><button onClick={saveNotes} className="text-xs font-bold bg-teal-500 text-white px-3 py-1.5 rounded-lg">Guardar</button></div></div> : <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">{pet.vet_notes}</p>}
          </div>
          <div className="mt-auto pt-4 border-t border-stone-100">
            {user.role === 'Adoptante' && pet.status === 'Disponible' && (
              <button onClick={handleAdopt} disabled={adoptionRequested} className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${adoptionRequested ? 'bg-emerald-500 text-white' : 'bg-rose-500 hover:bg-rose-600 text-white'}`}>
                {adoptionRequested ? <><Check size={20} /> Solicitud Enviada</> : <><Heart size={20} /> Solicitar Adopción</>}
              </button>
            )}
            {user.role === 'Adoptante' && pet.status !== 'Disponible' && <button disabled className="w-full bg-stone-100 text-stone-400 py-3.5 rounded-xl font-bold cursor-not-allowed">No Disponible</button>}
            {(user.role === 'Administrador' || user.role === 'Voluntario') && <select value={pet.status} onChange={(e) => updateStatus(e.target.value)} className="w-full bg-white border border-stone-200 text-stone-700 text-sm rounded-xl px-4 py-3 font-bold"><option>Disponible</option><option>En Tratamiento</option><option>En Proceso</option><option>Adoptado</option></select>}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl max-w-2xl w-full flex flex-col md:flex-row max-h-[90vh]">
              <div className="md:w-1/2 h-64 md:h-auto relative">
                <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button onClick={() => setShowModal(false)} className="absolute top-4 left-4 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-stone-800 hover:bg-white md:hidden"><X size={20} /></button>
              </div>
              <div className="p-8 md:w-1/2 overflow-y-auto relative">
                <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-stone-400 hover:text-stone-800 hidden md:block"><X size={24} /></button>
                <div className="mb-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${statusColors[pet.status]}`}>{pet.status}</span>
                  <h2 className="text-4xl font-extrabold text-stone-900 mb-1">{pet.name}</h2>
                  <p className="text-lg text-stone-500 font-medium">{pet.species} • {pet.breed}</p>
                </div>
                <div className="space-y-6">
                  <div><h4 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-1">Edad</h4><p className="text-stone-800 font-medium text-lg">{pet.age} años</p></div>
                  <div><h4 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Stethoscope size={16} /> Notas del Veterinario</h4><div className="bg-stone-50 p-4 rounded-2xl text-stone-700 text-sm leading-relaxed">{pet.vet_notes}</div></div>

                  {(user.role === 'Veterinario' || user.role === 'Administrador' || user.role === 'Adoptante') && (
                    <div className="mt-6 border-t border-stone-100 pt-6">
                      <h4 className="text-sm font-bold text-stone-700 uppercase tracking-wider mb-4 flex items-center gap-2"><Activity size={16} className="text-teal-500" /> Historial Médico</h4>
                      <div className="space-y-3 mb-6">
                        {medicalRecords.length === 0 ? <p className="text-stone-500 text-sm">No hay registros médicos.</p> : medicalRecords.map(mr => (
                          <div key={mr.id} className="bg-stone-50 p-4 rounded-xl">
                            <p className="text-xs text-stone-400 font-bold mb-1">{new Date(mr.date).toLocaleDateString()}</p>
                            <p className="text-sm text-stone-800 font-medium mb-1"><span className="text-stone-500">Diagnóstico:</span> {mr.description}</p>
                            <p className="text-sm text-stone-800 font-medium"><span className="text-stone-500">Tratamiento:</span> {mr.treatment}</p>
                          </div>
                        ))}
                      </div>
                      {user.role === 'Veterinario' && (
                        <form onSubmit={addMedicalRecord} className="bg-stone-50 p-4 rounded-2xl space-y-3">
                          <h5 className="text-xs font-bold text-stone-500 uppercase">Añadir Registro</h5>
                          <input type="text" required placeholder="Diagnóstico / Descripción" value={newRecordDesc} onChange={e => setNewRecordDesc(e.target.value)} className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                          <input type="text" required placeholder="Tratamiento" value={newRecordTreat} onChange={e => setNewRecordTreat(e.target.value)} className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                          <button type="submit" className="w-full bg-teal-500 text-white py-2 rounded-xl text-sm font-bold hover:bg-teal-600 transition-colors">Guardar Registro</button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
                {user.role === 'Adoptante' && pet.status === 'Disponible' && (
                  <div className="mt-8 pt-6 border-t border-stone-100 space-y-3">
                    <button onClick={() => { handleAdopt(); setShowModal(false); }} className="w-full bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"><Heart size={20} /> Solicitar Adopción</button>
                    <button onClick={() => { alert('¡Gracias por tu interés en apadrinar! Esta función estará disponible pronto.'); setShowModal(false); }} className="w-full bg-amber-100 hover:bg-amber-200 text-amber-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"><Gift size={20} /> Apadrinar a {pet.name}</button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
