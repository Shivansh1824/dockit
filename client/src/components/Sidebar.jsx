import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  X,
  Zap,
} from 'lucide-react';
import DockitLogo from './DockitLogo';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects',  icon: FolderKanban,    label: 'Projects' },
  { to: '/tasks',     icon: CheckSquare,     label: 'My Tasks' },
  { to: '/team',      icon: Users,           label: 'Team' },
  { to: '/settings',  icon: Settings,        label: 'Settings' },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-all duration-500"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-4 left-4 bottom-4 w-64 glass z-50 flex flex-col rounded-3xl overflow-hidden
          transform transition-all duration-500 ease-spring
          ${open ? 'translate-x-0 opacity-100 scale-100' : '-translate-x-[110%] opacity-0 scale-95'}
          md:translate-x-0 md:opacity-100 md:scale-100 md:static md:z-auto md:ml-4 md:my-4 md:h-[calc(100vh-2rem)]
        `}
      >
        {/* Logo Section */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-1 bg-brand-500 blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform">
                  <DockitLogo size={20} color="white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-lg tracking-tight leading-none">Dockit</span>
                <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mt-1">Workspace</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="md:hidden text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map(({ to, icon: Icon, label }, index) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-500 ease-spring animate-fade-in-up ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                    : 'text-gray-500 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm'
                }`
              }
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={`transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-brand-500'}`}
                  />
                  <span>{label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Upgrade Card / Footer */}
        <div className="p-4 mt-auto">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg relative overflow-hidden group">
            <Zap className="absolute -right-2 -bottom-2 w-16 h-16 text-white/10 group-hover:scale-125 transition-transform duration-700" />
            <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Go Pro</p>
            <p className="text-sm font-medium mb-3 relative z-10">Get advanced AI insights & unlimited tasks.</p>
            <button className="w-full py-2 bg-white text-brand-600 rounded-xl text-xs font-bold hover:bg-opacity-90 transition-colors shadow-sm">
              Upgrade Now
            </button>
          </div>
          <div className="mt-4 px-2 flex items-center justify-between">
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">v1.2.0-beta</p>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="System Online" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
