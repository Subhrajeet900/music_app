'use client';

import { Search, MoreHorizontal, LogOut, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function TopBar() {
  const router = useRouter();
  const { username, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const initial = (username || 'U')[0].toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg)]/50 backdrop-blur-2xl px-5 lg:px-8 py-4 flex items-center justify-between gap-4 border-b border-[var(--acc-glow)] font-sans">
      {/* Left: Greeting */}
      <div className="flex-1 min-w-0">
        <p className="text-[var(--t2)] text-[11px] font-bold uppercase tracking-widest">{greeting}</p>
        <h1 className="text-[var(--t1)] text-lg font-bold tracking-tight leading-tight truncate">
          Welcome back, <span className="text-[var(--t1)]">{username || 'User'}</span>
        </h1>
      </div>

      {/* Center: Search */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 bg-[var(--s2)] border border-[var(--s3)] rounded-full px-4 py-2.5 w-[280px] focus-within:border-[var(--acc)] transition-colors">
        <Search size={15} className="text-[var(--t3)] flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search songs, artists..."
          className="bg-transparent text-[var(--t1)] text-sm placeholder-[var(--t3)] outline-none w-full font-medium"
        />
      </form>

      {/* Right: Avatar + Menu */}
      <div className="flex items-center gap-3" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-9 h-9 rounded-full bg-[var(--acc)] flex items-center justify-center text-[var(--bg)] font-bold text-[15px] hover:scale-105 active:scale-95 transition-all flex-shrink-0 shadow-[0_0_15px_var(--acc-dim)]"
        >
          {initial}
        </button>

        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="text-[var(--t3)] hover:text-[var(--t1)] transition-colors"
        >
          <MoreHorizontal size={20} />
        </button>

        {showDropdown && (
          <div className="absolute right-4 top-full mt-2 w-48 bg-[var(--s2)] rounded-[12px] shadow-2xl border border-[rgba(255,255,255,0.06)] py-1 animate-fade-in z-50">
            <button onClick={() => { setShowDropdown(false); router.push('/profile'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[var(--t2)] hover:text-[var(--t1)] hover:bg-[var(--s3)] transition-colors">
              <User size={16} /> Profile
            </button>
            <button onClick={() => { setShowDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[var(--t2)] hover:text-[var(--t1)] hover:bg-[var(--s3)] transition-colors">
              <Settings size={16} /> Settings
            </button>
            <div className="h-px bg-[rgba(255,255,255,0.06)] my-1" />
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#f87171] hover:text-[#fca5a5] hover:bg-[var(--s3)] transition-colors">
              <LogOut size={16} /> Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
