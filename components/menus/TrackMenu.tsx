'use client';
import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, ListPlus, Share2, User, ChevronRight, Check } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { Track } from '@/lib/tracks';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  track: Track;
  playlistId?: string;
}

export function TrackMenu({ track, playlistId }: Props) {
  const [open, setOpen] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const { addToQueue, playlists, addTrackToPlaylist, removeTrackFromPlaylist } = usePlayerStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
        setShowPlaylists(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://youtube.com/watch?v=${track.videoId}`);
    setOpen(false);
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track);
    setOpen(false);
  };

  const handleAddPlaylist = (e: React.MouseEvent, pId: string) => {
    e.stopPropagation();
    addTrackToPlaylist(pId, track);
    setOpen(false);
    setShowPlaylists(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); setShowPlaylists(false); }}
        className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[var(--t3)] hover:text-white transition-all active:scale-90"
      >
        <MoreHorizontal size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 top-full mt-2 w-56 bg-[#16161f]/95 backdrop-blur-3xl border border-white/10 rounded-[28px] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {!showPlaylists ? (
              <div className="space-y-0.5">
                {playlistId && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTrackFromPlaylist(playlistId, track.id);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-bold text-red-400 hover:bg-red-400/10 rounded-2xl transition-all"
                  >
                    <ListPlus className="rotate-45" size={18} /> Remove from playlist
                  </button>
                )}
                <button 
                  className="w-full flex items-center justify-between px-4 py-3 text-[14px] font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-2xl transition-all group"
                  onClick={(e) => { e.stopPropagation(); setShowPlaylists(true); }}
                >
                  <div className="flex items-center gap-3">
                    <ListPlus size={18} /> Add to playlist
                  </div>
                  <ChevronRight size={16} className="text-white/20 group-hover:text-white/40 transition-colors" />
                </button>
                <button 
                  onClick={handleAddToQueue}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                >
                  <ListPlus size={18} /> Add to queue
                </button>
                <button 
                  onClick={handleShare}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                >
                  <Share2 size={18} /> Copy YouTube Link
                </button>
                <div className="h-px bg-white/5 my-2 mx-2" />
                <button 
                  disabled
                  className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-bold text-white/30 rounded-2xl cursor-not-allowed"
                >
                  <User size={18} /> View Artist
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-black text-[var(--t3)] hover:text-white transition-colors mb-1 border-b border-white/5"
                  onClick={(e) => { e.stopPropagation(); setShowPlaylists(false); }}
                >
                  ‹ Back to options
                </button>
                <div className="max-h-48 overflow-y-auto px-1 py-1 space-y-0.5 scrollbar-hide font-bold">
                  {playlists.length === 0 ? (
                    <div className="px-4 py-8 text-[12px] text-white/20 text-center italic">No playlists created</div>
                  ) : (
                    playlists.map(p => (
                      <button 
                        key={p.id}
                        onClick={(e) => handleAddPlaylist(e, p.id)}
                        className="w-full flex items-center justify-between px-3 py-2.5 text-[13px] text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                      >
                        <div className="flex items-center gap-3 truncate">
                           <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                           <span className="truncate">{p.name}</span>
                        </div>
                        {p.tracks.some(t => t.id === track.id) && <Check size={14} className="text-[var(--acc)]" />}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
