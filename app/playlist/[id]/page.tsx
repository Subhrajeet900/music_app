'use client';
import { usePlayerStore } from '@/store/playerStore';
import { formatDuration } from '@/lib/tracks';
import { Play, Heart, Disc3, Shuffle } from 'lucide-react';
import { TrackMenu } from '@/components/menus/TrackMenu';
import { useParams, useRouter } from 'next/navigation';

export default function PlaylistPage() {
  const { id } = useParams();
  const router = useRouter();
  const { playlists, playTrackFromList, isPlaying, currentTrack, likedSongs, toggleLike, setQueue, togglePlay, setTrack } = usePlayerStore();

  const playlist = playlists.find(p => p.id === id);

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center p-20 animate-page-enter">
        <Disc3 size={48} className="text-[#4a5058] mb-4" />
        <h2 className="text-[#f0f2f4] font-bold text-xl mb-2">Playlist not found</h2>
        <button onClick={() => router.push('/')} className="text-[#acc-soft] hover:text-[#f0f2f4] text-sm underline">Go back home</button>
      </div>
    );
  }

  const totalDuration = playlist.tracks.reduce((acc, t) => acc + t.duration, 0);

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      if (currentTrack && playlist.tracks.find(t => t.id === currentTrack.id) && isPlaying) {
        // already playing something from here
      } else {
        playTrackFromList(playlist.tracks[0], playlist.tracks);
      }
    }
  };

  const handleShuffle = () => {
    if (playlist.tracks.length > 0) {
      const shuffled = [...playlist.tracks].sort(() => Math.random() - 0.5);
      usePlayerStore.getState().toggleShuffle();
      playTrackFromList(shuffled[0], shuffled);
    }
  };

  return (
    <div className="p-5 md:p-8 animate-page-enter pb-32">
      {/* Header */}
      <div className="flex items-end gap-6 mb-10">
        <div 
          className="w-40 h-40 rounded-xl shadow-2xl flex-shrink-0 animate-slide-up-fast"
          style={{ background: playlist.color }}
        />
        <div className="animate-slide-up-fast" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#9098a0] uppercase mb-2 block">Playlist</span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#f0f2f4] tracking-tight mb-3 font-sans truncate max-w-2xl">{playlist.name}</h1>
          <p className="text-[#9098a0] text-sm mb-4 max-w-xl line-clamp-2">{playlist.description}</p>
          <div className="flex items-center gap-2 text-sm text-[#4a5058] font-medium">
            <span>{playlist.tracks.length} songs</span>
            {playlist.tracks.length > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-[#4a5058]" />
                <span>{formatDuration(totalDuration)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {playlist.tracks.length > 0 && (
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={handlePlayAll}
            className="w-14 h-14 bg-[var(--acc)] rounded-full flex items-center justify-center text-[var(--bg)] shadow-[0_0_20px_var(--acc-dim)] hover:scale-105 active:scale-95 transition-all group"
          >
            <Play size={24} fill="currentColor" className="ml-1 group-hover:drop-shadow-md" />
          </button>
          
          <button 
            onClick={handleShuffle}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#c8cdd4] hover:bg-[#262a2f] hover:text-[#f0f2f4] transition-all"
            title="Shuffle play"
          >
            <Shuffle size={20} />
          </button>
        </div>
      )}

      {/* Tracks Table */}
      {playlist.tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-slide-up-fast" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <div className="w-16 h-16 bg-[#1b1e22] rounded-full flex items-center justify-center mb-4">
            <Disc3 size={32} className="text-[#4a5058]" />
          </div>
          <h3 className="text-lg font-bold text-[#f0f2f4] mb-2 font-sans">Let's find some songs for your playlist</h3>
          <p className="text-[#9098a0] text-sm max-w-md">
            Click the ⋯ menu on any track in Home or Library to add it here.
          </p>
        </div>
      ) : (
        <div className="animate-slide-up-fast" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <div className="hidden md:grid grid-cols-[32px_48px_1fr_1fr_70px_32px_32px] gap-3 px-3 py-2 text-[#4a5058] text-[10px] font-bold uppercase tracking-[0.15em] border-b border-[var(--acc-glow)] mb-2">
            <span className="text-right">#</span>
            <span></span>
            <span>Title</span>
            <span>Artist</span>
            <span className="text-right">Duration</span>
            <span></span>
            <span></span>
          </div>

          <div className="space-y-1">
            {playlist.tracks.map((track, i) => {
              const liked = likedSongs.includes(track.id);
              const isCurrentlyPlaying = currentTrack?.id === track.id;

              return (
                <div 
                  key={track.id + '-' + i}
                  onClick={() => playTrackFromList(track, playlist.tracks)}
                  className={`grid grid-cols-[32px_48px_1fr_70px_32px] md:grid-cols-[32px_48px_1fr_1fr_70px_32px_32px] gap-3 px-3 py-2 items-center cursor-pointer rounded-lg transition-colors hover:bg-[var(--acc-glow)] group hover-card-anim ${isCurrentlyPlaying ? 'bg-[var(--playing)] border flex-auto border-[var(--acc-border)]' : ''}`}
                >
                  <span className={`text-right text-sm tabular-nums font-mono ${isCurrentlyPlaying ? 'text-[var(--acc)]' : 'text-[#4a5058]'}`}>
                    {isCurrentlyPlaying && isPlaying ? (
                       <span className="flex items-end justify-end h-3 gap-0.5">
                         <span className="w-[3px] bg-[var(--acc)] animate-[eqBar1_0.8s_ease-in-out_infinite]" />
                         <span className="w-[3px] bg-[var(--acc)] animate-[eqBar2_0.9s_ease-in-out_infinite]" />
                         <span className="w-[3px] bg-[var(--acc)] animate-[eqBar3_0.7s_ease-in-out_infinite]" />
                       </span>
                    ) : (isCurrentlyPlaying ? '♪' : i + 1)}
                  </span>

                  <div className="w-10 h-10 rounded overflow-hidden relative bg-[#1b1e22]">
                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play size={14} fill="white" className="text-white ml-0.5" />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className={`text-[16px] font-bold font-sans truncate ${isCurrentlyPlaying ? 'text-[var(--acc)]' : 'text-[#f0f2f4]'}`}>{track.title}</p>
                    <p className="text-[13px] text-[#9098a0] truncate md:hidden">{track.artist}</p>
                  </div>

                  <span className="text-[13px] text-[#9098a0] truncate hidden md:block">{track.artist}</span>

                  <span className="text-[13px] text-[#9098a0] text-right font-mono">{track.duration > 0 ? formatDuration(track.duration) : '--:--'}</span>

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }}
                    className={`flex items-center justify-center transition-all ${liked ? 'text-[var(--acc)] animate-heart-pop' : 'text-[#4a5058] opacity-0 group-hover:opacity-100 hover:text-[var(--acc-soft)]'}`}
                  >
                    <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                  </button>

                  <TrackMenu track={track} playlistId={playlist.id} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
