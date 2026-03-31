'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function GlobalBackground() {
  const pathname = usePathname();
  const [bgImage, setBgImage] = useState('/racing-bg.png');

  useEffect(() => {
    // Provide a deterministic alternation based on route name length to swap between the 5 cars
    const hash = (pathname || '').length % 5;
    const images = [
      '/racing-bg.png',    // 0
      '/racing-bg-2.png',  // 1
      '/racing-bg-3.png',  // 2
      '/racing-bg-4.png',  // 3
      '/racing-bg-5.png'   // 4
    ];
    setBgImage(images[hash]);
  }, [pathname]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-20] overflow-hidden bg-[var(--bg)]">
      {/* Smoky Ambient Elements */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-[float_25s_infinite_ease-in-out]" />
      <div className="absolute bottom-[-5%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-[float_30s_infinite_ease-in-out_reverse]" />
      <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-magenta-500/5 rounded-full blur-[110px] animate-[fluidScale_15s_infinite_ease-in-out]" />
      
      {/* Background Image Layer */}
      <div className="absolute inset-0 transition-opacity duration-1000">
        <img 
          src={bgImage} 
          alt="" 
          className="w-full h-full object-cover opacity-30 mix-blend-luminosity filter contrast-125 transition-opacity duration-1000" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/80 to-transparent" />
      </div>
    </div>
  );
}
