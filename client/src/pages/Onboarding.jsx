import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ChevronDown, Sparkles, BadgeCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import DockitLogo from '../components/DockitLogo';

const inputClass = (hasError) =>
  `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all duration-300 ease-spring ${
    hasError
      ? 'border-red-300 bg-red-50 focus:ring-4 focus:ring-red-500/10 focus:border-red-500'
      : 'border-border bg-surface focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 hover:border-brand-300'
  }`;

// ── Steps indicator ──
const Step = ({ number, label, active, done }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
        done
          ? 'bg-brand-500 text-white'
          : active
          ? 'bg-brand-500 text-white ring-4 ring-brand-500/20'
          : 'bg-gray-100 text-gray-400'
      }`}
    >
      {done ? <BadgeCheck size={14} /> : number}
    </div>
    <span className={`text-sm font-medium ${active ? 'text-gray-800' : 'text-gray-400'}`}>
      {label}
    </span>
  </div>
);

// ─────────────────────────────────────────
//  ONBOARDING PAGE
// ─────────────────────────────────────────
const Onboarding = () => {
  const navigate = useNavigate();
  const { pendingGoogleProfile, login, setPendingGoogleProfile } = useAuth();

  const [form, setForm] = useState({ jobId: '', role: 'member' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // If someone navigates here without a Google session, redirect them
  useEffect(() => {
    if (!pendingGoogleProfile) {
      navigate('/login', { replace: true });
    }
  }, [pendingGoogleProfile, navigate]);

  if (!pendingGoogleProfile) return null;

  const { email, name, avatar } = pendingGoogleProfile;

  const validate = () => {
    const e = {};
    if (!form.jobId.trim()) e.jobId = 'Job ID is required';
    else if (form.jobId.trim().length < 3) e.jobId = 'Job ID must be at least 3 characters';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
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
      const { data } = await api.post('/auth/google-complete', {
        accessToken: pendingGoogleProfile.accessToken,
        jobId: form.jobId.trim(),
        role: form.role,
      });
      login(data.user, data.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Could not complete setup. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">

      {/* ── Left atmospheric panel ── */}
      <div
        className="hidden md:flex md:w-5/12 lg:w-2/5 flex-col justify-between p-10 xl:p-14 shrink-0 relative overflow-hidden"
        style={{ backgroundColor: '#003c43' }}
      >
        {/* Atmospheric blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[50%] rounded-full opacity-30 blur-[80px]"
            style={{ background: 'radial-gradient(circle, #33afb4 0%, transparent 70%)' }} />
          <div className="absolute top-[60%] -right-[20%] w-[60%] h-[60%] rounded-full opacity-20 blur-[100px]"
            style={{ background: 'radial-gradient(circle, #01696f 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow">
              <DockitLogo size={20} color="#01696f" />
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">Dockit</span>
          </div>

          {/* Welcome message */}
          <div className="mt-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 mb-5">
              <Sparkles size={13} className="text-teal-300" />
              <span className="text-white/80 text-xs font-medium">Almost there!</span>
            </div>
            <h1 className="text-white text-4xl xl:text-[2.6rem] font-bold leading-tight">
              Let's set up<br />your Dockit<br />profile.
            </h1>
            <p className="mt-5 text-white/70 text-base leading-relaxed">
              Just two quick details and you'll be collaborating with your team in seconds.
            </p>
          </div>

          {/* Progress steps */}
          <div className="mt-10 space-y-4">
            <Step number={1} label="Sign in with Google" done />
            <Step number={2} label="Complete your profile" active />
            <Step number={3} label="Access your dashboard" active={false} />
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 relative z-10">
          <p className="text-white/70 text-sm font-medium leading-relaxed">
            "Onboarding took less than a minute. We were assigning tasks the same day."
          </p>
          <p className="text-white/40 text-xs mt-2">— Team Lead, Fintech Startup</p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white min-h-screen">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#01696f' }}>
              <DockitLogo size={17} color="white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Dockit</span>
          </div>

          {/* Google profile preview card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 mb-8">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-500/20"
              />
            ) : (
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
                style={{ backgroundColor: '#01696f' }}>
                {name ? name[0].toUpperCase() : '?'}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{name || 'New User'}</p>
              <p className="text-sm text-gray-500 truncate">{email}</p>
            </div>
            <div className="ml-auto shrink-0">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                <BadgeCheck size={12} />
                Google
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900">Complete your profile</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Just fill in these two details to finish setting up your account.
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2.5">
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <p className="text-red-700 text-sm">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Email — read-only, pre-filled */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-gray-50 text-sm text-gray-500 cursor-not-allowed outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Pulled from your Google account</p>
            </div>

            {/* Job ID */}
            <div>
              <label htmlFor="jobId" className="block text-sm font-medium text-gray-700 mb-1.5">
                Job ID / Employee ID
              </label>
              <input
                id="jobId"
                type="text"
                name="jobId"
                value={form.jobId}
                onChange={handleChange}
                placeholder="e.g. EMP-1042"
                className={inputClass(!!errors.jobId)}
                autoFocus
              />
              {errors.jobId && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={11} className="shrink-0" /> {errors.jobId}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                A unique identifier that your team or admin uses to find you.
              </p>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={`${inputClass(false)} appearance-none pr-9 cursor-pointer`}
                >
                  <option value="member">Member — I work on tasks and projects</option>
                  <option value="admin">Admin — I manage the team and projects</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <button
              type="submit"
              id="onboarding-submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-brand-500 text-white text-sm font-semibold transition-all duration-300 ease-spring flex items-center justify-center gap-2 hover:bg-brand-600 hover:-translate-y-0.5 hover:shadow-layered disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Setting up your account…
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Get Started
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              Want to use a different account?{' '}
              <button
                type="button"
                onClick={() => {
                  setPendingGoogleProfile(null);
                  navigate('/login');
                }}
                className="font-medium text-brand-600 hover:underline"
              >
                Go back to login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
