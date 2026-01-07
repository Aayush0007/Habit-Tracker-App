import React, { useState } from "react";

const MockForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    examName: "",
    category: "SBI PO",
    score: "",
    difficulty: "Medium",
    sections: {
      quants: "",
      reasoning: "",
      english: "",
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.examName || !formData.score)
      return alert("Please fill details");
    
    // Ensure scores are numbers
    const finalData = {
      ...formData,
      score: Number(formData.score),
      sections: {
        quants: Number(formData.sections.quants || 0),
        reasoning: Number(formData.sections.reasoning || 0),
        english: Number(formData.sections.english || 0),
      }
    };
    onSave(finalData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card bg-slate-900 border-blue-500/30 space-y-4 animate-in fade-in duration-500 p-4"
    >
      <input
        placeholder="Mock Name (e.g. Oliveboard #4)"
        className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg focus:border-blue-500 outline-none text-sm text-white"
        value={formData.examName}
        onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
      />
      
      <div className="flex gap-2">
        <select
          className="flex-1 bg-slate-950 border border-slate-800 p-3 rounded-lg text-sm outline-none text-white"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option>SBI PO</option>
          <option>IBPS PO</option>
          <option>RBI Grade B</option>
          <option>Other</option>
        </select>
        <input
          type="number"
          placeholder="Total"
          className="w-24 bg-slate-950 border border-slate-800 p-3 rounded-lg text-sm outline-none text-center font-bold text-blue-400"
          value={formData.score}
          onChange={(e) => setFormData({ ...formData, score: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 py-2">
        {["quants", "reasoning", "english"].map((sec) => (
          <div key={sec} className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase block text-center">
              {sec}
            </label>
            <input
              type="number"
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs text-center text-white focus:border-blue-500 outline-none"
              value={formData.sections[sec]}
              onChange={(e) =>
                setFormData({ 
                  ...formData, 
                  sections: { ...formData.sections, [sec]: e.target.value } 
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="flex justify-around bg-slate-950 p-2 rounded-lg border border-slate-800">
        {["Easy", "Medium", "Hard"].map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => setFormData({ ...formData, difficulty: lvl })}
            className={`px-4 py-1 rounded-md text-[10px] font-black uppercase transition-all ${
              formData.difficulty === lvl ? "bg-blue-600 text-white" : "text-slate-600"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20 text-white"
      >
        Log Performance
      </button>
    </form>
  );
};

export default MockForm;