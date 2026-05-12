import { useState, useEffect } from 'react';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  FolderKanban,
  Sparkles,
  ArrowRight,
  Plus,
  TrendingUp,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import KPICard from '../components/KPICard';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

// ── Status badge ──
const StatusBadge = ({ status }) => {
  const map = {
    todo:        { label: 'To Do',       cls: 'bg-gray-100 text-gray-500 border-gray-200' },
    in_progress: { label: 'In Progress', cls: 'bg-brand-50 text-brand-600 border-brand-100' },
    done:        { label: 'Done',        cls: 'bg-green-50 text-green-700 border-green-100' },
    overdue:     { label: 'Overdue',     cls: 'bg-red-50 text-red-600 border-red-100' },
  };
  const { label, cls } = map[status] || map.todo;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${cls}`}>
      {label}
    </span>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, tasksRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/tasks')
        ]);
        setStats(statsRes.data);
        setTasks(tasksRes.data.slice(0, 5)); // Only show top 5
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';

  const KPI_ICONS = {
    'Active Projects': FolderKanban,
    'Tasks Completed': CheckCircle2,
    'Team Efficiency': TrendingUp,
    'Avg. Response': Clock
  };

  const KPI_COLORS = {
    'Active Projects': 'bg-brand-50 text-brand-500',
    'Tasks Completed': 'bg-green-50 text-green-600',
    'Team Efficiency': 'bg-blue-50 text-blue-500',
    'Avg. Response': 'bg-orange-50 text-orange-500'
  };

  return (
    <div className="flex h-screen bg-[#fcfcfd] overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin">
          
          {/* Morning Brief Section */}
          <section className="mb-10 animate-fade-in-up">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 rounded-md bg-brand-100 text-brand-700 text-[10px] font-bold uppercase tracking-widest">Workspace</span>
                  <div className="h-1 w-1 rounded-full bg-gray-300" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">
                  Good morning, <span className="text-brand-500">{firstName}</span>.
                </h1>
                <p className="text-gray-500 text-lg font-medium max-w-xl leading-relaxed">
                  {loading ? 'Analyzing your workspace performance...' : (
                    <>You have <span className="text-gray-900 font-semibold">{tasks.filter(t => t.status === 'overdue').length} overdue tasks</span> that need your attention today.</>
                  )}
                </p>
              </div>

              {/* Quick AI Insight Card */}
              <div className="glass p-4 rounded-2xl max-w-sm flex items-start gap-4 border-brand-100/50 bg-brand-50/30">
                <div className="p-2 rounded-xl bg-white shadow-sm text-brand-500 shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-1">AI Insight</h4>
                  <p className="text-[13px] text-gray-600 leading-snug">
                    Based on your speed, you'll finish <span className="font-semibold text-gray-900">Dockit v1.0</span> by Friday.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* Left Column: Stats & Actions */}
            <div className="col-span-12 xl:col-span-8 space-y-8">
              
              {/* KPI Grid */}
              <section aria-label="Key performance indicators">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {loading ? (
                    [1, 2, 3, 4].map(i => <div key={i} className="glass h-32 rounded-[2rem] animate-pulse" />)
                  ) : (
                    stats?.kpis.map((kpi, index) => (
                      <KPICard 
                        key={kpi.label} 
                        label={kpi.label}
                        value={kpi.value}
                        icon={KPI_ICONS[kpi.label] || ClipboardList}
                        bgColor={KPI_COLORS[kpi.label]?.split(' ')[0] || 'bg-brand-50'}
                        iconColor={KPI_COLORS[kpi.label]?.split(' ')[1] || 'text-brand-500'}
                        delayIndex={index} 
                      />
                    ))
                  )}
                </div>
              </section>

              {/* Task Section */}
              <section aria-label="Recent tasks">
                <div className="glass rounded-[32px] overflow-hidden border-gray-200/50 shadow-soft">
                  <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 tracking-tight">Active Tasks</h2>
                      <p className="text-xs text-gray-400 font-medium mt-0.5 uppercase tracking-widest">Primary Focus Area</p>
                    </div>
                    {user?.role === 'admin' && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-900/10">
                        <Plus size={14} />
                        New Task
                      </button>
                    )}
                  </div>

                  <div className="p-2">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <th className="px-6 py-4">Task Name</th>
                            <th className="px-6 py-4 hidden sm:table-cell">Project</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 hidden md:table-cell">Due</th>
                            <th className="px-6 py-4"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {loading ? (
                            [1, 2, 3].map(i => (
                              <tr key={i} className="animate-pulse">
                                <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-gray-100 rounded w-full" /></td>
                              </tr>
                            ))
                          ) : (
                            tasks.map((task, index) => (
                              <tr
                                key={task.id}
                                className="group hover:bg-gray-50/50 transition-all duration-300 animate-fade-in-up"
                                style={{ animationDelay: `${(index + 4) * 50}ms` }}
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${
                                      task.priority?.toLowerCase() === 'critical' ? 'bg-red-500' :
                                      task.priority?.toLowerCase() === 'high' ? 'bg-orange-500' :
                                      task.priority?.toLowerCase() === 'medium' ? 'bg-blue-500' : 'bg-gray-300'
                                    }`} />
                                    <span className="font-semibold text-gray-800 tracking-tight capitalize">{task.title}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 hidden sm:table-cell text-gray-500">
                                  <div className="flex items-center gap-1.5">
                                    <FolderKanban size={13} className="text-gray-300" />
                                    {task.project_name || 'No Project'}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <StatusBadge status={task.status} />
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell tabular-numbers text-gray-500">
                                  {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Due Date'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button className="p-2 text-gray-300 hover:text-brand-500 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                    <ArrowRight size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center">
                    <button className="text-xs font-bold text-gray-400 hover:text-brand-500 transition-colors uppercase tracking-widest">
                      View all tasks
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Widgets & Activity */}
            <div className="col-span-12 xl:col-span-4 space-y-6">
              
              {/* Calendar Mini-Widget */}
              <section className="glass p-6 rounded-[32px] border-gray-200/50 shadow-soft animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-gray-900 tracking-tight">Today's Schedule</h3>
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <div className="space-y-4">
                  {[
                    { time: '09:00 AM', event: 'Daily Standup', type: 'Meeting' },
                    { time: '11:30 AM', event: 'Design Review', type: 'Work' },
                    { time: '03:00 PM', event: 'Sprint Planning', type: 'Planning' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/50 transition-colors cursor-pointer group">
                      <span className="text-[10px] font-bold text-brand-500 bg-brand-50 px-2 py-1 rounded-lg uppercase tracking-wider">{item.time}</span>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 group-hover:text-brand-600 transition-colors">{item.event}</h4>
                        <p className="text-[11px] text-gray-400 font-medium">{item.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 border border-gray-100 rounded-2xl text-xs font-bold text-gray-500 hover:bg-white hover:text-brand-500 transition-all shadow-sm">
                  View Calendar
                </button>
              </section>

              {/* Productivity Widget */}
              <section className="bg-gray-900 p-6 rounded-[32px] text-white shadow-xl relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <TrendingUp size={80} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-6">Focus Score</h3>
                <div className="flex items-end gap-4 mb-4">
                  <span className="text-5xl font-bold tracking-tight">84</span>
                  <span className="text-green-400 font-bold mb-2 flex items-center gap-1 text-sm">
                    <TrendingUp size={14} />
                    +12%
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  You're in the <span className="text-white font-semibold">top 5%</span> of productive managers this week. Keep the momentum!
                </p>
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-gray-900 bg-gray-700 flex items-center justify-center text-[8px] font-bold">
                        U{i}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Team Performance</span>
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
