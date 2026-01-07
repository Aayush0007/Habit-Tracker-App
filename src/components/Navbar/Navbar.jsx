import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  BarChart2, 
  Trophy, 
  Calendar,
  ClipboardCheck,
  ListChecks, // Better icon for Syllabus
  Settings as SettingsIcon 
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: <LayoutDashboard size={18} /> },
    { path: '/sessions', label: 'Study', icon: <BookOpen size={18} /> },
    { path: '/tracker', label: 'Habits', icon: <CheckSquare size={18} /> },
    { path: '/syllabus', label: 'Syllabus', icon: <ListChecks size={18} /> }, // Fixed label and icon
    { path: '/calendar', label: 'Map', icon: <Calendar size={18} /> },
    { path: '/mocks', label: 'Mocks', icon: <Trophy size={18} /> },
    { path: '/review', label: 'Review', icon: <ClipboardCheck size={18} /> },
    { path: '/analytics', label: 'Stats', icon: <BarChart2 size={18} /> },
    { path: '/settings', label: 'Setup', icon: <SettingsIcon size={18} /> }, // Fixed icon usage
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-safe z-50">
      {/* Scrollable container for many items on mobile */}
      <div className="flex justify-start sm:justify-around items-center w-full overflow-x-auto no-scrollbar px-2 py-3 gap-4 sm:gap-0">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center min-w-[55px] gap-1 transition-all duration-300 relative ${
                isActive ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
              )}
              
              <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                {item.icon}
              </div>
              
              <span className={`text-[7.5px] font-black uppercase tracking-tighter transition-opacity ${
                isActive ? 'opacity-100' : 'opacity-60'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;