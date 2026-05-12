import { MoreVertical, Users, Calendar, ArrowRight } from 'lucide-react';

const ProjectCard = ({ project, delayIndex = 0 }) => {
  const { name, category, progress, status, team, dueDate, color } = project;

  // Status style mapping
  const statusConfig = {
    'On Track': 'bg-green-500',
    'At Risk': 'bg-orange-500',
    'Delayed': 'bg-red-500',
    'Completed': 'bg-blue-500',
  };

  return (
    <div 
      className="glass rounded-3xl p-6 group hover:-translate-y-1.5 transition-all duration-500 ease-spring animate-fade-in-up"
      style={{ animationDelay: `${delayIndex * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${statusConfig[status] || 'bg-gray-400'} animate-pulse`} />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{category}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-500 transition-colors">{name}</h3>
        </div>
        <button className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Progress Visualization */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="5"
              fill="transparent"
              className="text-gray-100"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={176}
              strokeDashoffset={176 - (176 * progress) / 100}
              className={`${color} transition-all duration-1000 ease-out delay-300`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold tabular-numbers">{progress}%</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            <span>Overall Progress</span>
            <span>{status}</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${color} transition-all duration-1000 ease-out delay-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-100/50">
        <div className="flex items-center -space-x-2">
          {team.map((member, i) => (
            <div 
              key={i} 
              className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 shadow-sm"
              title={member}
            >
              {member.split(' ').map(n => n[0]).join('')}
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-brand-50 flex items-center justify-center text-[10px] font-bold text-brand-600 shadow-sm">
            +3
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <Calendar size={14} />
          <span className="text-xs font-medium">{dueDate}</span>
        </div>
      </div>

      <button className="w-full mt-6 py-3 rounded-2xl bg-gray-50 text-gray-600 text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-layered">
        View Project Details
        <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default ProjectCard;
