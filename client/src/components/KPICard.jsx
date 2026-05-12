import { TrendingUp, TrendingDown } from 'lucide-react';

const KPICard = ({ label, value, icon: Icon, bgColor, iconColor, warning, delayIndex = 0 }) => {
  return (
    <div
      className="glass p-5 rounded-3xl group hover:-translate-y-1 transition-all duration-500 ease-spring animate-fade-in-up"
      style={{ animationDelay: `${delayIndex * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${bgColor} ${iconColor} group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={22} />
        </div>
        <div className="flex flex-col items-end">
          <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${warning ? 'text-red-500' : 'text-green-500'}`}>
            {warning ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
            <span>{warning ? '-12%' : '+8.4%'}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900 tabular-numbers tracking-tight">
            {value}
          </span>
          <span className="text-xs font-medium text-gray-400">vs last month</span>
        </div>
      </div>

      {/* Decorative progress bar */}
      <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out delay-500 ${warning ? 'bg-red-500' : 'bg-brand-500'}`}
          style={{ width: warning ? '40%' : '75%' }}
        />
      </div>
    </div>
  );
};

export default KPICard;
