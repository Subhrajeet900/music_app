'use client';

import { usePlayerStore } from '@/store/playerStore';
import { Play, Pause, SkipBack, SkipForward, Heart, Volume2, VolumeX, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { formatDuration } from '@/lib/tracks';

export function MiniPlayer() {
  const router = useRouter();
  const {
    currentTrack, isPlaying, togglePlay, nextTrack, prevTrack,
    progress, likedSongs, toggleLike, volume, setVolume, toggleMute,
    shuffle, toggleShuffle, repeatMode, cycleRepeat, currentTime, seekTo
  } = usePlayerStore();
  const [visible, setVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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
      className={`h-[72px] bg-[#161b22] border-t border-white/[0.06] flex items-center cursor-pointer relative ${visible ? 'animate-[slide-up_0.3s_ease-out]' : ''}`}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('[data-control]')) return;
        router.push('/now-playing');
      }}
    >
      {/* Left: Track info */}
      <div className="flex items-center gap-3 w-[280px] min-w-0 px-4">
        <img src={currentTrack.cover} alt={currentTrack.title} className="w-[48px] h-[48px] rounded-lg object-cover shadow-lg flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-[#e6edf3] text-sm font-medium truncate">{currentTrack.title}</p>
          <p className="text-[#7d8590] text-xs truncate">{currentTrack.artist}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleLike(currentTrack.id); }}
          className={`flex-shrink-0 transition-all ${isLiked ? 'text-[#e2a93b] animate-[like-pop_0.3s_ease-out]' : 'text-[#484f58] hover:text-[#7d8590]'}`}
        >
          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Center: Controls + Progress */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1 px-4" data-control>
        {/* Playback buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); toggleShuffle(); }}
            className={`transition-colors hidden sm:block ${shuffle ? 'text-[#e2a93b]' : 'text-[#484f58] hover:text-[#7d8590]'}`}
          >
            <Shuffle size={15} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevTrack(); }}
            className="text-[#7d8590] hover:text-[#e6edf3] transition-colors"
          >
            <SkipBack size={18} fill="currentColor" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="w-9 h-9 flex items-center justify-center bg-[#e6edf3] rounded-full text-[#0d1117] hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextTrack(); }}
            className="text-[#7d8590] hover:text-[#e6edf3] transition-colors"
          >
            <SkipForward size={18} fill="currentColor" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); cycleRepeat(); }}
            className={`transition-colors hidden sm:block ${repeatMode !== 'off' ? 'text-[#e2a93b]' : 'text-[#484f58] hover:text-[#7d8590]'}`}
          >
            {repeatMode === 'one' ? <Repeat1 size={15} /> : <Repeat size={15} />}
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 w-full max-w-[500px]" data-control>
          <span className="text-[10px] text-[#7d8590] tabular-nums w-10 text-right">{currentTimeFormatted}</span>
          <div
            ref={progressBarRef}
            className="flex-1 h-1 bg-white/[0.08] rounded-full cursor-pointer group relative"
            onClick={(e) => { e.stopPropagation(); handleProgressClick(e); }}
          >
            <div
              className="h-full bg-[#e6edf3] rounded-full relative transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#e6edf3] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
            </div>
          </div>
          <span className="text-[10px] text-[#7d8590] tabular-nums w-10">{durationFormatted}</span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="hidden md:flex items-center gap-2 w-[140px] justify-end pr-4" data-control>
        <button
          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          className="text-[#7d8590] hover:text-[#e6edf3] transition-colors"
        >
          {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <div className="relative w-[80px] h-1 bg-white/[0.08] rounded-full group cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            setVolume(fraction);
          }}
        >
          <div className="h-full bg-[#e6edf3] rounded-full" style={{ width: `${volume * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
