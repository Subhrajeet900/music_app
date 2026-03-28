'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuthStore();
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
    login(name, email);
    router.push('/');
  };

  const inputClass = (field: string) =>
    `w-full bg-[#0d1117] border ${errors[field] ? 'border-red-500' : 'border-white/[0.08]'} rounded-xl px-4 py-3 text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#e2a93b] focus:ring-1 focus:ring-[#e2a93b]/30 transition-colors`;

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e2a93b]/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#161b22] rounded-2xl p-8 md:p-10 border border-white/[0.06] shadow-2xl shadow-black/40 animate-[fade-in_0.5s_ease-out]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-[#e2a93b] flex items-center justify-center animate-[pulse-logo_2s_ease-in-out_infinite]">
            <Music size={28} className="text-[#e2a93b]" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#e6edf3] text-center mb-1">Create Account</h1>
        <p className="text-[#7d8590] text-center text-sm mb-8">Join <span className="text-[#e2a93b] font-medium">MoodTunes</span> for free</p>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#7d8590] mb-1.5">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputClass('name')} />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#7d8590] mb-1.5">Email</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass('email')} />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#7d8590] mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className={`${inputClass('password')} pr-12`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#484f58] hover:text-[#7d8590] transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#7d8590] mb-1.5">Confirm Password</label>
            <div className="relative">
              <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" className={`${inputClass('confirmPassword')} pr-12`} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#484f58] hover:text-[#7d8590] transition-colors">
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="w-full py-3 bg-[#e2a93b] hover:bg-[#c9952f] text-[#0d1117] font-bold rounded-xl transition-all active:scale-[0.97] text-base mt-2 shadow-lg shadow-[#e2a93b]/20">
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-[#7d8590] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#e2a93b] hover:text-[#c9952f] font-medium transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
