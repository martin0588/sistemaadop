import React from 'react';
import { User as UserIcon, X } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../../../types';

export default function SelectedUserModal({ selectedUser, onClose }: { selectedUser: User, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl max-w-sm w-full p-8 relative flex flex-col items-center text-center">
        <button onClick={onClose} className="absolute top-6 right-6 text-stone-400 hover:text-stone-800"><X size={24} /></button>
        {selectedUser.profile_pic ? (
          <img src={selectedUser.profile_pic} alt={selectedUser.username} className="w-24 h-24 rounded-full object-cover border-4 border-stone-50 shadow-lg mb-4" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shadow-lg mb-4"><UserIcon size={40} /></div>
        )}
        <h3 className="text-2xl font-extrabold text-stone-900 mb-1">{selectedUser.full_name || selectedUser.username}</h3>
        <p className="text-stone-500 font-medium mb-6">{selectedUser.email || 'Sin correo registrado'}</p>
        <div className="w-full bg-stone-50 p-4 rounded-2xl border border-stone-100">
          <p className="text-sm text-stone-600 font-bold uppercase tracking-wider mb-1">Rol en el sistema</p>
          <p className="text-stone-900 font-medium">{selectedUser.role}</p>
        </div>
      </motion.div>
    </div>
  );
}
