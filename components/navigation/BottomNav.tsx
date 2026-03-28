'use client';

import { Home, Search, Library, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/library', label: 'Library', icon: Library },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="h-[56px] bg-[#0d1117]/95 backdrop-blur-md border-t border-white/[0.06] flex items-center justify-around px-2 lg:hidden w-full">
      {tabs.map((tab) => {
        const active = tab.href === '/' ? pathname === '/' : pathname?.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-0.5 transition-colors ${active ? 'text-[#e2a93b]' : 'text-[#484f58]'}`}
          >
            <tab.icon size={22} fill={active ? 'currentColor' : 'none'} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
