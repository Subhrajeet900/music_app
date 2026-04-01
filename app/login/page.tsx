'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Eye, EyeOff, X, ArrowRight, Disc3 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password.trim()) errs.password = 'Password is required';
    return errs;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    
    const res = login(email, password);
    if (res.success) {
      router.push('/');
    } else {
      setErrors({ form: res.error });
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Haze */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#7c3aed] opacity-[0.07] blur-[120px] rounded-full animate-drift" style={{ animationDuration: '20s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ec4899] opacity-[0.05] blur-[100px] rounded-full animate-drift-reverse" style={{ animationDuration: '25s' }} />

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[440px] bg-white/[0.03] backdrop-blur-3xl rounded-[48px] p-10 md:p-14 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
      >
        <div className="text-center mb-10">
           <div className="w-16 h-16 bg-white/[0.05] border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group hover:scale-110 transition-transform cursor-pointer">
              <Music size={32} className="text-white group-hover:text-[var(--acc)] transition-colors" />
           </div>
           <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Welcome Back</h1>
           <p className="text-[var(--t2)] text-sm font-bold tracking-widest uppercase opacity-40">Identify yourself to the haze</p>
        </div>

        {errors.form && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] font-bold text-center rounded-2xl"
          >
            {errors.form}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-[var(--t3)] uppercase tracking-[0.2em] ml-1">Email Terminal</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@moodtunes.io"
              className="w-full bg-white/[0.04] border border-white/5 rounded-2xl px-6 py-5 text-white font-bold placeholder-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--acc)]/30 transition-all"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
               <label className="block text-[10px] font-black text-[var(--t3)] uppercase tracking-[0.2em]">Passcode</label>
               <button 
                 type="button"
                 onClick={() => setShowForgotModal(true)}
                 className="text-[10px] font-black text-[var(--acc)] uppercase tracking-widest hover:text-white transition-colors"
                >
                  Lost Key?
               </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/5 rounded-2xl px-6 py-5 text-white font-bold placeholder-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--acc)]/30 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-white text-black font-black rounded-3xl text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 group"
          >
            Access Core <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="flex items-center gap-4 my-10">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">Alternate Sync</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-white font-bold text-[13px] hover:bg-white/5 transition-all active:scale-95">
             <Disc3 size={18} /> Network
          </button>
          <button className="flex items-center justify-center gap-3 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-white font-bold text-[13px] hover:bg-white/5 transition-all active:scale-95">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg> Google
          </button>
        </div>

        <p className="text-center text-[13px] text-[var(--t2)] font-bold mt-10 opacity-40">
          New to the haze?{' '}
          <Link href="/signup" className="text-white hover:text-[var(--acc)] transition-colors opacity-100">
            Create Profile
          </Link>
        </p>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050508]/80 backdrop-blur-xl p-6" onClick={() => { setShowForgotModal(false); setForgotSent(false); }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0d0d14] w-full max-w-sm p-10 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden" 
              onClick={(e) => e.stopPropagation()}
            >
               <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-[var(--acc)]/20 blur-[80px] rounded-full" />
               
              <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-2xl font-black text-white">Reset Key</h3>
                <button onClick={() => { setShowForgotModal(false); setForgotSent(false); }} className="text-white/20 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="relative z-10">
                {!forgotSent ? (
                  <div className="space-y-6">
                    <p className="text-sm font-bold text-[var(--t2)] opacity-60">Enter your identifier to receive a recovery sync.</p>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="operator@moodtunes.io"
                      className="w-full bg-white/[0.04] border border-white/5 rounded-2xl px-6 py-5 text-white font-bold placeholder-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--acc)]/30 transition-all font-mono"
                    />
                    <button
                      onClick={() => forgotEmail.trim() && setForgotSent(true)}
                      className="w-full py-5 bg-white text-black font-black rounded-[24px] hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Sync Recovery
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-[var(--acc)]/10 rounded-[24px] flex items-center justify-center mx-auto mb-6">
                      <Music size={28} className="text-[var(--acc)]" />
                    </div>
                    <p className="text-white font-black text-xl mb-2">Sync Sent</p>
                    <p className="text-[var(--t2)] text-sm font-bold opacity-60 leading-relaxed">Check your terminal for the recovery link sent to {forgotEmail}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
