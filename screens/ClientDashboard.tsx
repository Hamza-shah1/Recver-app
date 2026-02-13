
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { User, UserRole, Client, Payment } from '../types';
import { db } from '../services/storage';

const ClientDashboard: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [clientProfile, setClientProfile] = useState<Client | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allClients = await db.getClients();
        // Match using normalized CNIC or Phone
        const profile = allClients.find(c => 
          c.cnic.replace(/\D/g, '') === user.cnic.replace(/\D/g, '') || 
          c.phone.replace(/\D/g, '') === user.phone.replace(/\D/g, '')
        );
        
        setClientProfile(profile || null);

        if (profile) {
          const allPayments = await db.getPayments(profile.id);
          setPayments(allPayments.sort((a, b) => b.createdAt - a.createdAt));
        }
      } catch (err) {
        console.error("Dashboard Load Error", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user.cnic, user.phone]);

  const formatCurrency = (val: number) => val.toLocaleString('en-PK', { minimumFractionDigits: 0 });

  if (loading) {
    return (
      <Layout title="Syncing..." role={UserRole.CLIENT}>
        <div className="flex flex-col items-center justify-center py-20">
          <i className="fas fa-circle-notch fa-spin text-indigo-600 text-3xl"></i>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Business Hub" role={UserRole.CLIENT} onLogout={onLogout}>
      {clientProfile ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden animate-in zoom-in">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <p className="text-[10px] uppercase font-black tracking-[0.3em] opacity-50 mb-2">Net Payable Balance</p>
            <h3 className="text-4xl font-black mb-8">
              Rs. {formatCurrency(clientProfile.totalPending)}
            </h3>
            
            <div className="flex justify-between items-end border-t border-white/10 pt-6">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase opacity-40">Shop Account</p>
                <p className="text-sm font-black truncate max-w-[150px]">{clientProfile.shopName}</p>
                <p className="text-[9px] font-mono opacity-60 tracking-widest">{user.cnic}</p>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-right">
                <p className="text-[8px] font-black opacity-40 uppercase mb-0.5">Status</p>
                <p className="text-xs font-black text-green-400">Verified</p>
              </div>
            </div>
          </div>

          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center mb-4 px-2">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction History</h4>
              <div className="text-[9px] font-black text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full">
                {payments.length} Entries
              </div>
            </div>
            
            <div className="space-y-4">
              {payments.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-100">
                  <i className="fas fa-receipt text-3xl text-slate-200 mb-4 opacity-30"></i>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Awaiting First Entry</p>
                </div>
              ) : (
                payments.map(p => (
                  <div key={p.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-50 flex items-center justify-between shadow-sm">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mr-4 border border-emerald-100">
                        <i className="fas fa-check-double text-sm"></i>
                      </div>
                      <div>
                        <h5 className="font-black text-slate-800 text-lg leading-none">Rs. {formatCurrency(p.paidAmount)}</h5>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
                          {new Date(p.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short' })}
                        </p>
                      </div>
                    </div>
                    {p.receiptUrl && (
                      <button onClick={() => window.open(p.receiptUrl, '_blank')} className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center active:scale-90 transition-all border border-indigo-100">
                        <i className="fas fa-file-invoice text-sm"></i>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-8 text-center animate-in fade-in">
          <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-indigo-300 mb-8 shadow-inner">
            <i className="fas fa-hourglass-start text-4xl animate-pulse"></i>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-3">Syncing Your Ledger</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10">
            Welcome to RECOVR! Your account is active, but we are waiting for your supplier's field agent to link your shop's CNIC ({user.cnic}) to their digital records.
          </p>
          
          <div className="grid grid-cols-1 gap-4 w-full">
            <button 
              onClick={() => navigate('/ai-assistant')}
              className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-200"
            >
              Consult AI Marshall
            </button>
            <button 
              onClick={onLogout}
              className="w-full py-5 bg-slate-50 text-slate-400 font-black rounded-3xl text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-colors"
            >
              Sign Out & Retry Later
            </button>
          </div>

          <div className="mt-12 p-5 bg-slate-900 rounded-3xl text-left w-full border-l-4 border-indigo-500">
            <p className="text-indigo-400 text-[9px] font-black uppercase tracking-widest mb-1">Onboarding Tip</p>
            <p className="text-white text-[11px] font-medium opacity-80 leading-relaxed">
              Once linked, you can track all payments, view digital parchis, and chat with your supplier's AI for balance queries.
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ClientDashboard;
