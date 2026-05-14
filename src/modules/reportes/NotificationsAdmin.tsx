import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Notification } from '../../types';

export default function NotificationsAdmin() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const fetchNotifs = async () => {
    const res = await fetch('/api/notifications');
    setNotifications(await res.json());
  };

  useEffect(() => { fetchNotifs(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/notifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, message }) });
    setTitle('');
    setMessage('');
    fetchNotifs();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    fetchNotifs();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold text-stone-900 mb-8">Administrar Avisos</h2>
      <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-8 mb-8">
        <h3 className="text-xl font-bold text-stone-800 mb-4">Nuevo Aviso</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><input type="text" required placeholder="Título del aviso" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" /></div>
          <div><textarea required placeholder="Mensaje" value={message} onChange={e => setMessage(e.target.value)} rows={3} className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" /></div>
          <button type="submit" className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-amber-600 transition-colors">Publicar Aviso</button>
        </form>
      </div>
      <div className="space-y-4">
        {notifications.map(n => (
          <div key={n.id} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm relative group">
            <button onClick={() => handleDelete(n.id)} className="absolute top-6 right-6 text-stone-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={20} /></button>
            <h4 className="font-bold text-stone-900 text-lg pr-8">{n.title}</h4>
            <p className="text-stone-600 mt-2">{n.message}</p>
            <p className="text-stone-400 text-xs mt-4 font-medium">{new Date(n.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
