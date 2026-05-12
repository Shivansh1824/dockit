import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';

const PROJECTS_DATA = [
  { 
    id: 1, 
    name: 'Dockit v1.0 Launch', 
    category: 'Product Design', 
    progress: 75, 
    status: 'On Track', 
    team: ['Alex R.', 'Sarah K.'], 
    dueDate: 'May 24, 2026', 
    color: 'text-brand-500' 
  },
  { 
    id: 2, 
    name: 'AI Integration Phase 2', 
    category: 'Engineering', 
    progress: 45, 
    status: 'At Risk', 
    team: ['Mike D.', 'Lisa W.'], 
    dueDate: 'June 12, 2026', 
    color: 'text-orange-500' 
  },
  { 
    id: 3, 
    name: 'Brand Refresh 2026', 
    category: 'Marketing', 
    progress: 92, 
    status: 'Completed', 
    team: ['Emma S.', 'John B.'], 
    dueDate: 'Completed', 
    color: 'text-blue-500' 
  },
  { 
    id: 4, 
    name: 'Mobile App Refactor', 
    category: 'Engineering', 
    progress: 15, 
    status: 'Delayed', 
    team: ['Tom H.', 'Chris P.'], 
    dueDate: 'July 04, 2026', 
    color: 'text-red-500' 
  },
  { 
    id: 5, 
    name: 'Customer Success Portal', 
    category: 'Operations', 
    progress: 60, 
    status: 'On Track', 
    team: ['Rachel G.', 'David M.'], 
    dueDate: 'May 30, 2026', 
    color: 'text-brand-500' 
  },
  { 
    id: 6, 
    name: 'Global Expansion Research', 
    category: 'Strategy', 
    progress: 30, 
    status: 'On Track', 
    team: ['Kevin L.', 'Monica B.'], 
    dueDate: 'Aug 15, 2026', 
    color: 'text-brand-500' 
  },
];

const Projects = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState('grid'); // grid | list

  // Filter projects based on role
  const displayedProjects = user?.role === 'admin' 
    ? PROJECTS_DATA 
    : PROJECTS_DATA.filter(p => p.team.some(name => name.startsWith(user?.name?.split(' ')[0]) || name === 'Sarah K.')); // Simulating assignment for demo

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-jakarta">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">Projects</h1>
              <p className="text-gray-500 text-sm">Managing {PROJECTS_DATA.length} active initiatives in your workspace.</p>
            </div>
            {user?.role === 'admin' && (
              <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-2xl font-bold text-sm hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20 active:scale-95 self-start">
                <Plus size={18} />
                Create Project
              </button>
            )}
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Projects', value: '12', icon: Layers, color: 'text-gray-400' },
              { label: 'Completed', value: '8', icon: CheckCircle2, color: 'text-green-500' },
              { label: 'On Track', value: '3', icon: Clock, color: 'text-brand-500' },
              { label: 'Requires Attention', value: '1', icon: AlertCircle, color: 'text-red-500' },
            ].map((stat, i) => (
              <div key={i} className="glass p-4 rounded-2xl flex items-center gap-4">
                <div className={`p-2.5 rounded-xl bg-white shadow-sm ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900 leading-none">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Controls Bar */}
          <div className="glass p-3 rounded-2xl mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter projects..." 
                  className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition-all"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                <Filter size={16} />
                Filters
              </button>
            </div>

            <div className="flex items-center gap-2 p-1 bg-gray-50/50 rounded-xl border border-gray-100">
              <button 
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white text-brand-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white text-brand-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayedProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} delayIndex={index} />
            ))}
            
            {/* Template Card */}
            {user?.role === 'admin' && (
              <div className="border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center group hover:border-brand-300 hover:bg-brand-50/10 transition-all duration-500">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4 group-hover:bg-brand-100 group-hover:text-brand-500 transition-all duration-500">
                  <Plus size={24} />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">Create New Initiative</h4>
                <p className="text-xs text-gray-500 mb-6 px-4">Start from a template or a blank project and invite your team.</p>
                <button className="flex items-center gap-2 text-brand-500 text-sm font-bold hover:gap-3 transition-all">
                  Browse Templates
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Projects;
