import { Search, Command, Sparkles } from 'lucide-react';

const IntelligenceBar = () => {
  return (
    <div className="relative w-full max-w-2xl group animate-fade-in-up">
      <div className="absolute inset-0 bg-brand-500/5 blur-xl rounded-2xl group-hover:bg-brand-500/10 transition-colors duration-500" />
      <div className="relative flex items-center gap-3 px-4 py-2.5 bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-layered hover:shadow-layered-lg transition-all duration-300">
        <Search size={18} className="text-gray-400 group-focus-within:text-brand-500 transition-colors" />
        <input
          type="text"
          placeholder="Search projects, tasks, or ask AI..."
          className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-800 placeholder:text-gray-400"
        />
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg">
          <Command size={12} className="text-gray-400" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">K</span>
        </div>
        <div className="h-4 w-px bg-gray-200 mx-1" />
        <button className="flex items-center gap-1.5 text-brand-500 hover:text-brand-600 transition-colors">
          <Sparkles size={16} />
          <span className="text-xs font-semibold">Ask AI</span>
        </button>
      </div>
    </div>
  );
};

export default IntelligenceBar;
