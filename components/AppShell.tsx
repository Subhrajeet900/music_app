'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { MiniPlayer } from '@/components/MiniPlayer';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { Sidebar } from '@/components/navigation/Sidebar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { TopBar } from '@/components/navigation/TopBar';
import { BottomPlayerBar } from '@/components/player/BottomPlayerBar';

const AUTH_ROUTES = ['/login', '/signup'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoggedIn, checkSession } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    checkSession();
    setChecked(true);

    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('PWA Service Worker registration failed:', err);
      });
    }
  }, [checkSession]);

  if (!checked) {
    return <div className="min-h-screen bg-transparent" />;
  }

  const isAuthPage = AUTH_ROUTES.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (!isLoggedIn) {
    return <RedirectToLogin />;
  }

  return (
    <>
      <YouTubePlayer />
      <div className="flex h-full overflow-hidden relative">
        {/* Sidebar - Laptop Only */}
        <Sidebar aria-label="Desktop Sidebar" />
        
        <main className="flex-1 flex flex-col min-w-0 bg-transparent overflow-hidden relative font-sans">
          {/* Top Bar - Mobile and Desktop */}
          <TopBar />
          
          <div className="flex-1 overflow-y-auto w-full relative scrollbar-hide pb-32 lg:pb-24">
            {children}
          </div>
        </main>
      </div>

      {/* Persistent Player & Nav Layer */}
      <div className="fixed bottom-0 left-0 right-0 z-[500] pointer-events-none">
        <div className="pointer-events-auto">
          {/* Bottom Player Bar - Desktop Only (Logic inside component or here) */}
          <div className="hidden lg:block">
            <BottomPlayerBar />
          </div>

          {/* Mini Player - Mobile Only */}
          <div className="lg:hidden px-3 mb-2">
            <MiniPlayer />
          </div>

          {/* Bottom Nav - Mobile Only */}
          <div className="lg:hidden">
            <BottomNav />
          </div>
        </div>
      </div>
    </>
  );
}

function RedirectToLogin() {
  const router = useRouter();
  useEffect(() => {
    router.push('/login');
  }, [router]);
  return <div className="min-h-screen bg-transparent" />;
}
