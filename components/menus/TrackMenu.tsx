'use client';
import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, ListPlus, Share2, User } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { Track } from '@/lib/tracks';

interface Props {
  track: Track;
  playlistId?: string;
}

export function TrackMenu({ track, playlistId }: Props) {
  const [open, setOpen] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const { addToQueue, playlists, addTrackToPlaylist } = usePlayerStore();
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
    navigator.clipboard.writeText(`Check out ${track.title} by ${track.artist}`);
    alert('Link copied to clipboard (Mock Share)');
    setOpen(false);
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track);
    setOpen(false);
  };

  const handleAddPlaylist = (e: React.MouseEvent, playlistId: string) => {
    e.stopPropagation();
    addTrackToPlaylist(playlistId, track);
    setOpen(false);
    setShowPlaylists(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); setShowPlaylists(false); }}
        className="flex items-center justify-center w-[22px] h-[22px] rounded-full bg-[#1b1e22] border border-[#262a2f] text-[#9098a0] opacity-100 md:opacity-0 group-hover:opacity-100 hover:text-[#f0f2f4] transition-all hover:border-[#42474e]"
      >
        <MoreHorizontal size={14} />
      </button>

      {open && (
        <div 
          className="absolute right-0 top-full mt-1 w-48 bg-[#1b1e22] border border-[#262a2f] rounded-[10px] p-1.5 shadow-xl z-50 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {!showPlaylists ? (
            <>
              {playlistId && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    usePlayerStore.getState().removeTrackFromPlaylist(playlistId, track.id);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#f87171] hover:text-[#fca5a5] hover:bg-[#262a2f] rounded-[7px] transition-colors mb-1"
                >
                  <ListPlus className="rotate-45" size={14} /> Remove from playlist
                </button>
              )}
              <button 
                className="w-full flex items-center justify-between px-3 py-2 text-[13px] text-[#9098a0] hover:text-[#f0f2f4] hover:bg-[#262a2f] rounded-[7px] transition-colors"
                onClick={(e) => { e.stopPropagation(); setShowPlaylists(true); }}
              >
                <div className="flex items-center gap-2.5">
                  <ListPlus size={14} /> Add to playlist
                </div>
                <span>›</span>
              </button>
              <button 
                onClick={handleAddToQueue}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#9098a0] hover:text-[#f0f2f4] hover:bg-[#262a2f] rounded-[7px] transition-colors"
              >
                <ListPlus size={14} /> Add to queue
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#9098a0] hover:text-[#f0f2f4] hover:bg-[#262a2f] rounded-[7px] transition-colors"
              >
                <User size={14} /> Go to artist
              </button>
              <button 
                onClick={handleShare}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#9098a0] hover:text-[#f0f2f4] hover:bg-[#262a2f] rounded-[7px] transition-colors"
              >
                <Share2 size={14} /> Share
              </button>
            </>
          ) : (
            <>
              <button 
                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[#9098a0] hover:text-[#f0f2f4] hover:bg-[#262a2f] rounded-[7px] transition-colors mb-1 border-b border-[#262a2f]"
                onClick={(e) => { e.stopPropagation(); setShowPlaylists(false); }}
              >
                ‹ Back
              </button>
              {playlists.length === 0 ? (
                <div className="px-3 py-2 text-[12px] text-[#4a5058] text-center">No playlists yet</div>
              ) : (
                <div className="max-h-40 overflow-y-auto scrollbar-hide">
                  {playlists.map(p => (
                    <button 
                      key={p.id}
                      onClick={(e) => handleAddPlaylist(e, p.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#9098a0] hover:text-[#f0f2f4] hover:bg-[#262a2f] rounded-[7px] transition-colors truncate"
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
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
  );
}
