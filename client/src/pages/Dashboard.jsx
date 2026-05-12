import { useState } from 'react';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  FolderKanban,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import KPICard from '../components/KPICard';
import { useAuth } from '../context/AuthContext';

// ── Status badge ──
const StatusBadge = ({ status }) => {
  const map = {
    todo:        { label: 'To Do',       cls: 'bg-gray-100 text-gray-600' },
    in_progress: { label: 'In Progress', cls: 'bg-blue-50 text-blue-600' },
    done:        { label: 'Done',        cls: 'bg-green-50 text-green-700' },
    overdue:     { label: 'Overdue',     cls: 'bg-red-50 text-red-600' },
  };
  const { label, cls } = map[status] || map.todo;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
};

// ── Mock task data ──
const MOCK_TASKS = [
  { id: 1, title: 'Design onboarding flow',   project: 'Dockit v1.0',  status: 'done',        due: '2026-05-10' },
  { id: 2, title: 'Set up CI/CD pipeline',    project: 'Infrastructure', status: 'in_progress', due: '2026-05-14' },
  { id: 3, title: 'Write API documentation',  project: 'Dockit v1.0',  status: 'todo',        due: '2026-05-18' },
  { id: 4, title: 'Fix login redirect bug',   project: 'Bug Fixes',    status: 'overdue',     due: '2026-05-08' },
  { id: 5, title: 'User acceptance testing',  project: 'QA Sprint',    status: 'in_progress', due: '2026-05-15' },
];

const KPI_DATA = [
  { label: 'Total Tasks',  value: 24, icon: ClipboardList, bgColor: 'bg-brand-50',  iconColor: 'text-brand-500' },
  { label: 'In Progress',  value: 8,  icon: Clock,         bgColor: 'bg-blue-50',   iconColor: 'text-blue-500' },
  { label: 'Completed',    value: 12, icon: CheckCircle2,  bgColor: 'bg-green-50',  iconColor: 'text-green-600' },
  { label: 'Overdue',      value: 4,  icon: AlertTriangle, bgColor: 'bg-red-50',    iconColor: 'text-red-500', warning: true },
];

// ═══════════════════════════════
//  DASHBOARD PAGE
// ═══════════════════════════════
const Dashboard = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin">

          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-0.5 text-sm">
              Welcome back, <span className="font-semibold text-gray-700">{firstName}</span> 👋
            </p>
          </div>

          {/* KPI Cards */}
          <section aria-label="Key performance indicators">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {KPI_DATA.map((kpi, index) => (
                <KPICard key={kpi.label} {...kpi} delayIndex={index} />
              ))}
            </div>
          </section>

          {/* Recent Tasks table */}
          <section aria-label="Recent tasks">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Table header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ClipboardList size={18} className="text-gray-400" />
                  <h2 className="text-sm font-semibold text-gray-900">Recent Tasks</h2>
                </div>
                <span className="text-xs text-gray-400">{MOCK_TASKS.length} tasks</span>
              </div>

              {/* Desktop table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Task</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Project</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {MOCK_TASKS.map((task, index) => (
                      <tr
                        key={task.id}
                        className="hover:bg-gray-50/60 transition-colors animate-fade-in-up opacity-0"
                        style={{ animationDelay: `${(index + 4) * 75}ms` }}
                      >
                        <td className="px-5 py-3.5 font-medium text-gray-800 max-w-[200px] truncate">
                          {task.title}
                        </td>
                        <td className="px-5 py-3.5 hidden sm:table-cell">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <FolderKanban size={13} className="text-gray-400 shrink-0" />
                            <span className="truncate max-w-[140px]">{task.project}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={task.status} />
                        </td>
                        <td className="px-5 py-3.5 hidden md:table-cell tabular-numbers">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Calendar size={13} className="text-gray-400 shrink-0" />
                            {new Date(task.due).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
