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
    <div className="fixed inset-0 pointer-events-none z-[-20] transition-opacity duration-1000 bg-[var(--bg)]">
      {/* Background Image Layer */}
      <img src={bgImage} alt="background wallpaper" className="absolute inset-0 w-full h-full object-cover opacity-60 object-center mask-bottom-fade transition-opacity duration-1000" />
      
      {/* Bottom to Top Subtle Overlay (so text remains readable at the bottom) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent opacity-80" />
      
      <style dangerouslySetInnerHTML={{__html: `
        .mask-bottom-fade {
          mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
        }
      `}} />
    </div>
  );
}
