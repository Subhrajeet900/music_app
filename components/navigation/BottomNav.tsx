'use client';
import { Home, Search, Library, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/library', label: 'Library', icon: Library },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="h-[64px] bg-[#0a0a10]/95 backdrop-blur-xl border-t border-[var(--acc-border)] flex items-center justify-around px-2 pb-safe select-none">
      {navItems.map((item) => {
        const active = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 w-full h-full relative"
          >
            <div className={`relative transition-all duration-300 ${active ? 'text-[var(--acc)] -translate-y-0.5 scale-110' : 'text-[var(--t2)]'}`}>
              <item.icon size={22} fill={active ? 'currentColor' : 'none'} strokeWidth={active ? 2.5 : 2} />
              {active && <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--acc)] rounded-full shadow-[0_0_8px_var(--acc)]" />}
            </div>
            <span className={`text-[10px] font-bold transition-colors ${active ? 'text-[var(--acc)]' : 'text-[var(--t2)]'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
