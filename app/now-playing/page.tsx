'use client';

import { usePlayerStore } from '@/store/playerStore';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Volume1, Shuffle, Repeat, Repeat1, Heart, Share2, MoreHorizontal, ArrowLeft, Mic2, ListMusic, X, Copy, Link2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDuration } from '@/lib/tracks';
import { getVideoDetails } from '@/lib/youtubeApi';

export default function NowPlayingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    currentTrack, isPlaying, togglePlay, nextTrack, prevTrack,
    progress, setProgress, volume, setVolume, toggleMute,
    shuffle, toggleShuffle, repeatMode, cycleRepeat,
    likedSongs, toggleLike, queue, showQueue,
    setShowQueue, playTrackFromList, setCurrentTime,
    currentTime, clearQueue, seekTo, playlists, addTrackToPlaylist
  } = usePlayerStore();

  const [localProgress, setLocalProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id && (!currentTrack || currentTrack.id !== id)) {
      const queueTrack = queue.find(t => t.id === id);
      if (queueTrack) {
        playTrackFromList(queueTrack, queue);
      } else {
        getVideoDetails([id]).then(tracks => {
          if (tracks.length > 0) playTrackFromList(tracks[0], tracks);
        }).catch(console.error);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isDragging) setLocalProgress(progress);
  }, [progress, isDragging]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalProgress(parseFloat(e.target.value));
  };

  const handleSeekEnd = () => {
    setIsDragging(false);
    setProgress(localProgress);
    if (currentTrack && currentTrack.duration > 0) {
      const seekSeconds = (localProgress / 100) * currentTrack.duration;
      setCurrentTime(seekSeconds);
      seekTo(seekSeconds);
    }
  };

  const formatTime = (percent: number, totalSeconds: number) => {
    const s = Math.floor((percent / 100) * totalSeconds);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={20} />;
    if (volume < 0.5) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  if (!currentTrack) {
    return (
      <div className="min-h-full flex items-center justify-center bg-[#161b22]">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#1c2333] rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic2 size={32} className="text-[#7d8590]" />
          </div>
          <p className="text-[#7d8590]">Select a song to start playing</p>
        </div>
      </div>
    );
  }

  const isLiked = likedSongs.includes(currentTrack.id);

  return (
    <div className="relative min-h-full w-full flex flex-col overflow-hidden">
      {/* Gradient Background */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: `linear-gradient(180deg, ${currentTrack.dominantColor}40 0%, #161b22 50%, #0d1117 100%)`
        }}
      />

      {/* Animated Particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: `${4 + Math.random() * 6}px`,
            height: `${4 + Math.random() * 6}px`,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 60}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
          }}
        />
      ))}

      <div className="relative z-10 flex-1 flex flex-col w-full max-w-2xl mx-auto px-6 pb-6">
        {/* Top Header */}
        <div className="flex items-center justify-between py-4">
          <button onClick={() => router.back()} className="text-[#7d8590] hover:text-[#e6edf3] transition-colors">
            <ArrowLeft size={24} />
          </button>
          <span className="text-xs text-[#7d8590] uppercase tracking-widest font-medium">Now Playing</span>
          <div className="relative">
            <button onClick={() => { setShowMenu(!showMenu); setShowPlaylists(false); }} className="text-[#7d8590] hover:text-[#e6edf3] transition-colors">
              <MoreHorizontal size={24} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#1c2333] rounded-xl shadow-2xl border border-white/[0.06] py-1.5 z-50 animate-[fade-in_0.15s_ease-out]">
                {!showPlaylists ? (
                  <>
                    <button onClick={() => { setShowPlaylists(true); }} className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.04]">
                      <div className="flex items-center gap-2.5">
                        <ListMusic size={14} /> Add to Playlist
                      </div>
                      <span>›</span>
                    </button>
                    <button onClick={() => { usePlayerStore.getState().addToQueue(currentTrack); setShowMenu(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.04]">
                      <ListMusic size={14} /> Add to Queue
                    </button>
                    <button onClick={() => { setShowMenu(false); setShowShareModal(true); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.04]">
                      <Share2 size={14} /> Share
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#9098A0] hover:text-[#f0f2f4] hover:bg-white/[0.04] transition-colors mb-1 border-b border-white/[0.06]"
                      onClick={(e) => { e.stopPropagation(); setShowPlaylists(false); }}
                    >
                      ‹ Back
                    </button>
                    {playlists.length === 0 ? (
                      <div className="px-4 py-3 text-[12px] text-[#484f58] text-center">No playlists yet</div>
                    ) : (
                      <div className="max-h-48 overflow-y-auto scrollbar-hide">
                        {playlists.map(p => (
                          <button 
                            key={p.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              addTrackToPlaylist(p.id, currentTrack);
                              setShowMenu(false);
                              setShowPlaylists(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#9098A0] hover:text-[#f0f2f4] hover:bg-white/[0.04] transition-colors truncate"
                          >
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                            <span className="truncate">{p.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Rotating Vinyl Disc */}
        <div className="flex-1 flex items-center justify-center py-6">
          <div className="relative">
            <div
              className="vinyl-disc w-[220px] h-[220px] md:w-[300px] md:h-[300px]"
              style={{
                animation: 'spin 4s linear infinite',
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover rounded-full" />
              <div className="vinyl-spindle" />
            </div>
            <div className="absolute inset-[-4px] rounded-full border-2 border-[#e2a93b]/20 pointer-events-none" />
          </div>
        </div>

        {/* Song Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 min-w-0 pr-4">
            <h1 className="text-xl md:text-2xl font-bold text-[#e6edf3] truncate">{currentTrack.title}</h1>
            <p className="text-[#7d8590] text-sm cursor-pointer hover:text-[#e2a93b] transition-colors">{currentTrack.artist}</p>
          </div>
          <button
            onClick={() => toggleLike(currentTrack.id)}
            className={`transition-all ${isLiked ? 'text-[#e2a93b] animate-[like-pop_0.3s_ease-out]' : 'text-[#7d8590] hover:text-[#e6edf3]'}`}
          >
            <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="relative w-full h-1.5 bg-white/[0.08] rounded-full cursor-pointer group">
            <input
              type="range" min="0" max="100" step="0.1" value={localProgress}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              onChange={handleSeek}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="absolute left-0 top-0 bottom-0 bg-[#e2a93b] rounded-full pointer-events-none transition-all" style={{ width: `${localProgress}%` }} />
            <div className="absolute w-3 h-3 bg-[#e6edf3] rounded-full opacity-0 group-hover:opacity-100 shadow-md pointer-events-none -ml-1.5 top-1/2 -translate-y-1/2" style={{ left: `${localProgress}%` }} />
          </div>
          <div className="flex justify-between mt-1.5 text-[11px] text-[#7d8590]">
            <span>{currentTrack.duration > 0 ? formatTime(localProgress, currentTrack.duration) : formatDuration(Math.floor(currentTime))}</span>
            <span>{currentTrack.duration > 0 ? formatDuration(currentTrack.duration) : '--:--'}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={toggleShuffle} className={`transition-colors ${shuffle ? 'text-[#e2a93b]' : 'text-[#7d8590] hover:text-[#e6edf3]'}`}>
            <Shuffle size={20} />
          </button>
          <button onClick={prevTrack} className="text-[#e6edf3] hover:scale-110 transition-transform">
            <SkipBack size={28} fill="currentColor" />
          </button>
          <button
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-[#e2a93b] text-[#0d1117] hover:bg-[#c9952f] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#e2a93b]/30"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={nextTrack} className="text-[#e6edf3] hover:scale-110 transition-transform">
            <SkipForward size={28} fill="currentColor" />
          </button>
          <button onClick={cycleRepeat} className={`transition-colors relative ${repeatMode !== 'off' ? 'text-[#e2a93b]' : 'text-[#7d8590] hover:text-[#e6edf3]'}`}>
            {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
            {repeatMode !== 'off' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#e2a93b] rounded-full" />}
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={toggleMute} className="text-[#7d8590] hover:text-[#e6edf3] transition-colors">
            {getVolumeIcon()}
          </button>
          <div className="relative flex-1 h-1 bg-white/[0.08] rounded-full cursor-pointer group max-w-[200px]">
            <input
              type="range" min="0" max="1" step="0.01" value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="absolute left-0 top-0 bottom-0 bg-[#e6edf3] group-hover:bg-[#e2a93b] rounded-full pointer-events-none transition-colors" style={{ width: `${volume * 100}%` }} />
            <div className="absolute w-3 h-3 bg-[#e6edf3] rounded-full opacity-0 group-hover:opacity-100 shadow-md pointer-events-none -ml-1.5 top-1/2 -translate-y-1/2" style={{ left: `${volume * 100}%` }} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between text-[#7d8590]">
          <button onClick={() => setShowQueue(!showQueue)} className={`hover:text-[#e6edf3] transition-colors ${showQueue ? 'text-[#e2a93b]' : ''}`}>
            <ListMusic size={20} />
          </button>
          <button onClick={() => setShowShareModal(true)} className="hover:text-[#e6edf3] transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Queue Panel */}
      {showQueue && (
        <div className="fixed inset-0 z-[600] flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowQueue(false)} />
          <div className="ml-auto relative w-full max-w-sm h-full bg-[#161b22] p-6 animate-[slide-right_0.3s_ease-out] overflow-hidden flex flex-col border-l border-white/[0.06]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#e6edf3]">Next Up</h3>
              <div className="flex items-center gap-3">
                <button onClick={clearQueue} className="text-xs text-[#7d8590] hover:text-[#e6edf3] transition-colors">Clear Queue</button>
                <button onClick={() => setShowQueue(false)} className="text-[#7d8590] hover:text-[#e6edf3] transition-colors">
                  <X size={22} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {queue.length === 0 ? (
                <p className="text-[#7d8590] text-sm">Queue is empty</p>
              ) : (
                queue.map((track) => (
                  <div
                    key={track.id}
                    onClick={() => { playTrackFromList(track, queue); }}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/[0.03] transition-colors ${currentTrack?.id === track.id ? 'bg-[#e2a93b]/[0.08]' : ''}`}
                  >
                    <img src={track.cover} alt={track.title} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#e6edf3] truncate font-medium">{track.title}</p>
                      <p className="text-xs text-[#7d8590] truncate">{track.artist}</p>
                    </div>
                    <span className="text-xs text-[#7d8590]">{track.duration > 0 ? formatDuration(track.duration) : ''}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowShareModal(false)}>
          <div className="bg-[#161b22] w-full max-w-sm mx-4 p-6 rounded-2xl border border-white/[0.06] shadow-2xl animate-[fade-in_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#e6edf3]">Share</h3>
              <button onClick={() => setShowShareModal(false)} className="text-[#484f58] hover:text-[#e6edf3]">
                <X size={20} />
              </button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#1c2333] rounded-lg mb-4">
              <img src={currentTrack.cover} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div className="min-w-0">
                <p className="text-[#e6edf3] text-sm font-medium truncate">{currentTrack.title}</p>
                <p className="text-[#7d8590] text-xs truncate">{currentTrack.artist}</p>
              </div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://youtube.com/watch?v=${currentTrack.videoId}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1c2333] hover:bg-[#252d3a] rounded-xl text-[#e6edf3] text-sm font-medium transition-colors"
            >
              {copied ? <><Copy size={16} /> Copied!</> : <><Link2 size={16} /> Copy YouTube Link</>}
            </button>
          </div>
        </div>
      )}

      {showMenu && <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />}
    </div>
  );
}
