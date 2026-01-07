import React from 'react';
import { ExternalLink, BookMarked, Video, FileText } from 'lucide-react';

const Resources = () => {
  const resources = [
    { category: 'Quants', type: 'Video', link: 'https://youtube.com/...', title: 'Mains Level DI Playlist', provider: 'Learning Hub' },
    { category: 'General Studies', type: 'PDF', link: 'https://...', title: 'SSC CGL Static GK Notes', provider: 'Self-Study' },
    { category: 'Regulatory', type: 'PDF', link: 'https://...', title: 'RBI Grade B Finance PDF', provider: 'Edutap' },
    { category: 'Computers', type: 'Video', link: 'https://...', title: 'DBMS Full Course', provider: 'GateSmashers' },
  ];

  return (
    <div className="p-6 space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-white">Resource Vault</h1>
        <p className="text-slate-400 text-sm italic">Direct access to 2026 study materials</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {resources.map((res, index) => (
          <a 
            key={index}
            href={res.link}
            target="_blank"
            rel="noopener noreferrer"
            className="card bg-slate-900 border-slate-800 p-4 flex items-center justify-between hover:border-blue-500/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-800 rounded-xl text-blue-400 group-hover:bg-blue-500/10">
                {res.type === 'Video' ? <Video size={20} /> : <FileText size={20} />}
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{res.category}</span>
                <h3 className="text-sm font-bold text-white">{res.title}</h3>
                <p className="text-[10px] text-slate-500">{res.provider}</p>
              </div>
            </div>
            <ExternalLink size={16} className="text-slate-700 group-hover:text-blue-400" />
          </a>
        ))}
      </div>

      <div className="card bg-blue-500/5 border-dashed border-blue-500/30 p-4 text-center">
        <p className="text-xs text-blue-300 font-medium">Add new resources in src/data/resources.js</p>
      </div>
    </div>
  );
};

export default Resources;