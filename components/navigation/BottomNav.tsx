'use client';

import { Home, Search, Library, User, Heart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/library', label: 'Library', icon: Library },
    { href: '/liked', label: 'Liked', icon: Heart },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="h-[56px] bg-[var(--bg)]/50 backdrop-blur-2xl border-t border-[var(--acc-glow)] flex items-center justify-around px-2 lg:hidden w-full font-sans">
      {tabs.map((tab) => {
        const active = tab.href === '/' ? pathname === '/' : pathname?.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-[var(--acc)]' : 'text-[var(--t3)]'}`}
          >
            <tab.icon size={active ? 22 : 20} fill={active ? 'currentColor' : 'none'} className="transition-all" />
            <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
