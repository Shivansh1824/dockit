import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Mail, 
  Shield, 
  Clock, 
  MessageSquare, 
  MoreVertical,
  ExternalLink,
  ChevronRight,
  Filter,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const RoleBadge = ({ role }) => {
  const map = {
    Admin:   'text-brand-600 bg-brand-50 border-brand-100',
    Manager: 'text-blue-600 bg-blue-50 border-blue-100',
    Member:  'text-gray-600 bg-gray-50 border-gray-100',
  };
  return (
    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${map[role]}`}>
      {role}
    </span>
  );
};

const StatusDot = ({ status }) => {
  const map = {
    'Online':     'bg-green-500',
    'In Meeting': 'bg-red-500',
    'On Break':   'bg-orange-500',
    'Offline':    'bg-gray-300',
  };
  return <div className={`w-2 h-2 rounded-full ${map[status]}`} />;
};

const Team = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/auth/users');
        setTeam(data);
      } catch (err) {
        console.error('Failed to fetch team:', err);
        setError('Failed to load team members.');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const mapMember = (m) => ({
    id: m.id,
    name: m.name,
    role: m.role.charAt(0).toUpperCase() + m.role.slice(1),
    email: m.email,
    avatar: m.name.split(' ').map(n => n[0]).join(''),
    status: 'Online', // Simulated
    dept: 'Workspace'
  });

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-jakarta">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">Team Directory</h1>
              <p className="text-gray-500 text-sm">Managing {team.length} team members and their permissions.</p>
            </div>
            {user?.role === 'admin' && (
              <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-2xl font-bold text-sm hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20 active:scale-95 self-start">
                <Plus size={18} />
                Invite Member
              </button>
            )}
          </div>

          {error && (
            <div className="glass p-4 rounded-2xl bg-red-50 text-red-600 text-sm mb-8 flex items-center gap-3">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Quick Filters */}
          <div className="glass p-3 rounded-2xl mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search by name, role, or dept..." 
                  className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition-all"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass h-64 rounded-3xl" />
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {team.map((member, index) => {
                const m = mapMember(member);
                return (
                  <div 
                    key={m.id} 
                    className="glass p-6 rounded-3xl group hover:-translate-y-1.5 transition-all duration-500 ease-spring animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-lg font-bold text-brand-600 border border-brand-100 group-hover:scale-110 transition-transform duration-500">
                          {m.avatar}
                        </div>
                        <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-lg shadow-sm border border-gray-50">
                          <StatusDot status={m.status} />
                        </div>
                      </div>
                      <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{m.name}</h3>
                        <RoleBadge role={m.role} />
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{m.dept} Team</p>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Mail size={16} className="text-gray-400" />
                        <span className="truncate">{m.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Shield size={16} className="text-gray-400" />
                        <span>Access Level: {m.role}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Clock size={16} className="text-gray-400" />
                        <span>Last Active: 2h ago</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="flex-1 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-brand-500 hover:text-white transition-all duration-500 flex items-center justify-center gap-2 border border-transparent hover:border-brand-100">
                        <MessageSquare size={14} />
                        Message
                      </button>
                      <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-brand-500 hover:bg-brand-50 transition-all border border-transparent hover:border-brand-100">
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Invite Card */}
              {user?.role === 'admin' && (
                <div className="border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center group hover:border-brand-300 hover:bg-brand-50/10 transition-all duration-500">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 mb-4 group-hover:bg-brand-100 group-hover:text-brand-500 transition-all duration-500">
                    <Plus size={24} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Add Team Member</h4>
                  <p className="text-xs text-gray-500 mb-6 px-4">Expand your team and collaborate on high-impact projects.</p>
                  <button className="flex items-center gap-2 text-brand-500 text-sm font-bold hover:gap-3 transition-all">
                    Send Invitation
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Team;
