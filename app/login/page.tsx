'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Eye, EyeOff, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password.trim()) errs.password = 'Password is required';
    else if (password.length < 4) errs.password = 'Password must be at least 4 characters';
    return errs;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    
    // Auth Store Call
    const res = login(email, password);
    if (res.success) {
      router.push('/');
    } else {
      setErrors({ form: res.error });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[var(--acc)] opacity-[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[var(--acc)] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${4 + i * 2}px`,
              height: `${4 + i * 2}px`,
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              background: `var(--acc-dim)`,
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[var(--s1)] rounded-[20px] p-8 md:p-10 border border-[rgba(255,255,255,0.06)] shadow-2xl animate-[fade-in_0.5s_ease-out]">
        {/* Animated Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-[var(--acc)] flex items-center justify-center animate-[pulse-logo_2s_ease-in-out_infinite]">
            <Music size={28} className="text-[var(--acc)]" />
          </div>
        </div>

        <h1 className="text-[24px] font-bold text-[var(--t1)] text-center mb-1">Welcome Back</h1>
        <p className="text-[var(--t2)] text-center text-[13px] mb-8">Sign in to continue to <span className="text-[var(--acc)] font-bold">MoodTunes</span></p>

        {errors.form && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2 flex items-center justify-center rounded-[8px]">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-[13px] font-bold tracking-wide text-[var(--t3)] uppercase mb-1.5">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full bg-[var(--bg)] border ${errors.email ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'} rounded-xl px-4 py-3 text-[var(--t1)] placeholder-[var(--s5)] focus:outline-none focus:border-[var(--acc)] transition-colors text-[14px]`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[13px] font-bold tracking-wide text-[var(--t3)] uppercase mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full bg-[var(--bg)] border ${errors.password ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'} rounded-xl px-4 py-3 pr-12 text-[var(--t1)] placeholder-[var(--s5)] focus:outline-none focus:border-[var(--acc)] transition-colors text-[14px]`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--s5)] hover:text-[var(--t2)] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Remember me + Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-4 h-4 rounded border ${rememberMe ? 'bg-[var(--acc)] border-[var(--acc)]' : 'border-[var(--t3)]'} flex items-center justify-center transition-colors`}
              >
                {rememberMe && <span className="text-[var(--bg)] text-xs font-bold">✓</span>}
              </div>
              <span className="text-[13px] text-[var(--t2)] group-hover:text-[var(--t1)] transition-colors font-medium">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-[13px] font-bold text-[var(--acc)] hover:text-[var(--t1)] transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[var(--acc)] hover:bg-white text-[var(--bg)] font-bold rounded-xl transition-all active:scale-95 text-[15px] shadow-[0_0_20px_var(--acc-dim)]"
          >
            Log In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
          <span className="text-xs text-[var(--t3)] font-bold uppercase tracking-wider">or continue with</span>
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
        </div>

        {/* Social Login Buttons */}
        <div className="flex gap-3">
          <button onClick={() => showToast('Google login coming soon!')} className="flex-1 py-2.5 border border-[rgba(255,255,255,0.08)] bg-[var(--s2)] rounded-xl text-[var(--t1)] text-sm font-bold hover:bg-[var(--s3)] transition-colors flex items-center justify-center gap-2 active:scale-95">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          </button>
          <button onClick={() => showToast('Apple login coming soon!')} className="flex-1 py-2.5 border border-[rgba(255,255,255,0.08)] bg-[var(--s2)] rounded-xl text-[var(--t1)] text-sm font-bold hover:bg-[var(--s3)] transition-colors flex items-center justify-center gap-2 active:scale-95">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#f0f2f4"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-[13px] text-[var(--t2)] font-medium mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[var(--acc)] hover:text-[var(--t1)] font-bold transition-colors">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]" onClick={() => { setShowForgotModal(false); setForgotSent(false); }}>
          <div className="bg-[var(--s1)] w-full max-w-sm mx-4 p-8 rounded-[20px] border border-[rgba(255,255,255,0.06)] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--t1)]">Reset Password</h3>
              <button onClick={() => { setShowForgotModal(false); setForgotSent(false); }} className="text-[var(--s5)] hover:text-[var(--t1)] transition-colors">
                <X size={20} />
              </button>
            </div>
            {!forgotSent ? (
              <>
                <p className="text-sm text-[var(--t2)] mb-4 leading-relaxed">Enter your email and we&apos;ll send you a reset link.</p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[var(--bg)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-[var(--t1)] placeholder-[var(--s5)] focus:outline-none focus:border-[var(--acc)] mb-4 text-[14px]"
                />
                <button
                  onClick={() => forgotEmail.trim() && setForgotSent(true)}
                  className="w-full py-3 bg-[var(--acc)] hover:bg-white text-[var(--bg)] font-bold rounded-xl transition-all active:scale-95"
                >
                  Send Reset Link
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-[#e2a93b]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Music size={24} className="text-[#e2a93b]" />
                </div>
                <p className="text-[#e6edf3] font-medium">Check your email</p>
                <p className="text-[#7d8590] text-sm mt-1">We&apos;ve sent a reset link to {forgotEmail}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] bg-[var(--s3)] text-[var(--t1)] px-6 py-3 rounded-full shadow-xl border border-[rgba(255,255,255,0.06)] text-[13px] font-bold animate-toast-in">
          {toast}
        </div>
      )}
    </div>
  );
}
