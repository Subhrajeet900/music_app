'use client';
import { useEffect, useState, useRef } from 'react';
import { Play, Heart, Loader2, ChevronRight, Plus, Disc3, Sparkles, TrendingUp, Music2 } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { Track, formatDuration } from '@/lib/tracks';
import { getTrendingMusic } from '@/lib/youtubeApi';
import { TrackMenu } from '@/components/menus/TrackMenu';
import { motion, AnimatePresence } from 'framer-motion';

const MOODS = [
  { id: 'all', label: 'All', emoji: '✨', color: 'var(--acc)' },
  { id: 'happy', label: 'Happy', emoji: '😊', color: '#fbbf24' },
  { id: 'relax', label: 'Relax', emoji: '🌿', color: '#10b981' },
  { id: 'focus', label: 'Focus', emoji: '🧠', color: '#3b82f6' },
  { id: 'workout', label: 'Workout', emoji: '💪', color: '#ef4444' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: '#6366f1' },
  { id: 'sleep', label: 'Sleep', emoji: '🌙', color: '#8b5cf6' },
];

const GENRES = [
  { name: 'Pop', gradient: 'from-[#ec4899] to-[#8b5cf6]' },
  { name: 'Hip-Hop', gradient: 'from-[#f59e0b] to-[#ef4444]' },
  { name: 'EDM', gradient: 'from-[#06b6d4] to-[#3b82f6]' },
  { name: 'Rock', gradient: 'from-[#64748b] to-[#0f172a]' },
  { name: 'Jazz', gradient: 'from-[#78350f] to-[#451a03]' },
  { name: 'Lofi', gradient: 'from-[#1e3a8a] to-[#1e1b4b]' },
  { name: 'Indie', gradient: 'from-[#10b981] to-[#064e3b]' },
  { name: 'Classical', gradient: 'from-[#d1d5db] to-[#4b5563]' },
];

