import React, { useState } from "react";

const MockForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    examName: "",
    category: "SBI PO Pre", // Set a default from your list
    score: "",
    difficulty: "Medium",
    sections: {
      quants: "",
      reasoning: "",
      english: "",
      gs: "", // Added GS for SSC/AFCAT/NTPC
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.examName || !formData.score)
      return alert("Please fill details");

    const finalData = {
      ...formData,
      date: new Date().toISOString(), // Ensure date is captured
      score: Number(formData.score),
      sections: {
        quants: Number(formData.sections.quants || 0),
        reasoning: Number(formData.sections.reasoning || 0),
        english: Number(formData.sections.english || 0),
        gs: Number(formData.sections.gs || 0),
      },
    };
    onSave(finalData);
    // Reset form for next entry
    setFormData({ ...formData, examName: "", score: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card bg-slate-900 border-blue-500/30 space-y-4 animate-in fade-in duration-500 p-4 shadow-2xl"
    >
      <input
        placeholder="Mock Name (e.g. Testbook Live Mock #1)"
        className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg focus:border-blue-500 outline-none text-sm text-white"
        value={formData.examName}
        onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
      />

      <div className="flex gap-2">
        <select
          className="flex-1 bg-slate-950 border border-slate-800 p-3 rounded-lg text-[11px] outline-none text-white appearance-none"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <optgroup label="Banking - SBI/IBPS">
            <option>SBI PO Pre</option>
            <option>SBI PO Mains</option>
            <option>SBI Clerk Pre</option>
            <option>IBPS PO Pre</option>
            <option>IBPS PO Mains</option>
            <option>IBPS Clerk</option>
            <option>IBPS SO</option>
          </optgroup>
          <optgroup label="Regulatory & Others">
            <option>RBI Grade B</option>
            <option>SEBI Grade A</option>
            <option>NABARD Grade A</option>
            <option>RRB PO/Clerk</option>
          </optgroup>
          <optgroup label="SSC / AFCAT / Technical">
            <option>SSC CGL/CHSL</option>
            <option>AFCAT</option>
            <option>RRB NTPC</option>
            <option>RPSC Computer Inst.</option>
          </optgroup>
        </select>
        
        <input
          type="number"
          placeholder="Score"
          className="w-24 bg-slate-950 border border-slate-800 p-3 rounded-lg text-sm outline-none text-center font-bold text-blue-400"
          value={formData.score}
          onChange={(e) => setFormData({ ...formData, score: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-4 gap-2 py-2">
        {["quants", "reasoning", "english", "gs"].map((sec) => (
          <div key={sec} className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase block text-center tracking-tighter">
              {sec}
            </label>
            <input
              type="number"
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs text-center text-white focus:border-blue-500 outline-none"
              value={formData.sections[sec]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sections: { ...formData.sections, [sec]: e.target.value },
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="flex justify-around bg-slate-950 p-1.5 rounded-lg border border-slate-800">
        {["Easy", "Medium", "Hard"].map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => setFormData({ ...formData, difficulty: lvl })}
            className={`flex-1 py-1 rounded-md text-[9px] font-black uppercase transition-all ${
              formData.difficulty === lvl
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-600 hover:text-slate-400"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/40 text-white text-xs"
      >
        Analyze Result
      </button>
    </form>
  );
};

export default MockForm;