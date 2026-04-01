'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Eye, EyeOff, ArrowRight, User, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password.trim()) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Min 6 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords mismatch';
    return errs;
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    
    register(name, email, password);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Haze */}
      <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#7c3aed] opacity-[0.06] blur-[150px] rounded-full animate-drift" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#ec4899] opacity-[0.04] blur-[120px] rounded-full animate-drift-reverse" />

      {/* Signup Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[480px] bg-white/[0.03] backdrop-blur-3xl rounded-[48px] p-10 md:p-14 border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
      >
        <div className="text-center mb-10">
           <div className="w-16 h-16 bg-white/[0.05] border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group hover:scale-110 transition-transform cursor-pointer">
              <Music size={32} className="text-white group-hover:text-[var(--acc)] transition-colors" />
           </div>
           <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Create Identity</h1>
           <p className="text-[var(--t2)] text-sm font-bold tracking-widest uppercase opacity-40">Join the neon collective</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-[var(--t3)] uppercase tracking-[0.2em] ml-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Neon Operator"
                  className={`w-full bg-white/[0.04] border ${errors.name ? 'border-red-500/50' : 'border-white/5'} rounded-2xl px-6 py-4 text-white font-bold placeholder-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--acc)]/30 transition-all`}
                />
              </div>
              {errors.name && <p className="text-red-400 text-[10px] font-bold uppercase ml-1">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-[var(--t3)] uppercase tracking-[0.2em] ml-1">Email Interface</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@moodtunes.io"
                className={`w-full bg-white/[0.04] border ${errors.email ? 'border-red-500/50' : 'border-white/5'} rounded-2xl px-6 py-4 text-white font-bold placeholder-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--acc)]/30 transition-all`}
              />
              {errors.email && <p className="text-red-400 text-[10px] font-bold uppercase ml-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="block text-[10px] font-black text-[var(--t3)] uppercase tracking-[0.2em] ml-1">Passcode</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6"
                      className={`w-full bg-white/[0.04] border ${errors.password ? 'border-red-500/50' : 'border-white/5'} rounded-2xl px-5 py-4 text-white font-bold placeholder-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--acc)]/30 transition-all font-mono`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="block text-[10px] font-black text-[var(--t3)] uppercase tracking-[0.2em] ml-1">Confirm</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat"
                    className={`w-full bg-white/[0.04] border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/5'} rounded-2xl px-5 py-4 text-white font-bold placeholder-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--acc)]/30 transition-all font-mono`}
                  />
               </div>
            </div>
            {(errors.password || errors.confirmPassword) && (
              <p className="text-red-400 text-[10px] font-bold uppercase ml-1 text-center">
                {errors.password || errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-white text-black font-black rounded-3xl text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 group mt-4"
          >
            Launch Profile <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-[13px] text-[var(--t2)] font-bold mt-10 opacity-40">
          Already one of us?{' '}
          <Link href="/login" className="text-white hover:text-[var(--acc)] transition-colors opacity-100">
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
