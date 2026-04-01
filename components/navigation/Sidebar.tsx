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
    { href: '/', label: 'Home', icon: Home, delay: '0ms' },
    { href: '/search', label: 'Search', icon: Search, delay: '60ms' },
    { href: '/library', label: 'Your Library', icon: Library, delay: '120ms' },
  ];

  return (
    <aside className="w-[250px] flex-shrink-0 bg-[var(--bg)] h-full flex-col hidden lg:flex border-r border-[var(--acc-glow)] font-sans">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full border-2 border-[var(--acc)] flex items-center justify-center animate-aura-spin">
          <Music size={16} className="text-[var(--acc)]" />
        </div>
        <div>
          <span className="text-[var(--t1)] font-bold text-base tracking-tight block leading-tight font-sans">MoodTunes</span>
          <span className="text-[var(--t2)] text-[10px] font-medium uppercase tracking-[0.15em]">Your Universe</span>
        </div>
      </div>

      {/* Menu Section */}
      <div className="px-5 mt-2">
        <span className="text-[var(--t3)] text-[10px] font-bold uppercase tracking-[0.15em] mb-2 block">Menu</span>
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all animate-sidebarItemIn ${
                  active
                    ? 'text-[var(--acc)] bg-[var(--acc-dim)]'
                    : 'text-[var(--t2)] hover:text-[var(--t1)] hover:bg-[var(--acc-glow)]'
                }`}
                style={{ animationDelay: item.delay, animationFillMode: 'both' }}
              >
                <span className={`w-1 h-1 rounded-full transition-colors ${active ? 'bg-[var(--acc)]' : 'bg-[var(--t3)]'}`} />
                <item.icon size={18} fill={active ? 'currentColor' : 'none'} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Playlists Section */}
      <div className="px-5 mt-6 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-3">
           <span className="text-[var(--t3)] text-[10px] font-bold uppercase tracking-[0.15em]">Playlists</span>
           <button 
             onClick={() => setShowModal(true)}
             className="text-[var(--acc)] hover:text-[var(--t1)] transition-colors hover:scale-110 active:scale-95 flex items-center justify-center w-[16px] h-[16px] animate-pulse-glow rounded-full"
           >
             <Plus size={16} />
           </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-0.5 scrollbar-hide">
          {mounted && playlists.map((p, i) => {
            const active = pathname === `/playlist/${p.id}`;
            return (
              <Link
                key={p.id}
                href={`/playlist/${p.id}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all group animate-sidebarItemIn ${
                  active ? 'bg-[var(--s2)] text-[var(--t1)]' : 'text-[var(--t2)] hover:text-[var(--t1)] hover:bg-[var(--acc-glow)]'
                }`}
                style={{ animationDelay: `${(i + 4) * 60}ms`, animationFillMode: 'both' }}
              >
                <span className="w-7 h-7 rounded-[7px] flex-shrink-0" style={{ background: p.color }} />
                <div className="flex flex-col flex-1 min-w-0">
                   <span className="truncate">{p.name}</span>
                   <span className={`text-[10px] transition-colors ${active ? 'text-[var(--t2)]' : 'text-[var(--t3)] group-hover:text-[var(--t2)]'}`}>
                     {p.tracks.length} songs
                   </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Now Playing Widget */}
      {currentTrack && (
        <div className="px-5 pb-4 mt-3">
          <span className="text-[var(--t3)] text-[10px] font-bold uppercase tracking-[0.15em] mb-2 block">Now Playing</span>
          <Link href="/now-playing" className="flex items-center gap-3 p-2 rounded-xl bg-[var(--s1)] hover:bg-[var(--s2)] transition-all group border border-[var(--acc-glow)] hover:border-[var(--acc-border)]">
            <div className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ${isPlaying ? 'now-playing-disc' : 'now-playing-disc paused'}`}>
              <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[var(--t1)] text-xs font-medium truncate">{currentTrack.title}</p>
              <p className="text-[var(--t2)] text-[11px] truncate">{currentTrack.artist}</p>
            </div>
          </Link>
        </div>
      )}

      {showModal && <PlaylistModal onClose={() => setShowModal(false)} />}
    </aside>
  );
}
