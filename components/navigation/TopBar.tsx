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
    <header className="sticky top-0 z-40 bg-[#161b22]/90 backdrop-blur-md px-5 lg:px-6 py-3 flex items-center justify-between gap-4 border-b border-white/[0.04]">
      {/* Left: Greeting */}
      <div className="flex-1 min-w-0">
        <p className="text-[#e2a93b] text-[11px] font-semibold uppercase tracking-[0.12em]">{greeting}</p>
        <h1 className="text-[#e6edf3] text-lg font-bold tracking-tight leading-tight truncate">
          Welcome back, <span className="text-[#e2a93b]">{username || 'User'}</span>
        </h1>
      </div>

      {/* Center: Search */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 bg-[#1c2333] border border-white/[0.06] rounded-xl px-3 py-2 w-[240px] focus-within:border-[#e2a93b]/40 transition-colors">
        <Search size={15} className="text-[#484f58] flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search songs, artists..."
          className="bg-transparent text-[#e6edf3] text-sm placeholder-[#484f58] outline-none w-full"
        />
      </form>

      {/* Right: Avatar + Menu */}
      <div className="flex items-center gap-2" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-8 h-8 rounded-full bg-[#e2a93b] flex items-center justify-center text-[#0d1117] font-bold text-sm hover:bg-[#c9952f] transition-colors flex-shrink-0"
        >
          {initial}
        </button>

        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="text-[#7d8590] hover:text-[#e6edf3] transition-colors"
        >
          <MoreHorizontal size={20} />
        </button>

        {showDropdown && (
          <div className="absolute right-4 top-full mt-1 w-48 bg-[#1c2333] rounded-xl shadow-2xl border border-white/[0.06] py-1 animate-[fade-in_0.15s_ease-out] z-50">
            <button onClick={() => { setShowDropdown(false); router.push('/profile'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.04] transition-colors">
              <User size={16} /> Profile
            </button>
            <button onClick={() => { setShowDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.04] transition-colors">
              <Settings size={16} /> Settings
            </button>
            <div className="h-px bg-white/[0.06] my-1" />
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.04] transition-colors">
              <LogOut size={16} /> Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
