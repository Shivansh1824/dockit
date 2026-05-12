import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Loader2,
  LayoutDashboard,
  Users,
  CheckSquare,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import DockitLogo from '../components/DockitLogo';

const MOCK_MODE = import.meta.env.VITE_MOCK_AUTH === 'true';

// ── Brand left panel shared between Login & Signup ──
const BrandPanel = () => (
  <div
    className="hidden md:flex md:w-5/12 lg:w-2/5 flex-col justify-between p-10 xl:p-14 shrink-0 relative overflow-hidden"
    style={{ backgroundColor: '#003c43' }} // Darker base for atmosphere
  >
    {/* Decorative atmospheric blobs */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[50%] rounded-full opacity-30 blur-[80px]" style={{ background: 'radial-gradient(circle, #33afb4 0%, transparent 70%)' }} />
      <div className="absolute top-[60%] -right-[20%] w-[60%] h-[60%] rounded-full opacity-20 blur-[100px]" style={{ background: 'radial-gradient(circle, #01696f 0%, transparent 70%)' }} />
      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
    </div>
    
    <div className="relative z-10">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow">
          <DockitLogo size={20} color="#01696f" />
        </div>
        <span className="text-white text-2xl font-bold tracking-tight">Dockit</span>
      </div>

      {/* Headline */}
      <div className="mt-14">
        <h1 className="text-white text-4xl xl:text-[2.75rem] font-bold leading-tight">
          Manage teams.<br />Track tasks.<br />Ship faster.
        </h1>
        <p className="mt-5 text-white/70 text-base leading-relaxed">
          Everything your team needs to stay aligned and deliver on time — all in one place.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="mt-10 space-y-3.5">
        {[
          { icon: LayoutDashboard, text: 'Real-time project dashboards' },
          { icon: Users, text: 'Role-based team access control' },
          { icon: CheckSquare, text: 'Task tracking with priority & status' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            >
              <Icon size={16} className="text-white" />
            </div>
            <span className="text-white/80 text-sm">{text}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Quote */}
    <div className="border-t border-white/10 pt-6 relative z-10">
      <p className="text-white/70 text-sm font-medium leading-relaxed">
        "The best task management tool I've used for fast-moving engineering teams."
      </p>
      <p className="text-white/40 text-xs mt-2">— Engineering Lead, Series A Startup</p>
    </div>
  </div>
);

// ── Google mock button ──
const GoogleButton = () => (
  <button
    type="button"
    disabled
    title="Google sign-in coming soon"
    className="w-full py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-400 flex items-center justify-center gap-2.5 cursor-not-allowed select-none"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
    Continue with Google
    <span className="ml-1 text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide">
      Soon
    </span>
  </button>
);

// ── Input component ──
const FormInput = ({ id, label, error, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    {children}
    {error && (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <AlertCircle size={11} className="shrink-0" />
        {error}
      </p>
    )}
  </div>
);

const inputClass = (hasError) =>
  `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all duration-300 ease-spring ${
    hasError
      ? 'border-red-300 bg-red-50 focus:ring-4 focus:ring-red-500/10 focus:border-red-500'
      : 'border-border bg-surface focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-brand-300'
  }`;

// ═══════════════════════════════
//  LOGIN PAGE
// ═══════════════════════════════
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const successMsg = new URLSearchParams(location.search).get('msg') || '';

  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setServerError('');
    setLoading(true);

    try {
      if (MOCK_MODE) {
        await new Promise((r) => setTimeout(r, 900));
        const mockUser = { id: 'mock-1', name: 'Demo User', email: form.email, role: 'admin' };
        login(mockUser, 'mock_token_' + Date.now());
        navigate('/dashboard');
      } else {
        const { data } = await api.post('/auth/login', {
          email: form.email,
          password: form.password,
        });
        login(data.user, data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <BrandPanel />

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white min-h-screen">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#01696f' }}>
              <DockitLogo size={17} color="white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Dockit</span>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-1 text-sm">Sign in to your Dockit account</p>
          </div>

          {/* Success message from signup */}
          {successMsg && (
            <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-green-600 shrink-0" />
              <p className="text-green-700 text-sm">{decodeURIComponent(successMsg)}</p>
            </div>
          )}

          {/* Server error */}
          {serverError && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2.5">
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <p className="text-red-700 text-sm">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <FormInput id="email" label="Email address" error={errors.email}>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className={inputClass(!!errors.email)}
              />
            </FormInput>

            <FormInput id="password" label="Password" error={errors.password}>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`${inputClass(!!errors.password)} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormInput>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-[#01696f]"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm font-medium hover:underline" style={{ color: '#01696f' }}>
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-brand-500 text-white text-sm font-semibold transition-all duration-300 ease-spring flex items-center justify-center gap-2 hover:bg-brand-600 hover:-translate-y-0.5 hover:shadow-layered disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <GoogleButton />

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-semibold hover:underline" style={{ color: '#01696f' }}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
