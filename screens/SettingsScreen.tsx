
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { User, UserRole } from '../types';

interface SettingsScreenProps {
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, onLogout, isDarkMode, onToggleTheme }) => {
  const navigate = useNavigate();

  return (
    <Layout title="App Settings" showBack role={user.role}>
      <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Profile Card */}
        <div className="m3-card p-6 flex items-center space-x-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{user.name}</h3>
            <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{user.role}</p>
            <p className="text-xs text-slate-400 mt-1">{user.email}</p>
          </div>
        </div>

        {/* Settings Group: Preferences */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Preferences</h4>
          <div className="m3-card overflow-hidden">
            <button 
              onClick={onToggleTheme}
              className="w-full px-6 py-5 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-800 transition-colors"
            >
              <div className="flex items-center space-x-4 text-slate-700 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <i className={`fas ${isDarkMode ? 'fa-moon' : 'fa-sun'}`}></i>
                </div>
                <span className="font-bold">Dark Mode</span>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`}></div>
              </div>
            </button>
            
            <div className="h-[1px] bg-slate-100 dark:bg-slate-800 mx-6"></div>

            <button 
              className="w-full px-6 py-5 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-800 transition-colors opacity-50"
              disabled
            >
              <div className="flex items-center space-x-4 text-slate-700 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                  <i className="fas fa-bell"></i>
                </div>
                <span className="font-bold">Push Notifications</span>
              </div>
              <i className="fas fa-chevron-right text-slate-300 text-xs"></i>
            </button>
          </div>
        </div>

        {/* Settings Group: Account */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Security</h4>
          <div className="m3-card overflow-hidden">
            <button 
              onClick={() => navigate('/change-password')}
              className="w-full px-6 py-5 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-800 transition-colors"
            >
              <div className="flex items-center space-x-4 text-slate-700 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <i className="fas fa-key"></i>
                </div>
                <span className="font-bold">Change Password</span>
              </div>
              <i className="fas fa-chevron-right text-slate-300 text-xs"></i>
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <div className="pt-4">
          <button 
            onClick={onLogout}
            className="w-full py-5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-black rounded-[2rem] border border-rose-100 dark:border-rose-900/30 active:scale-95 transition-all flex items-center justify-center space-x-3"
          >
            <i className="fas fa-power-off"></i>
            <span className="uppercase tracking-[0.2em] text-[11px]">Terminate Session</span>
          </button>
        </div>

        <div className="text-center pt-8">
          <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.4em]">Recovr AI v4.0.2</p>
          <p className="text-[8px] font-medium text-slate-300 dark:text-slate-600 mt-1 px-12 italic">Precision collection intelligence for Pakistan's vibrant field markets.</p>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsScreen;
