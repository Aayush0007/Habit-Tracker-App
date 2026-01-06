import React from 'react';
import { Download, ShieldCheck, User, Database } from 'lucide-react';
import { exportUserData } from '../../utils/backupService';

const Settings = () => {
  return (
    <div className="p-6 space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-white">System Settings</h1>
        <p className="text-slate-400 text-sm">Manage your 2026 Data</p>
      </header>

      {/* Profile Section */}
      <section className="card bg-slate-900 border-slate-800 p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
          <User size={24} />
        </div>
        <div>
          <h3 className="font-bold text-white uppercase tracking-tighter">Aspirant 2026</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase">Target: SBI PO / IBPS PO</p>
        </div>
      </section>

      {/* Data Security Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-400 ml-1">
          <Database size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">Data Management</span>
        </div>
        
        <div className="card border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Local Storage Active</h4>
              <p className="text-xs text-slate-500 mt-1">Your data is stored locally in this browser. To prevent data loss, download a backup monthly.</p>
            </div>
          </div>

          <button 
            onClick={exportUserData}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-all border border-slate-700"
          >
            <Download size={18} />
            Export Backup (.json)
          </button>
        </div>
      </section>

      <footer className="text-center opacity-20 pt-10">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Warrior Mode v1.0 • 2026</p>
      </footer>
    </div>
  );
};

export default Settings;