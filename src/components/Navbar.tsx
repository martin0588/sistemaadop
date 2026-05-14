import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, ClipboardList, FileText, Gift, Heart, LayoutDashboard, LogOut, PawPrint, Stethoscope, Users, User as UserIcon, X } from 'lucide-react';
import Logo from './Logo';
import { Notification, User } from '../types';

export default function Navbar({ user, currentTab, setCurrentTab, onLogout }: { user: User, currentTab: string, setCurrentTab: (t: string) => void, onLogout: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    fetch('/api/notifications').then(r => r.json()).then(setNotifications);
  }, []);

  const getTabs = () => {
    switch (user.role) {
      case 'Administrador':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'pets', label: 'Mascotas', icon: PawPrint },
          { id: 'users', label: 'Usuarios', icon: Users },
          { id: 'adoptions', label: 'Solicitudes', icon: ClipboardList },
          { id: 'notifications', label: 'Avisos', icon: Bell },
          { id: 'reports', label: 'Reportes', icon: FileText },
        ];
      case 'Veterinario':
        return [{ id: 'pets', label: 'Pacientes', icon: Stethoscope }];
      case 'Voluntario':
        return [
          { id: 'pets', label: 'Mascotas', icon: PawPrint },
          { id: 'adoptions', label: 'Solicitudes', icon: ClipboardList },
        ];
      case 'Adoptante':
        return [
          { id: 'pets', label: 'Adoptar', icon: Heart },
          { id: 'my-adoptions', label: 'Mis Adopciones', icon: ClipboardList },
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="bg-white border-b border-stone-100 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Logo className="scale-90 origin-left" />
        <div className="hidden md:flex items-center gap-2">
          {getTabs().map(tab => (
            <button key={tab.id} onClick={() => setCurrentTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all ${currentTab === tab.id ? 'bg-amber-100 text-amber-700' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'}`}>
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setShowNotif(!showNotif)} className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors relative">
              <Bell size={18} />
              {notifications.length > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>}
            </button>
            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden z-50">
                <div className="p-4 border-b border-stone-100 bg-stone-50"><h3 className="font-bold text-stone-800">Notificaciones</h3></div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? <div className="p-4 text-center text-stone-500 text-sm">No hay notificaciones</div> : notifications.map(n => (
                    <div key={n.id} className="p-4 border-b border-stone-50 hover:bg-stone-50">
                      <h4 className="font-bold text-stone-800 text-sm">{n.title}</h4>
                      <p className="text-stone-500 text-xs mt-1">{n.message}</p>
                      <p className="text-stone-400 text-[10px] mt-2">{new Date(n.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => alert('¡Gracias por tu interés en donar! Esta función estará disponible pronto.')} className="hidden md:flex items-center gap-2 bg-rose-100 text-rose-600 hover:bg-rose-200 px-4 py-2 rounded-full font-bold text-sm transition-colors">
            <Gift size={18} /> Donar
          </button>
          <button onClick={() => setCurrentTab('profile')} className="hidden sm:flex items-center gap-3 hover:bg-stone-50 p-1.5 rounded-full transition-colors text-left">
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-stone-900 leading-tight">{user.full_name || user.username}</p>
              <p className="text-xs text-stone-500 font-medium">{user.role}</p>
            </div>
            {user.profile_pic ? (
              <img src={user.profile_pic} alt={user.username} className="w-10 h-10 rounded-full object-cover border border-stone-200" />
            ) : (
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center"><UserIcon size={18} /></div>
            )}
          </button>
          <button onClick={onLogout} className="hidden sm:flex w-10 h-10 bg-stone-50 rounded-full items-center justify-center text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"><LogOut size={18} /></button>
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors">
            {showMobileMenu ? <X size={20} /> : <div className="space-y-1.5"><div className="w-5 h-0.5 bg-current"></div><div className="w-5 h-0.5 bg-current"></div><div className="w-5 h-0.5 bg-current"></div></div>}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white border-t border-stone-100 overflow-hidden">
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-3 p-3 mb-4 bg-stone-50 rounded-2xl">
                {user.profile_pic ? (
                  <img src={user.profile_pic} alt={user.username} className="w-12 h-12 rounded-full object-cover border border-stone-200" />
                ) : (
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center"><UserIcon size={20} /></div>
                )}
                <div>
                  <p className="text-sm font-bold text-stone-900 leading-tight">{user.full_name || user.username}</p>
                  <p className="text-xs text-stone-500 font-medium">{user.role}</p>
                </div>
              </div>
              {getTabs().map(tab => (
                <button key={tab.id} onClick={() => { setCurrentTab(tab.id); setShowMobileMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${currentTab === tab.id ? 'bg-amber-100 text-amber-700' : 'text-stone-600 hover:bg-stone-50'}`}>
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
              <div className="h-px bg-stone-100 my-2"></div>
              <button onClick={() => { setCurrentTab('profile'); setShowMobileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-stone-600 hover:bg-stone-50 transition-all">
                <UserIcon size={18} /> Mi Perfil
              </button>
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-rose-600 hover:bg-rose-50 transition-all">
                <LogOut size={18} /> Cerrar Sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
