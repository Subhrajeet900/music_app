'use client';
import { usePlayerStore } from '@/store/playerStore';
import { formatDuration } from '@/lib/tracks';
import { Play, Heart, Disc3, Shuffle, ChevronLeft, MoreHorizontal, Clock, Music2 } from 'lucide-react';
import { TrackMenu } from '@/components/menus/TrackMenu';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function PlaylistPage() {
  const { id } = useParams();
  const router = useRouter();
  const playlists = usePlayerStore(state => state.playlists);
  const playTrackFromList = usePlayerStore(state => state.playTrackFromList);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const currentTrack = usePlayerStore(state => state.currentTrack);
  const likedSongs = usePlayerStore(state => state.likedSongs);
  const toggleLike = usePlayerStore(state => state.toggleLike);

  const playlist = playlists.find(p => p.id === id);

  if (!playlist) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 bg-[#050508]">
        <Disc3 size={64} className="text-[var(--t3)] mb-4 animate-pulse" />
        <h2 className="text-white font-black text-2xl mb-2">Playlist Not Found</h2>
        <button onClick={() => router.push('/')} className="text-[var(--acc)] font-bold hover:underline">Go back home</button>
      </div>
    );
  }

  const totalDuration = playlist.tracks.reduce((acc, t) => acc + t.duration, 0);

  return (
    <div className="flex-1 relative flex flex-col min-h-full pb-32 animate-page-enter">
      {/* Dynamic Background Haze */}
      <div 
        className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none z-0 overflow-hidden"
        style={{ 
          background: `linear-gradient(180deg, ${playlist.color}30 0%, transparent 100%)`
        }}
      >
         <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20" style={{ backgroundColor: playlist.color }} />
      </div>

      <div className="relative z-10 p-6 md:p-10 lg:p-14">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-12">
          {/* Playlist Cover Art */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-56 h-56 md:w-64 md:h-64 rounded-[48px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 relative group"
            style={{ backgroundColor: playlist.color }}
          >
             <div className="absolute inset-0 flex items-center justify-center text-white/20">
                <Music2 size={100} strokeWidth={1} />
             </div>
             {/* Surface Shine */}
             <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
          </motion.div>

          <div className="flex-1 text-center md:text-left space-y-4">
             <div className="inline-flex items-center px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-[var(--t3)] uppercase tracking-[0.2em] mb-2">
                Playlist Collection
             </div>
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.95] drop-shadow-2xl">
               {playlist.name}
             </h1>
             <p className="text-[var(--t2)] text-base md:text-lg font-medium opacity-60 leading-relaxed max-w-2xl mx-auto md:mx-0">
               {playlist.description || "A curated journey through the neon haze. Immerse yourself in the smoke."}
             </p>
             <div className="flex items-center justify-center md:justify-start gap-4 text-[13px] font-mono font-bold text-[var(--t3)] tracking-widest text-white/40">
                <span className="flex items-center gap-1.5 text-white/60"><Disc3 size={14} /> {playlist.tracks.length} Tracks</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                <span className="flex items-center gap-1.5 text-white/50 lowercase"><Clock size={14} /> {Math.floor(totalDuration / 60)} min {totalDuration % 60} sec</span>
             </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-6 mb-12 pb-8 border-b border-white/5 mx-2">
          <button 
            onClick={() => playlist.tracks.length > 0 && playTrackFromList(playlist.tracks[0], playlist.tracks)}
            className="w-16 h-16 bg-white text-black rounded-3xl flex items-center justify-center shadow-[0_15px_30px_rgba(255,255,255,0.15)] active:scale-95 transition-all group"
          >
            <Play size={28} fill="currentColor" className="ml-1" />
          </button>
          <button 
            onClick={() => {
              const shuffled = [...playlist.tracks].sort(() => Math.random() - 0.5);
              playTrackFromList(shuffled[0], shuffled);
            }}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all active:scale-90"
          >
            <Shuffle size={20} />
          </button>
          <div className="flex-1" />
          <button className="p-3 text-white/20 hover:text-white transition-colors">
            <MoreHorizontal size={24} />
          </button>
        </div>

        {/* Tracks List */}
        {playlist.tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center mb-6">
              <Disc3 size={40} className="text-[var(--t3)] opacity-40" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Wait, it&apos;s empty!</h3>
            <p className="text-[var(--t2)] text-sm mb-8 opacity-60">Start adding sounds to this collection from Home or Search.</p>
            <button 
              onClick={() => router.push('/search')}
              className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all"
            >
              Browse Tracks
            </button>
          </div>
        ) : (
          <div className="space-y-1 md:space-y-0.5">
            {/* List Header Desktop */}
            <div className="hidden md:grid grid-cols-[40px_1fr_1fr_100px_48px] gap-6 px-5 py-3 mb-4 text-[10px] font-black tracking-[0.2em] text-[var(--t3)] uppercase border-white/5">
              <span>#</span>
              <span>Title / Artist</span>
              <span>Album Context</span>
              <span className="text-right">Time</span>
              <span></span>
            </div>

            {playlist.tracks.map((track, i) => {
              const liked = likedSongs.includes(track.id);
              const isCurrentlyPlaying = currentTrack?.id === track.id;

              return (
                <div 
                  key={track.id + i}
                  onClick={() => playTrackFromList(track, playlist.tracks)}
                  className={`group grid grid-cols-[40px_1fr_48px] md:grid-cols-[40px_1fr_1fr_100px_48px] gap-6 px-4 md:px-5 py-3.5 items-center cursor-pointer rounded-2xl md:rounded-3xl hover:bg-white/5 transition-all border border-transparent ${isCurrentlyPlaying ? 'bg-white/[0.08] border-white/10' : ''}`}
                >
                  <div className="w-6 flex items-center justify-center text-sm font-mono font-bold text-[var(--t3)]">
                    {isCurrentlyPlaying && isPlaying ? (
                       <span className="flex items-end gap-[2px] h-3.5">
                         <div className="w-[3px] bg-[var(--acc)] animate-[eqBar1_0.8s_ease-in-out_infinite]" />
                         <div className="w-[3px] bg-[var(--acc)] animate-[eqBar2_0.9s_ease-in-out_infinite]" />
                         <div className="w-[3px] bg-[var(--acc)] animate-[eqBar3_0.7s_ease-in-out_infinite]" />
                       </span>
                    ) : (isCurrentlyPlaying ? <Play size={14} fill="currentColor" className="text-[var(--acc)]" /> : i + 1)}
                  </div>

                  <div className="flex items-center gap-4 min-w-0 pr-4">
                    <img src={track.cover} className="w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover shadow-lg bg-[var(--s2)]" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-[15px] md:text-[17px] font-bold truncate ${isCurrentlyPlaying ? 'text-[var(--acc)]' : 'text-white'}`}>{track.title}</p>
                      <p className="text-[12px] md:text-[14px] text-[var(--t2)] font-medium truncate">{track.artist}</p>
                    </div>
                  </div>

                  <span className="text-[13px] text-[var(--t2)] font-medium truncate hidden md:block opacity-60">MoodTunes Mix</span>

                  <span className="text-right text-[13px] font-mono font-bold text-[var(--t3)] tabular-nums hidden md:block">{formatDuration(track.duration)}</span>

                  <div className="flex items-center justify-end gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }}
                      className={`text-[var(--acc-pink)] hover:scale-110 active:scale-95 transition-all ${!liked && 'grayscale opacity-40'}`}
                    >
                      <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                    </button>
                    <TrackMenu track={track} playlistId={playlist.id} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
