import React, { useState } from "react";
import { BarChart, ChevronDown, ShieldAlert } from "lucide-react";

const MockForm = ({ onSave = () => console.error("onSave prop is missing!") }) => {
  const [formData, setFormData] = useState({
    exam_name: "",
    category: "AFCAT 1",
    score: "",
    difficulty: "Medium",
    sections: { quants: "", reasoning: "", english: "", gs: "" },
  });

  // Logic: Exams containing "Pre" or "Clerk Pre" usually don't have GA/GS.
  // AFCAT, Mains, and Regulatory exams (RBI/NABARD/SEBI) do have them.
  const hasGS = !formData.category.includes("Pre") || formData.category.includes("Mains") || 
                formData.category.includes("Main") || formData.category.includes("AFCAT") || 
                formData.category.includes("Grade B") || formData.category.includes("Gr A");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.exam_name || !formData.score) return alert("STRATEGIC DATA MISSING");

    onSave({
      ...formData,
      score: Number(formData.score),
      sections: {
        quants: Number(formData.sections.quants || 0),
        reasoning: Number(formData.sections.reasoning || 0),
        english: Number(formData.sections.english || 0),
        gs: hasGS ? Number(formData.sections.gs || 0) : null, // Critical: pass null if no GS
      },
      date: new Date().toISOString()
    });

    setFormData({
      exam_name: "", category: "AFCAT 1", score: "", difficulty: "Medium",
      sections: { quants: "", reasoning: "", english: "", gs: "" },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-slate-900 border-2 border-blue-500/20 p-6 rounded-3xl space-y-5 shadow-2xl animate-in zoom-in-95 duration-300">
      <div className="flex items-center gap-2 mb-2">
        <ShieldAlert size={16} className="text-blue-500" />
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">New Mock Entry</span>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Operation Name</label>
        <input
          placeholder="e.g. Testbook Live Mock #1"
          className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-blue-500 transition-all"
          value={formData.exam_name}
          onChange={(e) => setFormData({ ...formData, exam_name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
          <div className="relative">
            <select
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-xs text-white appearance-none outline-none focus:border-blue-500 cursor-pointer"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <optgroup label="Upcoming Defense & Tech">
                <option>AFCAT 1</option>
                <option>AFCAT 2</option>
                <option>RRB NTPC</option>
                <option>RPSC Comp</option>
              </optgroup>
              <optgroup label="Banking - SBI">
                <option>SBI PO Pre</option>
                <option>SBI PO Mains</option>
                <option>SBI Clerk Pre</option>
              </optgroup>
              <optgroup label="Banking - IBPS">
                <option>IBPS PO Pre</option>
                <option>IBPS PO Mains</option>
                <option>IBPS Clerk Pre</option>
                <option>IBPS Clerk Main</option>
                <option>IBPS SO Pre</option>
                <option>IBPS SO Mains</option>
              </optgroup>
              <optgroup label="Gramin Bank (RRB)">
                <option>RRB PO Pre</option>
                <option>RRB PO Mains</option>
                <option>RRB Clerk Pre</option>
                <option>RRB Clerk Mains</option>
              </optgroup>
              <optgroup label="Regulatory Bodies">
                <option>RBI Grade B</option>
                <option>NABARD Gr A</option>
                <option>SEBI Gr A</option>
              </optgroup>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Total Score</label>
          <input
            type="number"
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl text-lg font-black text-blue-400 text-center outline-none"
            value={formData.score}
            onChange={(e) => setFormData({ ...formData, score: e.target.value })}
          />
        </div>
      </div>

      <div className={`grid ${hasGS ? 'grid-cols-4' : 'grid-cols-3'} gap-3 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50`}>
        {["quants", "reasoning", "english", ...(hasGS ? ["gs"] : [])].map((sec) => (
          <div key={sec} className="space-y-1">
            <label className="text-[8px] font-black text-slate-600 uppercase text-center block tracking-tighter">{sec}</label>
            <input
              type="number"
              className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs text-center text-white outline-none focus:border-blue-500 transition-colors"
              value={formData.sections[sec]}
              onChange={(e) => setFormData({...formData, sections: {...formData.sections, [sec]: e.target.value}})}
            />
          </div>
        ))}
      </div>

      <button type="submit" className="group relative w-full overflow-hidden bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl text-white text-xs flex items-center justify-center gap-3 transition-all active:scale-95">
        <BarChart size={18} /> Commit Analysis
      </button>
    </form>
  );
};

export default MockForm;