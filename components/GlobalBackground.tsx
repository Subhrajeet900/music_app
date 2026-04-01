'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function GlobalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-20] overflow-hidden bg-[#050508]">
      {/* Smoke Orb 1 — Top Left (Purple) */}
      <div 
        className="fixed w-[600px] h-[600px] rounded-full top-[-200px] left-[-200px] animate-[drift1_25s_ease-in-out_infinite_alternate] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12), transparent 70%)',
          filter: 'blur(80px)'
        }}
      />

      {/* Smoke Orb 2 — Center Right (Pink) */}
      <div 
        className="fixed w-[500px] h-[500px] rounded-full top-[30%] right-[-150px] animate-[drift2_30s_ease-in-out_infinite_alternate] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08), transparent 70%)',
          filter: 'blur(70px)'
        }}
      />

      {/* Smoke Orb 3 — Bottom Center (Blue) */}
      <div 
        className="fixed w-[400px] h-[400px] rounded-full bottom-[-100px] left-[20%] animate-[drift1_20s_ease-in-out_infinite_alternate_reverse] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06), transparent 70%)',
          filter: 'blur(90px)'
        }}
      />
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

      {/* Bottom fade/smoke bleed */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050508]/80" />
    </div>
  );
}
