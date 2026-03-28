'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { MiniPlayer } from '@/components/MiniPlayer';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { Sidebar } from '@/components/navigation/Sidebar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { TopBar } from '@/components/navigation/TopBar';

const AUTH_ROUTES = ['/login', '/signup'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoggedIn, checkSession } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    checkSession();
    setChecked(true);
  }, [checkSession]);

  if (!checked) {
    return <div className="min-h-screen bg-[#0d1117]" />;
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
      <div className="flex-1 flex overflow-hidden pb-[72px] lg:pb-[72px]">
        <Sidebar />
        <main className="flex-1 flex flex-col bg-[#161b22] overflow-hidden relative">
          <TopBar />
          <div className="flex-1 overflow-y-auto w-full relative">
            {children}
          </div>
        </main>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-[500]">
        <MiniPlayer />
        <BottomNav />
      </div>
    </>
  );
}

function RedirectToLogin() {
  const router = useRouter();
  useEffect(() => {
    router.push('/login');
  }, [router]);
  return <div className="min-h-screen bg-[#0d1117]" />;
}
