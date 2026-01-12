import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import MockForm from "./MockForm"; // Ensure this points to the pure form component
import { Trophy, TrendingUp, Swords, Target, Plus, X, BarChart2, Loader2 } from "lucide-react";
import { showToast } from "../../services/notificationService";

const MockTests = () => {
  const [mocks, setMocks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMocks = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("mock_exams")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) showToast(error.message, "error");
    else setMocks(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMocks(); }, []);

  const handleSaveMock = async (mockData) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("mock_exams")
      .insert([{ ...mockData, user_id: user.id }]);

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Strategic Data Captured");
      setShowForm(false);
      fetchMocks();
    }
  };

  const deleteMock = async (id) => {
    const { error } = await supabase.from("mock_exams").delete().eq("id", id);
    if (error) showToast(error.message, "error");
    else {
      setMocks(prev => prev.filter(m => m.id !== id));
      showToast("Record Purged");
    }
  };

  return (
    <div className="p-6 space-y-6 pb-24 max-w-2xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">Ops Log</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">Combat Performance History</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`p-4 rounded-2xl transition-all shadow-xl ${showForm ? 'bg-slate-800 text-rose-500' : 'bg-blue-600 text-white shadow-blue-900/40'}`}
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
        </button>
      </header>

      {showForm && <MockForm onSave={handleSaveMock} />}

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
        ) : mocks.length === 0 ? (
          <div className="card bg-slate-900 border-2 border-dashed border-slate-800 p-16 text-center rounded-[2rem] opacity-40">
            <Swords size={48} className="mx-auto mb-4 text-slate-700" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No Tactical Data Found</p>
          </div>
        ) : (
          mocks.map(mock => (
            <div key={mock.id} className="card bg-slate-900 border-2 border-slate-800 p-5 rounded-[1.5rem] flex justify-between items-center group hover:border-blue-500/30 transition-all shadow-lg">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center">
                  <span className="text-blue-400 font-black text-lg italic">{mock.score}</span>
                  <span className="text-[7px] text-slate-600 font-black uppercase">Score</span>
                </div>
                <div>
                  <h3 className="font-black text-white text-sm italic uppercase tracking-tight">{mock.exam_name}</h3>
                  <div className="flex gap-2 mt-1.5">
                    <span className="text-[7px] font-black text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded-md">{mock.category}</span>
                    <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-md ${mock.difficulty === 'Hard' ? 'text-rose-500 bg-rose-500/10' : 'text-slate-500 bg-slate-800'}`}>{mock.difficulty}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => deleteMock(mock.id)} className="p-2 text-slate-800 hover:text-rose-500 transition-colors"><X size={18} /></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MockTests;