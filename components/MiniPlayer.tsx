'use client';

import { usePlayerStore } from '@/store/playerStore';
import { Play, Pause, SkipBack, SkipForward, Heart, Volume2, VolumeX, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { formatDuration } from '@/lib/tracks';

export function MiniPlayer() {
  const router = useRouter();
  const currentTrack = usePlayerStore(state => state.currentTrack);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const togglePlay = usePlayerStore(state => state.togglePlay);
  const nextTrack = usePlayerStore(state => state.nextTrack);
  const prevTrack = usePlayerStore(state => state.prevTrack);
  const progress = usePlayerStore(state => state.progress);
  const likedSongs = usePlayerStore(state => state.likedSongs);
  const toggleLike = usePlayerStore(state => state.toggleLike);
  const volume = usePlayerStore(state => state.volume);
  const setVolume = usePlayerStore(state => state.setVolume);
  const toggleMute = usePlayerStore(state => state.toggleMute);
  const shuffle = usePlayerStore(state => state.shuffle);
  const toggleShuffle = usePlayerStore(state => state.toggleShuffle);
  const repeatMode = usePlayerStore(state => state.repeatMode);
  const cycleRepeat = usePlayerStore(state => state.cycleRepeat);
  const currentTime = usePlayerStore(state => state.currentTime);
  const seekTo = usePlayerStore(state => state.seekTo);
  
  const [visible, setVisible] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentTrack && !visible) {
      setVisible(true);
    }
  }, [currentTrack, visible]);

  if (!currentTrack) return null;

  const isLiked = likedSongs.includes(currentTrack.id);
  const duration = currentTrack.duration || 0;
  const currentTimeFormatted = formatDuration(Math.floor(currentTime));
  const durationFormatted = duration > 0 ? formatDuration(duration) : '--:--';

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(fraction * duration);
  };

  return (
    <div
      className={`h-[70px] glass-card rounded-[16px] flex items-center px-3 cursor-pointer relative font-sans shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${visible ? 'animate-[slide-up_0.3s_ease-out]' : ''}`}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('button')) return;
        router.push('/now-playing');
      }}
    >
      {/* Progress Line (Top edge) */}
      <div className="absolute top-0 left-[16px] right-[16px] h-[2px] bg-white/5 overflow-hidden rounded-full">
        <div 
          className="h-full bg-white/40 transition-[width] duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Left: Track info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-[44px] h-[44px] rounded-lg overflow-hidden flex-shrink-0 shadow-md">
          <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-[14px] font-bold truncate leading-tight">{currentTrack.title}</p>
          <p className="text-[var(--t2)] text-[12px] truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1.5 ml-2">
        <button
          onClick={(e) => { e.stopPropagation(); toggleLike(currentTrack.id); }}
          className={`w-10 h-10 flex items-center justify-center transition-all ${isLiked ? 'text-[var(--acc-pink)]' : 'text-[var(--t3)]'}`}
        >
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className="w-10 h-10 flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-0.5" />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); nextTrack(); }}
          className="w-10 h-10 flex items-center justify-center text-[var(--t2)] active:scale-90 transition-transform"
        >
          <SkipForward size={22} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
