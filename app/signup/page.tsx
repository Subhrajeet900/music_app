'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password.trim()) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!confirmPassword.trim()) errs.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    
    // Auth Store Call
    register(name, email, password);
    router.push('/');
  };

  const inputClass = (field: string) =>
    `w-full bg-[var(--bg)] border ${errors[field] ? 'border-red-500' : 'border-[rgba(255,255,255,0.08)]'} rounded-xl px-4 py-3 text-[var(--t1)] placeholder-[var(--s5)] focus:outline-none focus:border-[var(--acc)] transition-colors text-[14px]`;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--acc)] opacity-[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[var(--s1)] rounded-[20px] p-8 md:p-10 border border-[rgba(255,255,255,0.06)] shadow-2xl animate-[fade-in_0.5s_ease-out]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-[var(--acc)] flex items-center justify-center animate-[pulse-logo_2s_ease-in-out_infinite]">
            <Music size={28} className="text-[var(--acc)]" />
          </div>
        </div>

        <h1 className="text-[24px] font-bold text-[var(--t1)] text-center mb-1">Create Account</h1>
        <p className="text-[var(--t2)] text-center text-[13px] mb-8">Join <span className="text-[var(--acc)] font-bold">MoodTunes</span> for free</p>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-[13px] font-bold tracking-wide text-[var(--t3)] uppercase mb-1.5">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputClass('name')} />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-bold tracking-wide text-[var(--t3)] uppercase mb-1.5">Email</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass('email')} />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-bold tracking-wide text-[var(--t3)] uppercase mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className={`${inputClass('password')} pr-12`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--s5)] hover:text-[var(--t2)] transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-bold tracking-wide text-[var(--t3)] uppercase mb-1.5">Confirm Password</label>
            <div className="relative">
              <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" className={`${inputClass('confirmPassword')} pr-12`} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--s5)] hover:text-[var(--t2)] transition-colors">
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="w-full py-3 bg-[var(--acc)] hover:bg-white text-[var(--bg)] font-bold rounded-xl transition-all active:scale-95 text-[15px] mt-2 shadow-[0_0_20px_var(--acc-dim)]">
            Sign Up
          </button>
        </form>

        <p className="text-center text-[13px] text-[var(--t2)] font-medium mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--acc)] hover:text-[var(--t1)] font-bold transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
