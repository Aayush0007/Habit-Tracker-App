import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, CheckSquare, BarChart2, 
  Trophy, Calendar, ClipboardCheck, ListChecks, Settings 
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: LayoutDashboard },
    { path: '/sessions', label: 'Study', icon: BookOpen },
    { path: '/tracker', label: 'Habits', icon: CheckSquare },
    { path: '/syllabus', label: 'Syllabus', icon: ListChecks },
    { path: '/calendar', label: 'Map', icon: Calendar },
    { path: '/mocks', label: 'Mocks', icon: Trophy },
    { path: '/review', label: 'Review', icon: ClipboardCheck },
    { path: '/analytics', label: 'Stats', icon: BarChart2 },
    { path: '/settings', label: 'Setup', icon: Settings },
  ];

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      {/* Added flex-col and overflow-hidden to main nav to contain the scrollable div */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-20 lg:w-64 bg-slate-950 border-r border-slate-800 flex-col z-50 transition-all duration-300 overflow-hidden">
        
        {/* Fixed Header (Doesn't scroll) */}
        <div className="px-6 py-8 hidden lg:block flex-shrink-0">
          <h1 className="text-xl font-black italic text-emerald-500 tracking-tighter uppercase">
            Warrior<span className="text-white">Mode</span>
          </h1>
        </div>

        {/* Scrollable Container */}
        {/* overflow-y-auto + custom scrollbar hidden class */}
        <div className="flex-1 flex flex-col gap-2 px-3 pb-8 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`group flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 flex-shrink-0 ${
                  isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="relative">
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
                  )}
                </div>
                <span className={`text-[10px] lg:text-xs font-black uppercase tracking-widest hidden lg:block`}>
                  {item.label}
                </span>
                
                <div className="absolute left-20 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none lg:hidden border border-slate-700 font-bold whitespace-nowrap z-50">
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* --- MOBILE BOTTOM BAR --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/50 pb-safe z-50">
        <div className="flex justify-start items-center w-full overflow-x-auto no-scrollbar px-4 py-3 gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex flex-col items-center min-w-[64px] py-2 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-500 active:scale-90'
                }`}
              >
                <div className="relative transition-transform duration-300">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
                  )}
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest mt-1 transition-all ${
                  isActive ? 'opacity-100' : 'opacity-40'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* CSS Utilities and Layout Adjustments */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }

        body { 
          padding-bottom: 5rem; 
        }
        @media (min-width: 768px) {
          body { 
            padding-bottom: 0; 
            padding-left: 5rem; 
          }
        }
        @media (min-width: 1024px) {
          body { 
            padding-left: 16rem; 
          }
        }
      `}} />
    </>
  );
};

export default Navbar;