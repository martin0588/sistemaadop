import React, { useEffect, useState } from 'react';
import { Edit3, Trash2, User as UserIcon, X, UserPlus, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Role, User } from '../../../types';

const EMPTY_USER = {
  full_name: '',
  email: '',
  role: 'Voluntario' as Role,
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [addingUser, setAddingUser] = useState(false);
  const [newUser, setNewUser] = useState(EMPTY_USER);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => {
        const usersWithStatus = data.map((u: User) => ({
          ...u,
          active: u.active !== false,
        }));
        setUsers(usersWithStatus);
      });
  }, []);

  const handleDelete = async () => {
    if (userToDelete !== null) {
      await fetch(`/api/users/${userToDelete}`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== userToDelete));
      setUserToDelete(null);
    }
  };

  const handleRoleChange = async (id: number, role: string) => {
    await fetch(`/api/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });

    setUsers(users.map(u =>
      u.id === id ? { ...u, role: role as Role } : u
    ));
  };

  const toggleUserStatus = (id: number) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, active: !u.active } : u
    ));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUser) return;

    await fetch(`/api/users/${editingUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingUser),
    });

    setUsers(users.map(u =>
      u.id === editingUser.id ? editingUser : u
    ));

    setEditingUser(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fakeUser: User = {
      id: Date.now(),
      username: newUser.full_name.toLowerCase().replace(/\s+/g, '_'),
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
      profile_pic: '',
      active: true,
    };

    setUsers(prev => [...prev, fakeUser]);
    setNewUser(EMPTY_USER);
    setAddingUser(false);
  };

  const filteredUsers = users.filter(u => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      (u.full_name || '').toLowerCase().includes(search) ||
      (u.email || '').toLowerCase().includes(search) ||
      (u.username || '').toLowerCase().includes(search);

    const matchesRole =
      roleFilter === 'Todos' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold text-stone-900">
          Gestión de Usuarios
        </h2>

        <button
          onClick={() => setAddingUser(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-3 rounded-xl transition-colors shadow-sm"
        >
          <UserPlus size={18} />
          Agregar Personal
        </button>
      </div>

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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
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
                    <p className="leading-tight">
                      {u.full_name || u.username}
                    </p>
                    <p className="text-xs text-stone-500 font-medium">
                      {u.username}
                    </p>
                  </div>
                </td>

                <td className="p-4 text-stone-600">
                  {u.email || '-'}
                </td>

                <td className="p-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="bg-stone-100 border border-stone-200 text-stone-700 text-xs rounded-lg px-2 py-1 font-bold"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Veterinario">Veterinario</option>
                    <option value="Voluntario">Voluntario</option>
                    <option value="Adoptante">Adoptante</option>
                  </select>
                </td>

                <td className="p-4">
                  <button
                    onClick={() => toggleUserStatus(u.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      u.active !== false
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {u.active !== false ? 'Activo' : 'Inactivo'}
                  </button>
                </td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => setEditingUser(u)}
                    className="text-stone-400 hover:text-amber-600 p-2 transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>

                  <button
                    onClick={() => setUserToDelete(u.id)}
                    className="text-rose-500 hover:text-rose-700 p-2 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
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

      <AnimatePresence>
        {addingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 relative"
            >
              <button
                onClick={() => {
                  setAddingUser(false);
                  setNewUser(EMPTY_USER);
                }}
                className="absolute top-6 right-6 text-stone-400 hover:text-stone-800"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                  <UserPlus size={20} />
                </div>

                <h3 className="text-2xl font-extrabold text-stone-900">
                  Nuevo Personal
                </h3>
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
                    onChange={e =>
                      setNewUser({ ...newUser, full_name: e.target.value })
                    }
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
                    onChange={e =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">
                    Rol
                  </label>

                  <select
                    className="w-full bg-stone-50 border border-stone-200 text-stone-700 rounded-xl px-4 py-3 font-bold"
                    value={newUser.role}
                    onChange={e =>
                      setNewUser({ ...newUser, role: e.target.value as Role })
                    }
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

        {editingUser && (
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

              <h3 className="text-2xl font-extrabold text-stone-900 mb-6">
                Editar Usuario
              </h3>

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
                    onChange={e =>
                      setEditingUser({
                        ...editingUser,
                        full_name: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">
                    Email
                  </label>

                  <input
                    required
                    type="email"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                    value={editingUser.email || ''}
                    onChange={e =>
                      setEditingUser({
                        ...editingUser,
                        email: e.target.value,
                      })
                    }
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
                    onChange={e =>
                      setEditingUser({
                        ...editingUser,
                        profile_pic: e.target.value,
                      })
                    }
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

        {userToDelete !== null && (
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

              <h3 className="text-xl font-extrabold text-stone-900 mb-2">
                ¿Eliminar Usuario?
              </h3>

              <p className="text-stone-500 mb-6">
                Esta acción no se puede deshacer.
              </p>

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