const KPICard = ({ label, value, icon: Icon, iconColor = 'text-brand-500', bgColor = 'bg-brand-50', warning = false, delayIndex = 0 }) => (
  <div 
    className={`bg-surface rounded-xl border p-5 flex items-start gap-4 shadow-sm transition-all duration-300 ease-spring hover:-translate-y-1 hover:shadow-layered animate-fade-in-up ${
      warning ? 'border-red-200 hover:border-red-300' : 'border-border hover:border-brand-200'
    }`}
    style={{ animationDelay: `${delayIndex * 75}ms` }}
  >
    <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${warning ? 'bg-red-50' : bgColor}`}>
      <Icon size={20} className={warning ? 'text-red-500' : iconColor} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-0.5 tabular-numbers ${warning ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
    </div>
  </div>
);

export default KPICard;
