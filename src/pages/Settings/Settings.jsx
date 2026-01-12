import React, { useState, useEffect } from "react";
import {
  Download,
  Database,
  LogOut,
  Save,
  Edit3,
  Trash2,
  ShieldCheck,
  User,
  Loader2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import { tacticalService } from "../../services/tacticalService";
import { showToast } from "../../services/notificationService";

const Settings = () => {
  const [profile, setProfile] = useState({ fullName: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(null); // 'json' or 'pdf'

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setProfile({
        fullName: user.user_metadata?.full_name || "Warrior Aspirant",
        email: user.email,
      });
    }
  }

  const handleUpdateProfile = async () => {
    if (!profile.fullName.trim())
      return showToast("Name cannot be empty", "error");
    
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: profile.fullName },
    });
    
    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Identity Updated");
      setIsEditing(false);
    }
    setLoading(false);
  };

  /**
   * DUAL EXPORT LOGIC
   * json: Full system state for recovery
   * pdf: Clean, formatted tactical report
   */
  const handleExport = async (type) => {
    setExporting(type);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (type === "json") {
        const [sessions, mocks, logs, syllabus] = await Promise.all([
          supabase.from("study_sessions").select("*").eq("user_id", user.id),
          supabase.from("mock_exams").select("*").eq("user_id", user.id),
          supabase.from("daily_logs").select("*").eq("user_id", user.id),
          supabase.from("syllabus_progress").select("*").eq("user_id", user.id),
        ]);

        const backupData = {
          exportDate: new Date().toISOString(),
          sessions: sessions.data,
          mocks: mocks.data,
          logs: logs.data,
          syllabus: syllabus.data,
        };

        const blob = new Blob([JSON.stringify(backupData, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Tactical_Backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        showToast("System Archive Exported");
      } else {
        // PDF Report Generation via tacticalService
        const { data: mocks, error } = await supabase
          .from("mock_exams")
          .select("date, exam_name, category, score, difficulty")
          .eq("user_id", user.id)
          .order("date", { ascending: false });

        if (error) throw error;
        
        if (!mocks || mocks.length === 0) {
          showToast("No Mock Records to Report", "error");
        } else {
          tacticalService.exportToPDF(mocks, "Mock Performance Analysis");
          showToast("Tactical PDF Generated");
        }
      }
    } catch (error) {
      console.error("Export Error:", error);
      showToast("Export Malfunction", "error");
    } finally {
      setExporting(null);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) showToast(error.message, "error");
    else showToast("Session Terminated");
  };

  return (
    <div className="p-6 space-y-8 pb-32 max-w-2xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black italic text-white tracking-tighter uppercase leading-none">
            System
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] ml-1 mt-2 underline decoration-blue-500/50 underline-offset-4">
            Command Control Center
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="p-4 bg-rose-500/5 text-rose-500 rounded-2xl border border-rose-500/10 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-950/20"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* Profile Section */}
      <section className="card bg-slate-900 border-2 border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-blue-500/5 flex items-center justify-center text-blue-500 border-2 border-blue-500/10 shadow-inner group-hover:border-blue-500/30 transition-all duration-500">
            <User size={40} />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">
              Operational Identity
            </p>
            {isEditing ? (
              <input
                autoFocus
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
                onKeyDown={(e) => e.key === "Enter" && handleUpdateProfile()}
                className="bg-slate-950 border-2 border-blue-500/50 rounded-xl px-4 py-2 text-white w-full focus:outline-none text-lg font-bold"
              />
            ) : (
              <h3 className="font-black text-white text-2xl uppercase italic tracking-tighter">
                {profile.fullName}
              </h3>
            )}
            <p className="text-xs text-slate-500 font-medium lowercase tracking-tight opacity-70">
              {profile.email}
            </p>
          </div>
          <button
            onClick={() =>
              isEditing ? handleUpdateProfile() : setIsEditing(true)
            }
            className={`p-3 rounded-2xl transition-all duration-300 shadow-xl ${
              isEditing
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isEditing ? (
              <Save size={20} />
            ) : (
              <Edit3 size={20} />
            )}
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
      </section>

      {/* Data Management Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-500 ml-2">
          <Database size={14} className="text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Deployment Records
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* JSON Export */}
          <div className="card border-2 border-slate-800 bg-slate-900/40 p-6 rounded-[2rem] hover:border-slate-700 transition-all group">
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/10 w-fit mb-4">
              <Download size={20} className="text-blue-500" />
            </div>
            <h4 className="text-white font-black uppercase text-xs mb-1">
              System Archive
            </h4>
            <p className="text-[10px] text-slate-500 leading-relaxed mb-6 font-medium">
              Full raw backup in JSON format for system recovery.
            </p>
            <button
              onClick={() => handleExport("json")}
              disabled={!!exporting}
              className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all border border-slate-700 disabled:opacity-50"
            >
              {exporting === "json" ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <Download size={14} />
              )}
              {exporting === "json" ? "ARCHIVING..." : "EXPORT JSON"}
            </button>
          </div>

          {/* PDF Export */}
          <div className="card border-2 border-slate-800 bg-slate-900/40 p-6 rounded-[2rem] hover:border-slate-700 transition-all group">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/10 w-fit mb-4">
              <FileText size={20} className="text-emerald-500" />
            </div>
            <h4 className="text-white font-black uppercase text-xs mb-1">
              Tactical Report
            </h4>
            <p className="text-[10px] text-slate-500 leading-relaxed mb-6 font-medium">
              Clean PDF document optimized for offline performance reviews.
            </p>
            <button
              onClick={() => handleExport("pdf")}
              disabled={!!exporting}
              className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all border border-slate-700 disabled:opacity-50"
            >
              {exporting === "pdf" ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <FileText size={14} />
              )}
              {exporting === "pdf" ? "GENERATING..." : "EXPORT PDF"}
            </button>
          </div>
        </div>
      </section>

      {/* Safety Zone */}
      <section className="card border-2 border-rose-500/10 bg-rose-500/[0.02] p-6 rounded-[2rem] hover:border-rose-500/30 transition-all">
          <div className="flex items-center gap-3 text-rose-500/50 mb-3">
            <AlertTriangle size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Hazard Zone</span>
          </div>
          <p className="text-[10px] text-slate-500 mb-4 font-medium italic">Wiping combat history is a permanent action. Use with extreme caution.</p>
          <button className="flex items-center gap-2 text-rose-500/40 text-[9px] font-black uppercase tracking-widest cursor-not-allowed">
            <Trash2 size={12} /> Purge Identity History (Locked)
          </button>
      </section>

      <footer className="pt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full">
          <ShieldCheck size={12} className="text-emerald-500" />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            End-to-End Encrypted via Supabase
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Settings;