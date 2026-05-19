import React, { useEffect, useState } from 'react';
import {
  Edit3,
  Trash2,
  User as UserIcon,
  X,
  UserPlus,
  Search,
  KeyRound,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Role, User } from '../../../types';

const EMPTY_USER = {
  full_name: '',
  email: '',
  role: 'Voluntario' as Role,
};

// Helper: obtiene el token JWT guardado (ajusta la clave según tu app)
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Helper: intenta parsear JSON, devuelve null si falla
async function parseJSON(res: Response): Promise<any> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default function UserManagement({ user }: { user: User }) {
  const isAdmin = user.role === 'Administrador';
  const isVolunteer = user.role === 'Voluntario';

  const canRegister = isAdmin;
  const canEdit = isAdmin || isVolunteer;
  const canDelete = isAdmin;
  const canChangeRole = isAdmin;
  const canToggleStatus = isAdmin;
  const canResetPassword = isAdmin;

  const [users, setUsers] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [addingUser, setAddingUser] = useState(false);
  const [newUser, setNewUser] = useState(EMPTY_USER);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');

  // ── Carga inicial ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/users', { headers: getAuthHeaders() })
      .then(async res => {
        if (!res.ok) {
          console.error('Error al cargar usuarios:', res.status);
          return [];
        }
        return res.json();
      })
      .then((data: User[]) => {
        const usersWithStatus = data.map(u => ({
          ...u,
          active: u.active !== false,
        }));
        setUsers(usersWithStatus);
      })
      .catch(err => console.error('Error de red al cargar usuarios:', err));
  }, []);

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (userToDelete === null) return;

    try {
      const res = await fetch(`/api/users/${userToDelete}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const data = await parseJSON(res);
        alert(data?.message || `Error al eliminar usuario (${res.status}).`);
        return;
      }

      setUsers(prev => prev.filter(u => u.id !== userToDelete));
    } catch {
      alert('Error de conexión al eliminar usuario.');
    } finally {
      setUserToDelete(null);
    }
  };

  // ── Cambio de rol ──────────────────────────────────────────────────────────
  const handleRoleChange = async (id: number, role: string) => {
    if (!canChangeRole) return;

    // Optimistic update
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, role: role as Role } : u)));

    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const data = await parseJSON(res);
        alert(data?.message || `Error al cambiar rol (${res.status}).`);
        // Revertir
        setUsers(prev =>
          prev.map(u => (u.id === id ? { ...u, role: u.role } : u))
        );
      }
    } catch {
      alert('Error de conexión al cambiar rol.');
    }
  };

  // ── Restablecer contraseña ─────────────────────────────────────────────────
  const resetPassword = async (id: number) => {
    if (!canResetPassword) return;

    const confirmed = window.confirm('¿Restablecer contraseña del usuario?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/users/${id}/reset-password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      const data = await parseJSON(res);

      if (res.ok) {
        alert(
          data?.temporaryPassword
            ? `Contraseña restablecida.\nNueva contraseña temporal: ${data.temporaryPassword}`
            : 'Contraseña restablecida correctamente.'
        );
      } else {
        // Muestra el mensaje real del servidor si existe
        const serverMsg =
          data?.message || data?.error || data?.detail || null;
        alert(
          serverMsg
            ? `Error (${res.status}): ${serverMsg}`
            : `Error al restablecer contraseña (código ${res.status}).`
        );
        console.error('reset-password error →', res.status, data);
      }
    } catch (err) {
      console.error('reset-password network error →', err);
      alert('Error de conexión al restablecer contraseña.');
    }
  };

  // ── Toggle activo/inactivo ─────────────────────────────────────────────────
  const toggleUserStatus = async (id: number) => {
    if (!canToggleStatus) return;

    const target = users.find(u => u.id === id);
    if (!target) return;

    const newActive = !target.active;

    // Optimistic update
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, active: newActive } : u)));

    try {
      const res = await fetch(`/api/users/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ active: newActive }),
      });

      if (!res.ok) {
        // Revertir si el backend falla
        setUsers(prev => prev.map(u => (u.id === id ? { ...u, active: !newActive } : u)));
        const data = await parseJSON(res);
        alert(data?.message || `Error al cambiar estado (${res.status}).`);
      }
    } catch {
      // Revertir en error de red
      setUsers(prev => prev.map(u => (u.id === id ? { ...u, active: !newActive } : u)));
      alert('Error de conexión al cambiar estado.');
    }
  };

  // ── Editar usuario ─────────────────────────────────────────────────────────
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !canEdit) return;

    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(editingUser),
      });

      const data = await parseJSON(res);

      if (res.ok) {
        setUsers(prev => prev.map(u => (u.id === editingUser.id ? editingUser : u)));
        setEditingUser(null);
      } else {
        alert(data?.message || `Error al editar usuario (${res.status}).`);
      }
    } catch {
      alert('Error de conexión al editar usuario.');
    }
  };

  // ── Agregar usuario ────────────────────────────────────────────────────────
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canRegister) return;

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newUser),
      });

      const data = await parseJSON(res);

      if (res.ok && data) {
        // Usar el usuario devuelto por el servidor (con id real)
        const created: User = {
          id: data.id ?? Date.now(),
          username:
            data.username ??
            newUser.full_name.toLowerCase().replace(/\s+/g, '_'),
          full_name: data.full_name ?? newUser.full_name,
          email: data.email ?? newUser.email,
          role: data.role ?? newUser.role,
          profile_pic: data.profile_pic ?? '',
          active: data.active !== false,
        };
        setUsers(prev => [...prev, created]);
      } else {
        // Fallback local si el endpoint no existe aún
        const fallback: User = {
          id: Date.now(),
          username: newUser.full_name.toLowerCase().replace(/\s+/g, '_'),
          full_name: newUser.full_name,
          email: newUser.email,
          role: newUser.role,
          profile_pic: '',
          active: true,
        };
        setUsers(prev => [...prev, fallback]);
        if (!res.ok) {
          console.warn('POST /api/users falló, usando fallback local.');
        }
      }
    } catch {
      // Si no hay backend, inserta localmente igual
      const fallback: User = {
        id: Date.now(),
        username: newUser.full_name.toLowerCase().replace(/\s+/g, '_'),
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        profile_pic: '',
        active: true,
      };
      setUsers(prev => [...prev, fallback]);
      console.warn('Error de red al agregar usuario, insertado localmente.');
    }

    setNewUser(EMPTY_USER);
    setAddingUser(false);
  };

  // ── Filtro ─────────────────────────────────────────────────────────────────
  const filteredUsers = users.filter(u => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (u.full_name || '').toLowerCase().includes(search) ||
      (u.email || '').toLowerCase().includes(search) ||
      (u.username || '').toLowerCase().includes(search);
    const matchesRole = roleFilter === 'Todos' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold text-stone-900">
          Gestión de Usuarios
        </h2>

        {canRegister && (
          <button
            onClick={() => setAddingUser(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-3 rounded-xl transition-colors shadow-sm"
          >
            <UserPlus size={18} />
            Agregar Personal
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar usuario, email o nombre..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-stone-200 bg-white font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="Todos">Todos los roles</option>
          <option value="Administrador">Administrador</option>
          <option value="Veterinario">Veterinario</option>
          <option value="Voluntario">Voluntario</option>
          <option value="Adoptante">Adoptante</option>
        </select>
      </div>

      <p className="text-sm text-stone-500 mb-3">
        Mostrando {filteredUsers.length} usuario(s)
      </p>

      {/* Tabla */}
      <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 text-sm font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4">Usuario</th>
              <th className="p-4">Email</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-stone-50">
                <td className="p-4 font-bold text-stone-900 flex items-center gap-3">
                  {u.profile_pic ? (
                    <img
                      src={u.profile_pic}
                      alt={u.username}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                      <UserIcon size={18} />
                    </div>
                  )}
                  <div>
                    <p className="leading-tight">{u.full_name || u.username}</p>
                    <p className="text-xs text-stone-500 font-medium">{u.username}</p>
                  </div>
                </td>

                <td className="p-4 text-stone-600">{u.email || '-'}</td>

                <td className="p-4">
                  <select
                    value={u.role}
                    disabled={!canChangeRole}
                    onChange={e => handleRoleChange(u.id, e.target.value)}
                    className="bg-stone-100 border border-stone-200 text-stone-700 text-xs rounded-lg px-2 py-1 font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Veterinario">Veterinario</option>
                    <option value="Voluntario">Voluntario</option>
                    <option value="Adoptante">Adoptante</option>
                  </select>
                </td>

                <td className="p-4">
                  <button
                    disabled={!canToggleStatus}
                    onClick={() => toggleUserStatus(u.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                      u.active !== false
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {u.active !== false ? 'Activo' : 'Inactivo'}
                  </button>
                </td>

                <td className="p-4 flex gap-2 flex-wrap">
                  {canEdit && (
                    <button
                      onClick={() => setEditingUser(u)}
                      className="text-stone-400 hover:text-amber-600 p-2 transition-colors"
                    >
                      <Edit3 size={18} />
                    </button>
                  )}

                  {canResetPassword && (
                    <button
                      onClick={() => resetPassword(u.id)}
                      className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-200 inline-flex items-center gap-1"
                    >
                      <KeyRound size={14} />
                      Reset
                    </button>
                  )}

                  {canDelete && (
                    <button
                      onClick={() => setUserToDelete(u.id)}
                      className="text-rose-500 hover:text-rose-700 p-2 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}

                  {!canEdit && !canDelete && !canResetPassword && (
                    <span className="text-xs text-stone-400 font-bold">
                      Solo lectura
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-stone-500 font-medium">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      <AnimatePresence>

        {/* ── Agregar ── */}
        {addingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 relative"
            >
              <button
                onClick={() => { setAddingUser(false); setNewUser(EMPTY_USER); }}
                className="absolute top-6 right-6 text-stone-400 hover:text-stone-800"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                  <UserPlus size={20} />
                </div>
                <h3 className="text-2xl font-extrabold text-stone-900">Nuevo Personal</h3>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">
                    Nombre Completo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="ej. Juan Pérez"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                    value={newUser.full_name}
                    onChange={e => setNewUser({ ...newUser, full_name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="ej. juan@correo.com"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Rol</label>
                  <select
                    className="w-full bg-stone-50 border border-stone-200 text-stone-700 rounded-xl px-4 py-3 font-bold"
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value as Role })}
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Veterinario">Veterinario</option>
                    <option value="Voluntario">Voluntario</option>
                    <option value="Adoptante">Adoptante</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-amber-600 transition-colors mt-2"
                >
                  Agregar Personal
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* ── Editar ── */}
        {editingUser && canEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 relative"
            >
              <button
                onClick={() => setEditingUser(null)}
                className="absolute top-6 right-6 text-stone-400 hover:text-stone-800"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-extrabold text-stone-900 mb-6">Editar Usuario</h3>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                    value={editingUser.full_name || ''}
                    onChange={e => setEditingUser({ ...editingUser, full_name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Email</label>
                  <input
                    required
                    type="email"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                    value={editingUser.email || ''}
                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">
                    URL Foto Perfil
                  </label>
                  <input
                    type="text"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                    value={editingUser.profile_pic || ''}
                    onChange={e => setEditingUser({ ...editingUser, profile_pic: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-amber-600 transition-colors mt-4"
                >
                  Guardar Cambios
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* ── Eliminar ── */}
        {userToDelete !== null && canDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center"
            >
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>

              <h3 className="text-xl font-extrabold text-stone-900 mb-2">¿Eliminar Usuario?</h3>
              <p className="text-stone-500 mb-6">Esta acción no se puede deshacer.</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setUserToDelete(null)}
                  className="flex-1 bg-stone-100 text-stone-700 py-3 rounded-xl font-bold hover:bg-stone-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-rose-500 text-white py-3 rounded-xl font-bold hover:bg-rose-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}