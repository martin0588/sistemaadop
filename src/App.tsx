import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './components/Navbar';
import LandingPage from './components/auth/LandingPage';
import LoginScreen from './components/auth/LoginScreen';
import RegisterScreen from './components/auth/RegisterScreen';
import Dashboard from './modules/reportes/Dashboard';
import PetCatalog from './modules/mascotas/PetCatalog';
import UserManagement from './modules/comun/gestion-personal/UserManagement';
import AdoptionRequests from './modules/adopciones/AdoptionRequests';
import MyAdoptions from './modules/comun/adoptantes/MyAdoptions';
import UserProfile from './modules/comun/gestion-personal/UserProfile';
import NotificationsAdmin from './modules/reportes/NotificationsAdmin';
import SystemReports from './modules/reportes/SystemReports';
import { User } from './types';

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'app'>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('pets');

  const handleLogin = async (username: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setView('app');
        setCurrentTab(data.user.role === 'Administrador' ? 'dashboard' : 'pets');
        return null;
      }
      return data.message || 'Credenciales inválidas';
    } catch (error) {
      return 'Error de conexión';
    }
  };

  const handleRegister = async (formData: any): Promise<string | null> => {
    try {
      const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setView('app');
        setCurrentTab('pets');
        return null;
      }
      return data.message || 'Error al registrar';
    } catch (error) {
      return 'Error de conexión';
    }
  };

  const handleLogout = () => { setUser(null); setView('landing'); };

  if (view === 'landing') return <LandingPage onLoginClick={() => setView('login')} onRegisterClick={() => setView('register')} />;
  if (view === 'login') return <LoginScreen onLogin={handleLogin} onBack={() => setView('landing')} />;
  if (view === 'register') return <RegisterScreen onRegister={handleRegister} onBack={() => setView('landing')} />;

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-stone-800 font-sans flex flex-col">
      <Navbar user={user!} currentTab={currentTab} setCurrentTab={setCurrentTab} onLogout={handleLogout} />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div key={currentTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {currentTab === 'dashboard' && <Dashboard setCurrentTab={setCurrentTab} user={user!} />}
            {currentTab === 'pets' && <PetCatalog user={user!} />}
            {currentTab === 'users' && <UserManagement />}
            {currentTab === 'adoptions' && <AdoptionRequests user={user!} />}
            {currentTab === 'my-adoptions' && <MyAdoptions user={user!} />}
            {currentTab === 'profile' && <UserProfile user={user!} setUser={setUser} />}
            {currentTab === 'notifications' && <NotificationsAdmin />}
            {currentTab === 'reports' && <SystemReports />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
