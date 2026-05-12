const KPICard = ({ label, value, icon: Icon, iconColor = 'text-brand-500', bgColor = 'bg-brand-50', warning = false }) => (
  <div className={`bg-white rounded-xl border p-5 flex items-start gap-4 shadow-sm transition-shadow hover:shadow-md ${warning ? 'border-red-200' : 'border-gray-100'}`}>
    <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${warning ? 'bg-red-50' : bgColor}`}>
      <Icon size={20} className={warning ? 'text-red-500' : iconColor} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-0.5 ${warning ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
    </div>
  </div>
);

export default KPICard;
