import React from 'react';
import { Download, Upload, ShieldCheck, User, Database, Trash2 } from 'lucide-react';
import { exportUserData, importUserData } from '../../utils/backupService';

const Settings = () => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) importUserData(file);
  };

  return (
    <div className="p-6 space-y-8 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-slate-400 text-sm italic">Manage your 2026 Data & Profile</p>
      </header>

      {/* Profile Section */}
      <section className="card bg-slate-900 border-slate-800 p-5 flex items-center gap-5 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
          <User size={32} />
        </div>
        <div>
          <h3 className="font-black text-white text-lg uppercase tracking-tighter">Warrior Aspirant</h3>
          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Target: SBI PO 2026</p>
        </div>
      </section>

      {/* Data Management Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-500 ml-1">
          <Database size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Data Security</span>
        </div>
        
        <div className="card border-slate-800 bg-slate-900/50 p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white italic">Local Storage Protected</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Your data lives in your browser. Download a backup monthly to ensure you never lose your progress.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={exportUserData}
              className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold transition-all border border-slate-700 shadow-lg"
            >
              <Download size={18} />
              Export Backup (.json)
            </button>

            <label className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-slate-300 py-4 rounded-xl font-bold transition-all border border-slate-800 cursor-pointer">
              <Upload size={18} />
              Import Backup
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </section>

      <footer className="text-center opacity-30 pt-10">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.5em]">Warrior Mode v2.0 • 2026 System</p>
      </footer>
    </div>
  );
};

export default Settings;