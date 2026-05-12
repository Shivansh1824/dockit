import { Menu, LogOut, Bell, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DockitLogo from './DockitLogo';
import IntelligenceBar from './IntelligenceBar';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-4 md:px-8 shrink-0 z-40 transition-all duration-300">
      {/* Left: Mobile Menu Trigger + Breadcrumb (Desktop) */}
      <div className="flex items-center gap-6">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2.5 rounded-xl text-gray-500 hover:bg-white/60 hover:text-brand-500 transition-all border border-transparent hover:border-gray-200 shadow-sm"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm font-medium text-gray-400">Pages</span>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-gray-900">Dashboard</span>
        </div>

        {/* Mobile: Logo (since sidebar is hidden) */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <DockitLogo size={16} color="white" />
          </div>
          <span className="font-bold text-gray-900">Dockit</span>
        </div>
      </div>

      {/* Center: Intelligence Bar (Desktop Only) */}
      <div className="hidden lg:flex flex-1 justify-center px-12">
        <IntelligenceBar />
      </div>

      {/* Right: Actions + Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Quick Actions */}
        <div className="hidden sm:flex items-center gap-1 bg-white/60 backdrop-blur-md border border-gray-200/50 p-1 rounded-2xl shadow-sm">
          <button className="p-2 text-gray-400 hover:text-brand-500 hover:bg-white rounded-xl transition-all" title="Notifications">
            <Bell size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-brand-500 hover:bg-white rounded-xl transition-all" title="Settings">
            <Settings size={18} />
          </button>
        </div>

        <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" />

        {/* User Profile Dropdown / Area */}
        <div className="flex items-center gap-3 pl-1">
          <div className="hidden md:flex flex-col items-end mr-1">
            <span className="text-sm font-bold text-gray-900 leading-none">{user?.name || 'User'}</span>
            <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mt-1">{user?.role || 'Member'}</span>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-brand-500 to-blue-500 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-500" />
            <div className="relative w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center bg-brand-500 text-white text-xs font-bold cursor-pointer group-hover:scale-105 transition-transform duration-300">
              {initials}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
