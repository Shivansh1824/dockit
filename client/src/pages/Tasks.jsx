import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  MoreVertical,
  ArrowRight,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const MOCK_TASKS = [
  { id: 1, title: 'Design onboarding flow', project: 'Dockit v1.0', status: 'done',        due: '2026-05-10', priority: 'High',    assignee: 'Sarah K.' },
  { id: 2, title: 'API performance audit',  project: 'Core Engine', status: 'in_progress', due: '2026-05-15', priority: 'Critical', assignee: 'Alex R.' },
  { id: 3, title: 'Client feedback sync',   project: 'Marketing',   status: 'todo',        due: '2026-05-18', priority: 'Medium',   assignee: 'John B.' },
  { id: 4, title: 'Security patch v2.1',    project: 'Infrastructure', status: 'overdue',     due: '2026-05-08', priority: 'Critical', assignee: 'Mike D.' },
  { id: 5, title: 'Mobile UI Kit update',   project: 'Dockit v1.0', status: 'in_progress', due: '2026-05-20', priority: 'High',    assignee: 'Sarah K.' },
  { id: 6, title: 'Database migration',     project: 'Core Engine', status: 'todo',        due: '2026-05-25', priority: 'Low',      assignee: 'Tom H.' },
];

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

const PriorityIndicator = ({ priority }) => {
  const colors = {
    Critical: 'bg-red-500',
    High:     'bg-orange-500',
    Medium:   'bg-blue-500',
    Low:      'bg-gray-300',
  };
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${colors[priority] || 'bg-gray-300'}`} />
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{priority}</span>
    </div>
  );
};

const Tasks = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState('list'); // list | kanban

  const displayedTasks = user?.role === 'admin' 
    ? MOCK_TASKS 
    : MOCK_TASKS.filter(t => t.assignee.startsWith(user?.name?.split(' ')[0]) || t.assignee === 'Sarah K.');

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-jakarta">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">Task Master</h1>
              <p className="text-gray-500 text-sm">Orchestrating {MOCK_TASKS.length} tasks across your workspace.</p>
            </div>
            {user?.role === 'admin' && (
              <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-2xl font-bold text-sm hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20 active:scale-95 self-start">
                <Plus size={18} />
                Add New Task
              </button>
            )}
          </div>

          {/* View Selection & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 p-1 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <button 
                onClick={() => setView('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'list' ? 'bg-brand-50 text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ListIcon size={16} />
                List
              </button>
              <button 
                onClick={() => setView('kanban')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'kanban' ? 'bg-brand-50 text-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid size={16} />
                Kanban
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search tasks..." 
                  className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-brand-500 transition-all w-64 shadow-sm"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-500 hover:text-gray-900 transition-all shadow-sm">
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>

          {/* Task Content */}
          {view === 'list' ? (
            <div className="glass rounded-[2rem] overflow-hidden shadow-layered">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Task Details</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Project</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assignee</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50">
                  {displayedTasks.map((task, index) => (
                    <tr 
                      key={task.id} 
                      className="group hover:bg-brand-50/5 transition-colors animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            <PriorityIndicator priority={task.priority} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 mb-1 group-hover:text-brand-500 transition-colors">{task.title}</p>
                            <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium">
                              <span className="flex items-center gap-1"><Calendar size={12} /> {task.due}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-200" />
                              <span>ID: TASK-{1000 + task.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-gray-600 px-3 py-1 bg-gray-100 rounded-full">{task.project}</span>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center text-[10px] font-bold text-brand-600 border border-brand-100">
                            {task.assignee.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-xs font-semibold text-gray-700">{task.assignee}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-all" title="View Details">
                            <ArrowRight size={16} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['todo', 'in_progress', 'done'].map((status) => (
                <div key={status} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${status === 'todo' ? 'bg-gray-400' : status === 'in_progress' ? 'bg-brand-500' : 'bg-green-500'}`} />
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                        {status.replace('_', ' ')}
                      </h3>
                      <span className="text-xs font-bold text-gray-400 ml-2 bg-gray-50 px-2 py-0.5 rounded-full">
                        {MOCK_TASKS.filter(t => t.status === status).length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {displayedTasks.filter(t => t.status === status || (status === 'todo' && t.status === 'overdue')).map((task) => (
                      <div key={task.id} className="glass p-5 rounded-3xl hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-layered group cursor-grab active:cursor-grabbing">
                        <div className="flex justify-between items-start mb-3">
                          <PriorityIndicator priority={task.priority} />
                          <button className="text-gray-300 hover:text-gray-500 transition-colors">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mb-4 group-hover:text-brand-500 transition-colors">{task.title}</h4>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center text-[8px] font-bold text-brand-600">
                              {task.assignee.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{task.due}</span>
                          </div>
                          <span className="text-[9px] font-bold text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded-lg">
                            {task.project.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {user?.role === 'admin' && (
                      <button className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 text-xs font-bold hover:border-brand-200 hover:bg-brand-50/5 hover:text-brand-500 transition-all">
                        + Add Task
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Tasks;
