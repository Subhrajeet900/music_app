'use client';

import { Home, Search, Library, Heart, Music } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePlayerStore } from '@/store/playerStore';

const PLAYLISTS = [
  { name: 'Midnight Vibes', count: 12, color: '#7c3aed' },
  { name: 'Focus Flow', count: 8, color: '#3b82f6' },
  { name: 'Synthwave Night', count: 15, color: '#ec4899' },
  { name: 'Daily Mix 1', count: 25, color: '#10b981' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentTrack, isPlaying } = usePlayerStore();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/library', label: 'Your Library', icon: Library },
    { href: '/library', label: 'Liked Songs', icon: Heart },
  ];

  return (
    <aside className="w-[250px] flex-shrink-0 bg-[#0d1117] h-full flex-col hidden lg:flex border-r border-white/[0.06]">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full border-2 border-[#e2a93b] flex items-center justify-center animate-[glow-ring_3s_ease-in-out_infinite]">
          <Music size={16} className="text-[#e2a93b]" />
        </div>
        <div>
          <span className="text-[#e6edf3] font-bold text-base tracking-tight block leading-tight">MoodTunes</span>
          <span className="text-[#7d8590] text-[10px] font-medium uppercase tracking-[0.15em]">Your Universe</span>
        </div>
      </div>

      {/* Menu Section */}
      <div className="px-5 mt-2">
        <span className="text-[#484f58] text-[10px] font-semibold uppercase tracking-[0.15em] mb-2 block">Menu</span>
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  active
                    ? 'text-[#e2a93b] bg-[#e2a93b]/10'
                    : 'text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.03]'
                }`}
              >
                <span className={`w-1 h-1 rounded-full ${active ? 'bg-[#e2a93b]' : 'bg-[#484f58]'}`} />
                <item.icon size={18} fill={active ? 'currentColor' : 'none'} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Playlists Section */}
      <div className="px-5 mt-6 flex-1 flex flex-col overflow-hidden">
        <span className="text-[#484f58] text-[10px] font-semibold uppercase tracking-[0.15em] mb-3 block">Playlists</span>
        <div className="flex-1 overflow-y-auto space-y-0.5 scrollbar-hide">
          {PLAYLISTS.map((p) => (
            <Link
              key={p.name}
              href="/library"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.03] transition-all group"
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
              <span className="flex-1 truncate">{p.name}</span>
              <span className="text-[11px] text-[#484f58] group-hover:text-[#7d8590] transition-colors">{p.count} songs</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Now Playing Widget */}
      {currentTrack && (
        <div className="px-5 pb-4 mt-3">
          <span className="text-[#484f58] text-[10px] font-semibold uppercase tracking-[0.15em] mb-2 block">Now Playing</span>
          <Link href="/now-playing" className="flex items-center gap-3 p-2 rounded-xl bg-[#161b22] hover:bg-[#1c2333] transition-all group">
            <div className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ${isPlaying ? 'now-playing-disc' : 'now-playing-disc paused'}`}>
              <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[#e6edf3] text-xs font-medium truncate">{currentTrack.title}</p>
              <p className="text-[#7d8590] text-[11px] truncate">{currentTrack.artist}</p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
