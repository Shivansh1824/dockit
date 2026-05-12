import { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Cloud, 
  Key, 
  CreditCard,
  ChevronRight,
  Zap,
  Camera,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Profile');

  const tabs = [
    { name: 'Profile', icon: User },
    { name: 'Security', icon: Shield },
    { name: 'Notifications', icon: Bell },
    { name: 'Workspace', icon: Globe },
    { name: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-jakarta">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">System Settings</h1>
            <p className="text-gray-500 text-sm">Configure your personal preferences and workspace parameters.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Tabs */}
            <div className="lg:w-64 shrink-0">
              <div className="glass p-2 rounded-3xl space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                      activeTab === tab.name 
                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                        : 'text-gray-500 hover:bg-white/60 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 max-w-3xl">
              <div className="glass rounded-[2.5rem] p-8 md:p-10 animate-fade-in-up">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{activeTab} Settings</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage your {activeTab.toLowerCase()} details and preferences.</p>
                  </div>
                  <button className="px-6 py-2.5 bg-brand-500 text-white rounded-2xl font-bold text-sm hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20 active:scale-95">
                    Save Changes
                  </button>
                </div>

                {activeTab === 'Profile' && (
                  <div className="space-y-8">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6 p-6 bg-gray-50/50 rounded-3xl border border-gray-100/50">
                      <div className="relative group">
                        <div className="w-20 h-20 rounded-3xl bg-brand-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden">
                          {user?.name?.[0] || 'U'}
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-md border border-gray-100 text-gray-500 hover:text-brand-500 transition-colors">
                          <Camera size={16} />
                        </button>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Profile Photo</h4>
                        <p className="text-xs text-gray-500 mb-3">PNG, JPG or GIF. Max size 2MB.</p>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-all">Update</button>
                          <button className="px-3 py-1.5 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all">Remove</button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          type="text" 
                          defaultValue={user?.name || 'Jane Smith'}
                          className="w-full px-5 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-brand-500 transition-all shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                          type="email" 
                          defaultValue={user?.email || 'jane@example.com'}
                          className="w-full px-5 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-brand-500 transition-all shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Job Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Senior Designer"
                          className="w-full px-5 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-brand-500 transition-all shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Timezone</label>
                        <select className="w-full px-5 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-brand-500 transition-all shadow-sm appearance-none">
                          <option>(GMT+05:30) Mumbai, New Delhi</option>
                          <option>(GMT-08:00) Pacific Time</option>
                          <option>(GMT+00:00) UTC</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab !== 'Profile' && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-500 mb-6">
                      <Zap size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{activeTab} Coming Soon</h3>
                    <p className="text-sm text-gray-500 max-w-xs">We're building advanced controls for your {activeTab.toLowerCase()}. Stay tuned for the update.</p>
                  </div>
                )}
              </div>

              {/* Pro Feature Teaser */}
              <div className="mt-8 p-6 rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Cloud size={120} />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                    <Key size={12} />
                    Premium Feature
                  </div>
                  <h3 className="text-xl font-bold mb-2">Automated Workspace Backups</h3>
                  <p className="text-sm text-white/60 mb-6 max-w-sm">Ensure your data is never lost with real-time cloud sync and automated snapshots.</p>
                  <button className="flex items-center gap-2 text-sm font-bold text-brand-400 hover:text-brand-300 transition-colors">
                    Learn more about Pro
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
