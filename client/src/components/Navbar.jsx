import { Menu, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DockitLogo from './DockitLogo';

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
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 z-10 transition-colors">
      {/* Left: menu + logo (mobile only shows logo) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-surface-elevated transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        {/* Desktop: just a breadcrumb area, mobile: brand */}
        <div className="flex items-center gap-2 md:hidden">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ backgroundColor: '#01696f' }}
          >
            <DockitLogo size={16} color="white" />
          </div>
          <span className="font-bold text-gray-900">Dockit</span>
        </div>
      </div>

      {/* Right: user info + logout */}
      <div className="flex items-center gap-3">
        {/* Role badge */}
        {user?.role && (
          <span className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            user.role === 'admin'
              ? 'bg-brand-50 text-brand-500'
              : 'bg-surface-elevated text-gray-600'
          }`}>
            {user.role === 'admin' ? 'Admin' : 'Member'}
          </span>
        )}

        {/* Avatar + name */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: '#01696f' }}
          >
            {initials}
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
            {user?.name || 'User'}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 ease-spring border border-border hover:border-red-200 hover:-translate-y-px"
          aria-label="Logout"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
