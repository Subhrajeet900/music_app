'use client';

import { usePlayerStore } from '@/store/playerStore';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Repeat1, Heart, Share2, MoreHorizontal, ArrowLeft, ListMusic, X, Copy, Link2, Disc3 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { formatDuration } from '@/lib/tracks';
import { motion, AnimatePresence } from 'framer-motion';

export default function NowPlayingPage() {
  const router = useRouter();
  const currentTrack = usePlayerStore(state => state.currentTrack);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const togglePlay = usePlayerStore(state => state.togglePlay);
  const nextTrack = usePlayerStore(state => state.nextTrack);
  const prevTrack = usePlayerStore(state => state.prevTrack);
  const progress = usePlayerStore(state => state.progress);
  const volume = usePlayerStore(state => state.volume);
  const setVolume = usePlayerStore(state => state.setVolume);
  const toggleMute = usePlayerStore(state => state.toggleMute);
  const shuffle = usePlayerStore(state => state.shuffle);
  const toggleShuffle = usePlayerStore(state => state.toggleShuffle);
  const repeatMode = usePlayerStore(state => state.repeatMode);
  const cycleRepeat = usePlayerStore(state => state.cycleRepeat);
  const likedSongs = usePlayerStore(state => state.likedSongs);
  const toggleLike = usePlayerStore(state => state.toggleLike);
  const queue = usePlayerStore(state => state.queue);
  const showQueue = usePlayerStore(state => state.showQueue);
  const setShowQueue = usePlayerStore(state => state.setShowQueue);
  const playTrackFromList = usePlayerStore(state => state.playTrackFromList);
  const currentTime = usePlayerStore(state => state.currentTime);
  const seekTo = usePlayerStore(state => state.seekTo);

  const [localProgress, setLocalProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (!isDragging) setLocalProgress(progress);
  }, [progress, isDragging]);

  if (!currentTrack) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#050508]">
        <Disc3 size={64} className="text-[var(--t3)] mb-4 animate-pulse" />
        <h2 className="text-xl font-black text-white mb-2">No Music Selected</h2>
        <p className="text-[var(--t2)] text-sm mb-8">Choose a track to see the magic happen.</p>
        <button 
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-[var(--acc)] text-white rounded-full font-black shadow-lg"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const isLiked = likedSongs.includes(currentTrack.id);

  return (
    <div className="relative flex-1 flex flex-col bg-[#050508] overflow-hidden select-none font-sans">
      {/* Ambient Smoke Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full top-[-10%] left-[-10%] animate-[drift1_30s_ease-in-out_infinite_alternate]"
          style={{ background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15), transparent 70%)', filter: 'blur(100px)' }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full bottom-[-10%] right-[-10%] animate-[drift2_35s_ease-in-out_infinite_alternate]"
          style={{ background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1), transparent 70%)', filter: 'blur(90px)' }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full top-[30%] right-[10%] animate-[drift1_25s_ease-in-out_infinite_alternate_reverse]"
          style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent 70%)', filter: 'blur(80px)' }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 md:px-12 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.back()} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white active:scale-90 transition-transform">
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-[var(--t3)] uppercase tracking-[0.3em]">Now Playing</span>
            <span className="text-[12px] font-bold text-white/40 truncate max-w-[150px]">{currentTrack.album || 'MoodTunes'}</span>
          </div>
          <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white active:scale-90 transition-transform">
            <MoreHorizontal size={24} />
          </button>
        </div>

        {/* Vinyl Visualization Area */}
        <div className="flex-1 flex items-center justify-center py-6 relative">
          <div className="relative group">
            {/* Vinyl Disc */}
            <motion.div 
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="relative w-[280px] h-[280px] md:w-[420px] md:h-[420px] rounded-full bg-[#0a0a0a] shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_0_80px_rgba(255,255,255,0.05)] flex items-center justify-center border-4 border-white/5"
            >
              {/* Grooves */}
              <div className="absolute inset-4 rounded-full border border-white/[0.03]" />
              <div className="absolute inset-8 rounded-full border border-white/[0.03]" />
              <div className="absolute inset-12 rounded-full border border-white/[0.03]" />
              <div className="absolute inset-16 rounded-full border border-white/[0.02]" />
              <div className="absolute inset-20 rounded-full border border-white/[0.02]" />
              <div className="absolute inset-[30%] rounded-full border-4 border-[#000] z-10" />

              {/* Album Art Label */}
              <div className="w-[110px] h-[110px] md:w-[160px] md:h-[160px] rounded-full overflow-hidden z-20 shadow-2xl relative">
                <img src={currentTrack.cover} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
                {/* Spindle Hole */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#050508] border-2 border-white/20 shadow-inner z-30" />
              </div>

              {/* Light Reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none rounded-full" />
            </motion.div>

            {/* Tonearm SVG */}
            <motion.div 
              className="absolute top-[-40px] right-[-60px] md:right-[-100px] z-50 pointer-events-none w-[180px] md:w-[260px]"
              animate={{ rotate: isPlaying ? 25 : 0 }}
              transition={{ type: "spring", stiffness: 40, damping: 15 }}
              style={{ transformOrigin: "85% 15%" }}
            >
              <svg viewBox="0 0 200 300" fill="none" className="w-full h-full drop-shadow-2xl">
                 {/* Arm Base */}
                 <circle cx="170" cy="50" r="25" fill="#16161f" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                 <circle cx="170" cy="50" r="12" fill="#0d0d14" />
                 
                 {/* Arm Body */}
                 <path d="M170 50 L40 250" stroke="#2a2a35" strokeWidth="10" strokeLinecap="round" />
                 <path d="M170 50 L40 250" stroke="rgba(255,255,255,0.05)" strokeWidth="4" strokeLinecap="round" transform="translate(2,0)" />
                 
                 {/* Needle Head */}
                 <rect x="25" y="240" width="30" height="45" rx="4" fill="#111119" stroke="rgba(255,255,255,0.1)" />
                 <path d="M40 285 L40 295" stroke="#ccc" strokeWidth="2" />
              </svg>
            </motion.div>

            {/* Ambient Glow behind disc */}
            <div className="absolute inset-0 bg-[var(--acc)]/20 blur-[100px] rounded-full z-[-1] opacity-40 animate-pulse" />
          </div>
        </div>

        {/* Info & Essential Controls */}
        <div className="mt-auto space-y-8">
          {/* Song Title & Artist */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-6">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight truncate mb-2"
              >
                {currentTrack.title}
              </motion.h1>
              <p className="text-[16px] md:text-xl font-bold text-[var(--t2)] tracking-tight">{currentTrack.artist}</p>
            </div>
            <button 
              onClick={() => toggleLike(currentTrack.id)}
              className={`w-14 h-14 flex items-center justify-center rounded-full transition-all border ${isLiked ? 'bg-[var(--acc-pink)]/10 border-[var(--acc-pink)]/20 text-[var(--acc-pink)]' : 'bg-white/5 border-white/10 text-[var(--t3)] hover:text-white'}`}
            >
              <Heart size={28} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Progress Bar Area */}
          <div className="space-y-3">
             <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden cursor-pointer group">
                <input 
                  type="range" min="0" max="100" step="0.1" value={localProgress}
                  onMouseDown={() => setIsDragging(true)}
                  onTouchStart={() => setIsDragging(true)}
                  onChange={(e) => setLocalProgress(parseFloat(e.target.value))}
                  onMouseUp={() => { setIsDragging(false); seekTo((localProgress / 100) * currentTrack.duration); }}
                  onTouchEnd={() => { setIsDragging(false); seekTo((localProgress / 100) * currentTrack.duration); }}
                  className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                />
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-[var(--acc)] to-[var(--acc-light)] transition-all duration-150"
                  style={{ width: `${localProgress}%` }}
                />
             </div>
             <div className="flex justify-between text-[11px] font-mono font-bold text-[var(--t3)] tracking-widest">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(currentTrack.duration)}</span>
             </div>
          </div>

          {/* Main Controls Row */}
          <div className="flex items-center justify-between pb-8">
            <button onClick={toggleShuffle} className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${shuffle ? 'text-[var(--acc)] bg-[var(--acc)]/10' : 'text-[var(--t3)] hover:text-white'}`}>
              <Shuffle size={20} />
            </button>
            <div className="flex items-center gap-6 md:gap-10">
              <button 
                onClick={prevTrack}
                className="text-white/60 hover:text-white active:scale-90 transition-all"
              >
                <SkipBack size={32} fill="currentColor" />
              </button>
              <button 
                onClick={togglePlay}
                className="w-20 h-20 md:w-24 md:h-24 rounded-[32px] bg-white text-black flex items-center justify-center shadow-[0_15px_40px_rgba(255,255,255,0.2)] active:scale-95 transition-all"
              >
                {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
              </button>
              <button 
                onClick={nextTrack}
                className="text-white/60 hover:text-white active:scale-90 transition-all"
              >
                <SkipForward size={32} fill="currentColor" />
              </button>
            </div>
            <button onClick={cycleRepeat} className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${repeatMode !== 'off' ? 'text-[var(--acc)] bg-[var(--acc)]/10' : 'text-[var(--t3)] hover:text-white'}`}>
              {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
            </button>
          </div>

          {/* Bottom Utility Row */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
             <div className="flex items-center gap-4">
               <button onClick={() => setVolume(0)} className="text-[var(--t3)] hover:text-white transition-colors">
                  {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
               </button>
               <input 
                 type="range" min="0" max="1" step="0.01" value={volume} 
                 onChange={(e) => setVolume(parseFloat(e.target.value))}
                 className="w-20 md:w-32 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
               />
             </div>
             <div className="flex items-center gap-6">
                <button 
                  onClick={() => setShowQueue(!showQueue)}
                  className={`text-[var(--t3)] hover:text-white transition-all ${showQueue ? 'text-[var(--acc)]' : ''}`}
                >
                  <ListMusic size={22} />
                </button>
                <button className="text-[var(--t3)] hover:text-white">
                  <Share2 size={22} />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Queue Modal - Simplified Glass version */}
      <AnimatePresence>
        {showQueue && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[600] flex flex-col md:max-w-md md:ml-auto"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setShowQueue(false)} />
            <div className="relative mt-20 flex-1 bg-[#111119] rounded-t-[40px] border-t border-white/10 shadow-2xl flex flex-col overflow-hidden">
               <div className="h-1.5 w-12 bg-white/10 rounded-full mx-auto mt-4 mb-6" />
               <div className="px-8 flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-white">Next Up</h3>
                  <button onClick={() => setShowQueue(false)} className="text-[var(--t3)] hover:text-white"><X size={24} /></button>
               </div>
               <div className="flex-1 overflow-y-auto px-6 space-y-2 pb-10 scrollbar-hide">
                 {queue.map((track, i) => (
                   <div 
                      key={track.id + i}
                      onClick={() => playTrackFromList(track, queue)}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={track.cover} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-bold text-white truncate">{track.title}</p>
                        <p className="text-[12px] text-[var(--t2)] truncate">{track.artist}</p>
                      </div>
                      {currentTrack.id === track.id && <div className="w-1.5 h-1.5 rounded-full bg-[var(--acc)] shadow-[0_0_8px_var(--acc)]" />}
                   </div>
                 ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
