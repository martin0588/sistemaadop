import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Bell,
  History,
  UserX,
} from 'lucide-react';
import { Adoption, AdoptionFollowUp, User } from '../../types';
import SelectedUserModal from '../comun/adoptantes/SelectedUserModal';
import FollowUpModal from '../seguimiento/FollowUpModal';

export default function AdoptionRequests({ user }: { user: User }) {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [selectedAdoption, setSelectedAdoption] = useState<Adoption | null>(null);
  const [followUps, setFollowUps] = useState<AdoptionFollowUp[]>([]);
  const [newFollowUpNotes, setNewFollowUpNotes] = useState('');
  const [newFollowUpStatus, setNewFollowUpStatus] = useState('Excelente');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [notification, setNotification] = useState('');
  const [inactiveAdopters, setInactiveAdopters] = useState<number[]>([]);

  const fetchAdoptions = async () => {
    const res = await fetch('/api/adoptions');
    setAdoptions(await res.json());
  };

  useEffect(() => {
    fetchAdoptions();
  }, []);

  const notify = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleStatus = async (id: number, status: string, pet_id: number) => {
    await fetch(`/api/adoptions/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, pet_id }),
    });

    await fetchAdoptions();
    notify(`Solicitud ${status.toLowerCase()} y adoptante notificado.`);
  };

  const openFollowUps = async (adoption: Adoption) => {
    setSelectedAdoption(adoption);

    const res = await fetch(`/api/adoptions/${adoption.id}/followups`);
    setFollowUps(await res.json());
  };

  const openUserProfile = async (userId: number) => {
    const res = await fetch(`/api/users/${userId}`);

    if (res.ok) {
      setSelectedUser(await res.json());
    }
  };

  const addFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAdoption) return;

    await fetch(`/api/adoptions/${selectedAdoption.id}/followups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notes: newFollowUpNotes,
        status: newFollowUpStatus,
      }),
    });

    setNewFollowUpNotes('');
    setNewFollowUpStatus('Excelente');

    const res = await fetch(`/api/adoptions/${selectedAdoption.id}/followups`);
    setFollowUps(await res.json());

    notify('Seguimiento registrado correctamente.');
  };

  const toggleAdopterStatus = (userId: number) => {
    setInactiveAdopters(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );

    notify('Estado del adoptante actualizado.');
  };

  const filteredAdoptions = adoptions.filter(a => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      (a.pet_name || '').toLowerCase().includes(search) ||
      (a.user_name || '').toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === 'Todos' || a.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold text-stone-900">
          Solicitudes de Adopción
        </h2>
      </div>

      {notification && (
        <div className="mb-5 bg-emerald-100 text-emerald-700 px-5 py-3 rounded-xl font-bold flex items-center gap-2">
          <Bell size={18} />
          {notification}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Buscar por mascota o adoptante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-stone-200 bg-white font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="Todos">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Aprobado">Aprobado</option>
          <option value="Rechazado">Rechazado</option>
        </select>
      </div>

      <p className="text-sm text-stone-500 mb-3">
        Mostrando {filteredAdoptions.length} solicitud(es)
      </p>

      <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 text-sm font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4">Mascota</th>
              <th className="p-4">Adoptante</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Requisitos</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {filteredAdoptions.map(a => {
              const adopterInactive = inactiveAdopters.includes(a.user_id);

              return (
                <tr
                  key={a.id}
                  className={`hover:bg-stone-50 ${
                    adopterInactive ? 'opacity-50' : ''
                  }`}
                >
                  <td className="p-4 font-bold text-stone-900">
                    {a.pet_name}
                  </td>

                  <td className="p-4 text-stone-600">
                    <button
                      onClick={() => openUserProfile(a.user_id)}
                      className="hover:text-amber-600 hover:underline font-medium transition-colors"
                    >
                      {a.user_name}
                    </button>

                    {adopterInactive && (
                      <p className="text-xs text-rose-500 font-bold mt-1">
                        Adoptante inactivo
                      </p>
                    )}
                  </td>

                  <td className="p-4 text-stone-500 text-sm">
                    {new Date(a.request_date).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        a.status === 'Aprobado'
                          ? 'bg-emerald-100 text-emerald-700'
                          : a.status === 'Rechazado'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      Validados
                    </span>
                  </td>

                  <td className="p-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => openUserProfile(a.user_id)}
                      className="bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-stone-200 inline-flex items-center gap-1"
                    >
                      <Eye size={14} />
                      Ver
                    </button>

                    {a.status === 'Pendiente' &&
                      (user.role === 'Administrador' || user.role === 'Voluntario') && (
                        <>
                          <button
                            onClick={() => handleStatus(a.id, 'Aprobado', a.pet_id)}
                            className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-600 inline-flex items-center gap-1"
                          >
                            <CheckCircle2 size={14} />
                            Aprobar
                          </button>

                          <button
                            onClick={() => handleStatus(a.id, 'Rechazado', a.pet_id)}
                            className="bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-600 inline-flex items-center gap-1"
                          >
                            <XCircle size={14} />
                            Rechazar
                          </button>
                        </>
                      )}

                    {a.status === 'Aprobado' &&
                      (user.role === 'Administrador' || user.role === 'Voluntario') && (
                        <button
                          onClick={() => openFollowUps(a)}
                          className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-600 inline-flex items-center gap-1"
                        >
                          <History size={14} />
                          Historial
                        </button>
                      )}

                    <button
                      onClick={() => toggleAdopterStatus(a.user_id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${
                        adopterInactive
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      }`}
                    >
                      <UserX size={14} />
                      {adopterInactive ? 'Activar' : 'Inactivar'}
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredAdoptions.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-stone-500 font-medium"
                >
                  No se encontraron solicitudes de adopción.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <SelectedUserModal
            selectedUser={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}

        {selectedAdoption && (
          <FollowUpModal
            selectedAdoption={selectedAdoption}
            followUps={followUps}
            newFollowUpNotes={newFollowUpNotes}
            newFollowUpStatus={newFollowUpStatus}
            setNewFollowUpNotes={setNewFollowUpNotes}
            setNewFollowUpStatus={setNewFollowUpStatus}
            addFollowUp={addFollowUp}
            onClose={() => setSelectedAdoption(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}