export default function Home() {
  const playTrackFromList = usePlayerStore(state => state.playTrackFromList);
  const likedSongs = usePlayerStore(state => state.likedSongs);
  const toggleLike = usePlayerStore(state => state.toggleLike);
  const currentTrack = usePlayerStore(state => state.currentTrack);
  const isPlaying = usePlayerStore(state => state.isPlaying);

  const [loading, setLoading] = useState(true);
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [activeMood, setActiveMood] = useState('all');
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    async function loadMusic() {
      try {
        const results = await getTrendingMusic(50);
        setAllTracks(results);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    loadMusic();
  }, []);

  // Hero Rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--acc)]" size={32} />
      </div>
    );
  }

  const featured = allTracks.slice(0, 3);
  const recentlyPlayed = allTracks.slice(3, 11);
  const topCharts = allTracks.slice(11, 21);
  const discoverNew = allTracks.slice(21, 31);
  const chillPicks = allTracks.slice(31, 41);

  return (
    <div className="flex-1 space-y-12 pb-20 animate-page-enter relative">
      {/* 1. Hero Banner */}
      <section className="px-5 md:px-8 pt-6">
        <div className="relative h-[220px] md:h-[420px] w-full rounded-[32px] md:rounded-[48px] overflow-hidden group shadow-2xl border border-white/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img src={featured[heroIndex].cover} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-[#050508]/60 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent z-10" />
              
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-20 max-w-3xl pointer-events-none">
                <span className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black tracking-[0.2em] text-[var(--acc-light)] mb-4">
                  <Sparkles size={12} /> FEATURED
                </span>
                <h1 className="text-3xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter mb-4 line-clamp-2 md:drop-shadow-2xl">
                  {featured[heroIndex].title}
                </h1>
                <p className="text-lg md:text-2xl text-[var(--t2)] font-bold mb-8">— {featured[heroIndex].artist}</p>
                <div className="flex items-center gap-4 pointer-events-auto">
                  <button 
                    onClick={() => playTrackFromList(featured[heroIndex], allTracks)}
                    className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black transition-all hover:bg-[var(--acc)] active:scale-95 shadow-xl"
                  >
                    <Play size={20} fill="currentColor" /> Play Now
                  </button>
                  <button className="flex items-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-2xl font-bold transition-all hover:bg-white/20 active:scale-95">
                    <Plus size={20} /> Library
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {[0, 1, 2].map(i => (
              <div 
                key={i} 
                className={`h-1.5 transition-all duration-500 rounded-full ${heroIndex === i ? 'w-8 bg-white' : 'w-1.5 bg-white/20'}`} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Mood Selector Strip */}
      <section className="px-5 md:px-8">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-1">
          {MOODS.map(mood => (
            <button
              key={mood.id}
              onClick={() => setActiveMood(mood.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-[20px] transition-all whitespace-nowrap active:scale-95 ${
                activeMood === mood.id
                  ? 'bg-gradient-to-br text-white shadow-lg'
                  : 'bg-white/[0.04] text-[var(--t2)] border border-white/[0.05] hover:bg-white/10'
              }`}
              style={{
                background: activeMood === mood.id ? `linear-gradient(135deg, ${mood.color}, rgba(255,255,255,0.1))` : ''
              }}
            >
              <span className="text-lg">{mood.emoji}</span>
              <span className="text-[14px] font-bold tracking-tight">{mood.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Trending */}
      <section className="px-5 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] md:text-[24px] font-black text-white tracking-tight">Trending</h2>
          <button className="text-[13px] font-bold text-[var(--acc)] hover:underline">See all</button>
        </div>
        <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1">
          {recentlyPlayed.map((track, i) => (
            <div 
              key={track.id + i} 
              className="flex-shrink-0 w-[130px] md:w-[160px] group transition-all"
              onClick={() => playTrackFromList(track, recentlyPlayed)}
            >
              <div className="relative aspect-square rounded-[16px] md:rounded-[24px] overflow-hidden mb-3 bg-[#111119] border border-white/[0.03] shadow-lg group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                <img src={track.cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-2xl translate-y-4 group-hover:translate-y-0 transition-all">
                      <Play size={20} fill="currentColor" className="ml-1" />
                   </div>
                </div>
              </div>
              <h3 className="text-[14px] font-bold text-white truncate px-1 group-hover:text-[var(--acc)] transition-colors">{track.title}</h3>
              <p className="text-[12px] text-[var(--t2)] truncate px-1">{track.artist}</p>
            </div>
          ))}
        </div>
      </section>
      {/* 4. Mood Playlists - Subset */}
      <section className="px-5 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-black text-white tracking-tight">Mood Mixes</h2>
          <ChevronRight size={20} className="text-[var(--t2)]" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {MOODS.slice(1, 5).map((mood) => (
            <div 
              key={mood.id}
              className="group relative h-[180px] rounded-[24px] overflow-hidden cursor-pointer border border-white/5 active:scale-[0.98] transition-all"
              onClick={() => {
                const tracks = allTracks.filter(t => Math.random() > 0.5); // Mock mood filter
                playTrackFromList(tracks[0], tracks);
              }}
            >
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${mood.color}40, #0a0a10)` }} />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="text-3xl mb-2">{mood.emoji}</span>
                <h3 className="text-xl font-black text-white">{mood.label}</h3>
                <p className="text-[12px] text-white/60 font-bold uppercase tracking-widest mt-1">Your Daily Mix</p>
              </div>
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                <Play size={16} fill="currentColor" className="ml-0.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Top Charts */}
      <section className="px-5 md:px-8">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="text-[var(--acc)]" size={24} />
          <h2 className="text-[22px] font-black text-white tracking-tight">Top Charts This Week</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-1">
          {topCharts.map((track, i) => (
            <div 
              key={track.id}
              onClick={() => playTrackFromList(track, topCharts)}
              className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/[0.04] transition-all cursor-pointer relative overflow-hidden"
            >
              <span className="absolute left-[20%] top-1/2 -translate-y-1/2 text-[80px] font-black text-white/[0.03] italic pointer-events-none">{i + 1}</span>
              <span className="w-6 text-[14px] font-mono font-bold text-[var(--t3)] group-hover:text-white transition-colors z-10">{String(i + 1).padStart(2, '0')}</span>
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 z-10 shadow-lg border border-white/5">
                <img src={track.cover} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1 min-w-0 z-10">
                <h4 className="text-[15px] font-bold text-white truncate group-hover:text-[var(--acc-light)]">{track.title}</h4>
                <p className="text-[12px] text-[var(--t2)] truncate">{track.artist}</p>
              </div>
              <span className="text-[13px] font-mono text-[var(--t3)] group-hover:text-[var(--t2)] z-10 px-4">{formatDuration(track.duration)}</span>
              <div className="flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }} className={`${likedSongs.includes(track.id) ? 'text-[var(--acc-pink)]' : 'text-[var(--t3)]'}`}>
                  <Heart size={16} fill={likedSongs.includes(track.id) ? 'currentColor' : 'none'} />
                </button>
                <TrackMenu track={track} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Artist Spotlight */}
      <section className="px-5 md:px-8">
        <div className="relative h-[240px] md:h-[300px] w-full rounded-[40px] overflow-hidden border border-white/5 shadow-2xl group cursor-pointer"
             onClick={() => playTrackFromList(featured[2], allTracks)}>
          <img src={featured[2].cover} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt="" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-[#050508]/80 to-transparent" />
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center max-w-xl">
             <span className="inline-flex w-fit items-center px-3 py-1 rounded-full bg-[var(--acc)]/20 text-[var(--acc-light)] text-[10px] font-black tracking-widest mb-4">ARTIST SPOTLIGHT</span>
             <h2 className="text-4xl md:text-5xl font-black text-white mb-2 leading-none">{featured[2].artist}</h2>
             <p className="text-[var(--t2)] text-sm md:text-base font-medium mb-6">Explore the sounds and stories of today&apos;s most influential musical architect.</p>
             <div className="flex items-center gap-3">
               <button className="px-8 py-3 bg-[var(--acc)] text-white rounded-full font-black text-sm active:scale-95 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]">Follow Artist</button>
               <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all"><Play size={18} fill="currentColor" className="ml-0.5" /></button>
             </div>
          </div>
        </div>
      </section>

      {/* 7. New Releases */}
      <section className="px-5 md:px-8">
        <div className="flex items-center gap-3 mb-6">
          <Music2 className="text-[var(--acc-pink)]" size={24} />
          <h2 className="text-[20px] md:text-[24px] font-black text-white tracking-tight">New Releases This Week</h2>
        </div>
        <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1">
          {discoverNew.map((track) => (
            <div 
              key={track.id} 
              className="flex-shrink-0 w-[140px] md:w-[180px] group transition-all"
              onClick={() => playTrackFromList(track, discoverNew)}
            >
              <div className="relative aspect-square rounded-[24px] overflow-hidden mb-3 bg-[#111119] border border-white/[0.03] shadow-lg">
                <img src={track.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[1px]">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shadow-2xl scale-75 group-hover:scale-100 transition-all duration-300">
                      <Play size={20} fill="currentColor" className="ml-1" />
                   </div>
                </div>
              </div>
              <h3 className="text-[14px] font-bold text-white truncate px-1 group-hover:text-[var(--acc)]">{track.title}</h3>
              <p className="text-[12px] text-[var(--t2)] truncate px-1">{track.artist}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Popular Genres Grid */}
      <section className="px-5 md:px-8">
        <h2 className="text-[22px] font-black text-white tracking-tight mb-8">Popular Genres</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GENRES.map((genre) => (
            <div 
              key={genre.name}
              className={`relative h-[80px] md:h-[100px] rounded-24px overflow-hidden cursor-pointer group active:scale-[0.97] transition-all`}
              onClick={() => (window.location.href = '/search')}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${genre.gradient} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl md:text-2xl font-black text-white drop-shadow-lg">{genre.name}</span>
              </div>
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
