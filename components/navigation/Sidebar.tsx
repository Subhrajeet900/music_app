'use client';

import { useState, useEffect } from 'react';
import { Home, Search, Library, Heart, Music, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePlayerStore } from '@/store/playerStore';
import { PlaylistModal } from '@/components/modals/PlaylistModal';

export function Sidebar() {
  const pathname = usePathname();
  const currentTrack = usePlayerStore(state => state.currentTrack);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const playlists = usePlayerStore(state => state.playlists);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/library', label: 'Your Library', icon: Library },
    { href: '/liked', label: 'Liked Songs', icon: Heart },
  ];

  return (
    <aside className="w-[240px] flex-shrink-0 bg-[#0a0a10] h-full flex flex-col hidden lg:flex border-r border-[var(--acc-border)] font-sans select-none overflow-hidden">
      {/* Logo Area */}
      <div className="h-[72px] px-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--acc)] to-[var(--acc-light)] flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)]">
          <Music size={18} className="text-black" />
        </div>
        <span className="text-[18px] font-black text-white tracking-tight">MoodTunes</span>
      </div>

      {/* Navigation Links */}
      <nav className="px-3 flex flex-col gap-1 mt-4">
        {navItems.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-3 px-4 h-[44px] rounded-xl transition-all relative ${
                active 
                  ? 'bg-white/5 text-white' 
                  : 'text-[var(--t2)] hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {active && <div className="absolute left-[-3px] top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[var(--acc)] rounded-r-md shadow-[0_0_15px_var(--acc)]" />}
              <item.icon size={18} className={active ? 'text-[var(--acc-light)]' : ''} />
              <span className="text-[14px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Playlists Section */}
      <div className="flex-1 flex flex-col min-h-0 mt-8">
        <div className="px-6 mb-3 flex items-center justify-between">
          <span className="text-[10px] font-black text-[var(--t3)] uppercase tracking-[0.2em]">Your Playlists</span>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 space-y-1 scrollbar-hide mb-4">
          {mounted && playlists.map((p) => {
            const active = pathname === `/playlist/${p.id}`;
            return (
              <Link
                key={p.id}
                href={`/playlist/${p.id}`}
                className={`flex items-center gap-3 px-4 h-[36px] rounded-lg transition-all group ${
                  active ? 'bg-white/5 text-white' : 'text-[var(--t2)] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div 
                  className="w-5 h-5 rounded flex-shrink-0 opacity-80 group-hover:opacity-100" 
                  style={{ background: p.color }} 
                />
                <span className="truncate text-[13px] font-medium">{p.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Create Playlist Button */}
      <div className="p-4 mt-auto">
        <button 
          onClick={() => setShowModal(true)}
          className="w-full h-11 rounded-xl border border-dashed border-white/10 hover:border-[var(--acc-border)] hover:bg-white/[0.02] transition-all flex items-center justify-center gap-2 text-[13px] font-bold text-[var(--t2)] hover:text-white"
        >
          <Plus size={16} /> Create New Playlist
        </button>
      </div>

      {showModal && <PlaylistModal onClose={() => setShowModal(false)} />}
    </aside>
  );
}
