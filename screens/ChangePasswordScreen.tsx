
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { User } from '../types';
import { db } from '../services/storage';

const ChangePasswordScreen: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await db.updateUserPassword(user.id, newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/settings'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Change Password" showBack role={user.role}>
      <div className="pt-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {success ? (
          <div className="m3-card p-10 text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl animate-bounce">
              <i className="fas fa-check text-2xl"></i>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Secret Key Updated</h3>
            <p className="text-xs text-slate-500 font-medium">Your account security has been refreshed. Returning to settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="m3-card p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">New Secret Key</label>
                  <div className="relative">
                    <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600"></i>
                    <input 
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full pl-14 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/20"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Confirm Secret Key</label>
                  <div className="relative">
                    <i className="fas fa-shield-check absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600"></i>
                    <input 
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full pl-14 pr-5 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/20"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase rounded-2xl border border-rose-100 dark:border-rose-900/30 flex items-center">
                <i className="fas fa-exclamation-triangle mr-3"></i> {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-indigo-600 text-white font-black rounded-[2rem] shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-3"
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-shield-keyhole"></i>}
              <span className="uppercase tracking-[0.2em] text-[11px]">Secure Account</span>
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default ChangePasswordScreen;
