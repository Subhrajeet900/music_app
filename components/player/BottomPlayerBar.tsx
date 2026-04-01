'use client';
import { usePlayerStore } from '@/store/playerStore';
import { Play, Pause, SkipBack, SkipForward, Heart, Volume2, VolumeX, Shuffle, Repeat, Repeat1, ListMusic } from 'lucide-react';
import { useRef } from 'react';
import { formatDuration } from '@/lib/tracks';

export function BottomPlayerBar() {
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

  const progressBarRef = useRef<HTMLDivElement>(null);

  if (!currentTrack) return null;

  const isLiked = likedSongs.includes(currentTrack.id);
  const duration = currentTrack.duration || 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(fraction * duration);
  };

  return (
    <div className="h-[90px] bg-[#0a0a10]/95 backdrop-blur-[30px] border-t border-[var(--acc-border)] flex items-center px-4 font-sans select-none">
      {/* Left Column (30%) */}
      <div className="w-[30%] flex items-center gap-4 min-w-0">
        <div className="w-14 h-14 rounded-lg overflow-hidden shadow-lg flex-shrink-0 border border-white/10">
          <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[14px] font-bold text-white truncate">{currentTrack.title}</h4>
          <p className="text-[12px] text-[var(--t2)] truncate">{currentTrack.artist}</p>
        </div>
        <button 
          onClick={() => toggleLike(currentTrack.id)}
          className={`flex-shrink-0 transition-all ${isLiked ? 'text-[var(--acc-pink)] animate-heart-pop' : 'text-[var(--t3)] hover:text-[var(--t2)]'}`}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Center Column (40%) */}
      <div className="w-[40%] flex flex-col items-center gap-1">
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleShuffle}
            className={`transition-colors ${shuffle ? 'text-[var(--acc)]' : 'text-[var(--t3)] hover:text-[var(--t2)]'}`}
          >
            <Shuffle size={16} />
          </button>
          <button onClick={prevTrack} className="text-[var(--t2)] hover:text-white transition-colors">
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-black shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
          </button>
          <button onClick={nextTrack} className="text-[var(--t2)] hover:text-white transition-colors">
            <SkipForward size={20} fill="currentColor" />
          </button>
          <button 
            onClick={cycleRepeat}
            className={`transition-colors ${repeatMode !== 'off' ? 'text-[var(--acc)]' : 'text-[var(--t3)] hover:text-[var(--t2)]'}`}
          >
            {repeatMode === 'one' ? <Repeat1 size={17} /> : <Repeat size={17} />}
          </button>
        </div>

        {/* Progress Bar Area */}
        <div className="w-full flex items-center gap-3 px-2">
          <span className="text-[10px] text-[var(--t3)] font-mono w-10 text-right">{formatDuration(Math.floor(currentTime))}</span>
          <div 
            ref={progressBarRef}
            onClick={handleProgressClick}
            className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer group relative"
          >
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[var(--acc)] to-[var(--acc-light)] rounded-full"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-[-6px] top-[-4px] w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-[10px] text-[var(--t3)] font-mono w-10">{duration > 0 ? formatDuration(duration) : '--:--'}</span>
        </div>
      </div>

      {/* Right Column (30%) */}
      <div className="w-[30%] flex items-center justify-end gap-4">
        <button className="text-[var(--t3)] hover:text-white transition-colors">
          <ListMusic size={18} />
        </button>
        <div className="flex items-center gap-2 w-[120px]">
          <button onClick={toggleMute} className="text-[var(--t3)] hover:text-white transition-colors">
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div 
            className="flex-1 h-1 bg-white/10 rounded-full relative cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              setVolume(fraction);
            }}
          >
            <div 
              className="absolute left-0 top-0 h-full bg-white/40 group-hover:bg-[var(--acc)] rounded-full"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
