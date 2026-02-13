
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { db } from './services/storage';
import { User, UserRole } from './types';

// Screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import SalesmanDashboard from './screens/SalesmanDashboard';
import ClientDashboard from './screens/ClientDashboard';
import CompanyDashboard from './screens/CompanyDashboard';
import AddClientScreen from './screens/AddClientScreen';
import AddPaymentScreen from './screens/AddPaymentScreen';
import LedgerScreen from './screens/LedgerScreen';
import AIChatScreen from './screens/AIChatScreen';
import VideoGenScreen from './screens/VideoGenScreen';
import ClientsListScreen from './screens/ClientsListScreen';
import SettingsScreen from './screens/SettingsScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const initAuth = () => {
      try {
        const authUser = db.getAuth();
        setUser(authUser);
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setTimeout(() => setIsInitializing(false), 1000);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  if (isInitializing) {
    return <SplashScreen />;
  }

  const handleLogin = (u: User) => setUser(u);
  const handleLogout = () => {
    db.logout();
    setUser(null);
  };

  const getDashboard = () => {
    if (!user) return <Navigate to="/login" replace />;
    switch (user.role) {
      case UserRole.SALESMAN: return <SalesmanDashboard user={user} onLogout={handleLogout} />;
      case UserRole.CLIENT: return <ClientDashboard user={user} onLogout={handleLogout} />;
      case UserRole.COMPANY: return <CompanyDashboard user={user} onLogout={handleLogout} />;
      default: return <Navigate to="/login" replace />;
    }
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginScreen onLogin={handleLogin} />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegistrationScreen onLogin={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        
        <Route path="/dashboard" element={getDashboard()} />
        
        <Route path="/clients" element={user?.role === UserRole.SALESMAN ? <ClientsListScreen user={user} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/add-client" element={user?.role === UserRole.SALESMAN ? <AddClientScreen user={user} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/add-payment" element={user?.role === UserRole.SALESMAN ? <AddPaymentScreen user={user} /> : <Navigate to="/dashboard" replace />} />
        
        <Route path="/ledger/:clientId" element={user ? <LedgerScreen user={user} /> : <Navigate to="/login" replace />} />
        <Route path="/ai-assistant" element={user ? <AIChatScreen user={user} /> : <Navigate to="/login" replace />} />
        <Route path="/video-recap" element={user ? <VideoGenScreen user={user} /> : <Navigate to="/login" replace />} />
        
        <Route path="/settings" element={user ? <SettingsScreen user={user} onLogout={handleLogout} isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} /> : <Navigate to="/login" replace />} />
        <Route path="/change-password" element={user ? <ChangePasswordScreen user={user} /> : <Navigate to="/login" replace />} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
