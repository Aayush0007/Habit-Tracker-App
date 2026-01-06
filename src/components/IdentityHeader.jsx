import React from 'react';

const IdentityHeader = ({ totalHours = 0 }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 rounded-b-2xl shadow-lg mb-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest">Aspirant Status</p>
          <h2 className="text-white font-black text-xl">WARRIOR MODE</h2>
        </div>
        <div className="text-right text-white">
          <p className="text-[10px] opacity-80 uppercase">Total 2026 Effort</p>
          <p className="text-2xl font-black">{totalHours} <span className="text-sm font-normal">HRS</span></p>
        </div>
      </div>
    </div>
  );
};

export default IdentityHeader;