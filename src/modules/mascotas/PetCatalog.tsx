import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Cat, Dog, Filter, PawPrint, Plus, Search, X } from 'lucide-react';
import { Pet, User } from '../../types';
import PetCard from './PetCard';

export default function PetCatalog({ user }: { user: User }) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', species: 'Perro', breed: '', age: '', image_url: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('Todos');
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const fetchPets = async () => {
    setLoading(true);
    const res = await fetch('/api/pets');
    const data = await res.json();
    setPets(data);
    setFilteredPets(data);
    setLoading(false);
  };

  useEffect(() => { fetchPets(); }, []);

  useEffect(() => {
    let result = pets;
    if (filterSpecies !== 'Todos') {
      result = result.filter(p => p.species.toLowerCase() === filterSpecies.toLowerCase());
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(term) || p.breed.toLowerCase().includes(term));
    }
    setFilteredPets(result);
  }, [searchTerm, filterSpecies, pets]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/pets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    setShowForm(false);
    setFormData({ name: '', species: 'Perro', breed: '', age: '', image_url: '' });
    fetchPets();
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPet) return;
    await fetch(`/api/pets/${editingPet.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingPet) });
    setEditingPet(null);
    fetchPets();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-stone-900">Nuestros Rescatados</h2>
          <p className="text-stone-500 font-medium mt-1">Conoce a nuestros amigos de cuatro patas.</p>
        </div>
        {(user.role === 'Administrador' || user.role === 'Voluntario') && (
          <button onClick={() => setShowForm(!showForm)} className="bg-stone-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/20"><Plus size={20} /> Añadir Mascota</button>
        )}
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-stone-100 flex flex-col md:flex-row gap-4 mb-8 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o raza..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 text-stone-700 rounded-2xl pl-12 pr-4 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
          {['Todos', 'Perro', 'Gato', 'Conejo'].map(species => (
            <button
              key={species}
              onClick={() => setFilterSpecies(species)}
              className={`px-6 py-4 rounded-2xl font-bold whitespace-nowrap transition-all flex items-center gap-2 ${filterSpecies === species ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/20 scale-105' : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'}`}
            >
              {species === 'Perro' && <Dog size={18} />}
              {species === 'Gato' && <Cat size={18} />}
              {species === 'Conejo' && <PawPrint size={18} />}
              {species === 'Todos' && <Filter size={18} />}
              {species}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 mb-8 grid grid-cols-2 gap-6">
          <div className="col-span-2"><h3 className="text-xl font-bold text-stone-900 mb-4">Añadir Nueva Mascota</h3></div>
          <div><label className="block text-sm font-bold text-stone-700 mb-2">Nombre</label><input required type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
          <div><label className="block text-sm font-bold text-stone-700 mb-2">Especie</label><select className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3" value={formData.species} onChange={e => setFormData({ ...formData, species: e.target.value })}><option>Perro</option><option>Gato</option><option>Otro</option></select></div>
          <div><label className="block text-sm font-bold text-stone-700 mb-2">Raza</label><input required type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3" value={formData.breed} onChange={e => setFormData({ ...formData, breed: e.target.value })} /></div>
          <div><label className="block text-sm font-bold text-stone-700 mb-2">Edad</label><input required type="number" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} /></div>
          <div className="col-span-2"><label className="block text-sm font-bold text-stone-700 mb-2">URL Imagen (Opcional)</label><input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} /></div>
          <div className="col-span-2 flex gap-3"><button type="submit" className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold">Guardar</button><button type="button" onClick={() => setShowForm(false)} className="bg-stone-100 text-stone-600 px-6 py-3 rounded-xl font-bold">Cancelar</button></div>
        </form>
      )}

      {editingPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setEditingPet(null)} className="absolute top-6 right-6 text-stone-400 hover:text-stone-800"><X size={24} /></button>
            <h3 className="text-2xl font-extrabold text-stone-900 mb-6">Editar Mascota: {editingPet.name}</h3>
            <form onSubmit={handleEdit} className="grid grid-cols-2 gap-6">
              <div><label className="block text-sm font-bold text-stone-700 mb-2">Nombre</label><input required type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3" value={editingPet.name} onChange={e => setEditingPet({ ...editingPet, name: e.target.value })} /></div>
              <div><label className="block text-sm font-bold text-stone-700 mb-2">Especie</label><select className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3" value={editingPet.species} onChange={e => setEditingPet({ ...editingPet, species: e.target.value })}><option>Perro</option><option>Gato</option><option>Otro</option></select></div>
              <div><label className="block text-sm font-bold text-stone-700 mb-2">Raza</label><input required type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3" value={editingPet.breed} onChange={e => setEditingPet({ ...editingPet, breed: e.target.value })} /></div>
              <div><label className="block text-sm font-bold text-stone-700 mb-2">Edad</label><input required type="number" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3" value={editingPet.age} onChange={e => setEditingPet({ ...editingPet, age: parseInt(e.target.value) })} /></div>
              <div className="col-span-2"><label className="block text-sm font-bold text-stone-700 mb-2">URL Imagen</label><input type="text" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3" value={editingPet.image_url} onChange={e => setEditingPet({ ...editingPet, image_url: e.target.value })} /></div>
              <div className="col-span-2 flex gap-3 mt-4"><button type="submit" className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold w-full">Guardar Cambios</button></div>
            </form>
          </motion.div>
        </div>
      )}

      {loading ? <div className="flex justify-center py-20"><PawPrint className="animate-spin text-amber-500" size={40} /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPets.length > 0 ? (
            filteredPets.map(pet => <PetCard key={pet.id} pet={pet} user={user} onUpdate={fetchPets} onEdit={() => setEditingPet(pet)} />)
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-stone-100">
              <PawPrint size={48} className="mx-auto text-stone-300 mb-4" />
              <h3 className="text-xl font-bold text-stone-700">No se encontraron mascotas</h3>
              <p className="text-stone-500 mt-2">Intenta ajustar los filtros de búsqueda.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
