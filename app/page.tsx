'use client';
import { useEffect, useState } from 'react';
import { Play, Heart, Loader2 } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { Track, formatDuration } from '@/lib/tracks';
import { getTrendingMusic } from '@/lib/youtubeApi';
import { TrackMenu } from '@/components/menus/TrackMenu';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const MOODS = ['Chill', 'Hype', 'Focus', 'Sleep', 'Workout'];
const MOOD_CHIPS = ['All', ...MOODS];

const POSTER_GRADIENTS = [
  'linear-gradient(135deg, #1e3a8a, #0f172a)',
  'linear-gradient(135deg, #4c1d95, #1e1b4b)',
  'linear-gradient(135deg, #831843, #4c0519)',
  'linear-gradient(135deg, #064e3b, #022c22)',
  'linear-gradient(135deg, #78350f, #451a03)',
  'linear-gradient(135deg, #111827, #000000)',
  'linear-gradient(135deg, #1e40af, #312e81)',
  'linear-gradient(135deg, #9d174d, #4a044e)'
];

export default function Home() {
  const { playTrackFromList, likedSongs, toggleLike, currentTrack, isPlaying } = usePlayerStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeMood, setActiveMood] = useState('All');
  const [allTracks, setAllTracks] = useState<Track[]>([]);

  const trackListReveal = useScrollReveal();
  const featuredReveal = useScrollReveal();

  useEffect(() => {
    let cancelled = false;

    async function loadMusic() {
      try {
        setLoading(true);
        // Fetch 20 trending tracks
        const results = await getTrendingMusic(20);
        
        if (!cancelled) {
          // Assign random moods
          const tracksWithMoods = results.map(t => ({
            ...t,
            mood: MOODS[Math.floor(Math.random() * MOODS.length)]
          }));
          setAllTracks(tracksWithMoods);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load music');
          setLoading(false);
        }
      }
    }

    loadMusic();
    return () => { cancelled = true; };
  }, []);

  const filteredTracks = activeMood === 'All' 
    ? allTracks 
    : allTracks.filter(t => t.mood === activeMood);

  const featuredTrack = filteredTracks[0];
  const sideCards = filteredTracks.slice(1, 3);
  const midnightMix = filteredTracks.slice(3, 10);
  const hypedList = filteredTracks.slice(10, 20);

  const handlePlay = (track: Track, list: Track[]) => {
    playTrackFromList(track, list);
  };

  if (loading) {
    return (
      <div className="p-5 md:p-8 flex items-center justify-center min-h-screen">
         <div className="flex flex-col items-center gap-4 text-[var(--t2)] animate-pulse">
           <Loader2 size={32} className="animate-spin text-[var(--acc)]" />
           <span className="text-sm font-sans tracking-wide">Tuning your universe...</span>
         </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 md:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-[#f87171] text-lg font-bold mb-2">Connection Lost</p>
          <p className="text-[var(--t2)] text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[var(--acc)] text-[var(--bg)] rounded-full font-bold hover:bg-white transition-colors button-active-anim"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="relative w-full min-h-full pb-32 animate-page-enter">
      <div className="p-5 md:p-8">

        {/* Section 1 — Mood Filter */}
        <div className="flex items-center gap-4 mb-10 overflow-x-auto scrollbar-hide pb-2">
          {MOOD_CHIPS.map(chip => (
            <button
              key={chip}
              onClick={() => setActiveMood(chip)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border button-active-anim ${
                activeMood === chip
                  ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  : 'bg-transparent text-[var(--t2)] border-[var(--s3)] hover:border-[var(--s5)] hover:text-white'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Section 2 — Smoky Discovery Hero */}
        {featuredTrack && (
          <div 
            ref={featuredReveal.ref}
            className={`relative rounded-[40px] overflow-hidden mb-12 group cursor-pointer border border-white/[0.05] bg-black/40 backdrop-blur-3xl shadow-2xl reveal ${featuredReveal.isVisible ? 'revealed' : ''}`}
            onClick={() => handlePlay(featuredTrack, filteredTracks)}
          >
            {/* Dynamic Smoky Gradient Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-purple-600/20 blur-[120px] animate-pulse-slow" />
              <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[70%] bg-blue-600/20 blur-[100px] animate-pulse-slow delay-700" />
              <div className="absolute top-[20%] right-[10%] w-[40%] h-[60%] bg-magenta-600/10 blur-[110px] animate-pulse-slow delay-1000" />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

            <div className="relative z-20 p-8 md:p-14 flex flex-col md:flex-row items-center gap-10">
               {/* Left Side: Art */}
               <div className="w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 group-hover:scale-105 transition-transform duration-700 relative">
                  <img src={featuredTrack.cover} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
               </div>

               {/* Right Side: Info */}
               <div className="flex-1 flex flex-col items-start gap-4 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 text-[var(--acc)] text-[10px] font-black uppercase tracking-[0.2em] rounded-full backdrop-blur-xl">
                    <span className="w-2 h-2 bg-[var(--acc)] rounded-full animate-pulse shadow-[0_0_10px_var(--acc)]" />
                    DISCOVER NEW
                  </div>
                  
                  <div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2 line-clamp-2 leading-[0.95] drop-shadow-2xl">
                      {featuredTrack.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-[var(--t2)] font-bold italic opacity-80">— {featuredTrack.artist}</p>
                  </div>

                  <p className="max-w-md text-[var(--t2)] text-sm md:text-base font-medium leading-relaxed opacity-60">
                    Dive into our latest trending picks. A curated sonic journey through the neon haze.
                  </p>

                  <div className="flex items-center gap-4 mt-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-white text-black rounded-2xl font-black text-base hover:bg-[var(--acc)] transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 group/playBtn">
                      <Play size={20} fill="currentColor" className="group-hover/playBtn:scale-110 transition-transform" /> Play Now
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleLike(featuredTrack.id); }}
                      className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all hover:text-[var(--acc)]"
                    >
                      <Heart size={24} fill={likedSongs.includes(featuredTrack.id) ? 'currentColor' : 'none'} className={likedSongs.includes(featuredTrack.id) ? 'text-[var(--acc)]' : ''} />
                    </button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Section 3 — High Energy Grid */}
        <div className="mb-14">
          <h2 className="text-xl font-black text-white tracking-widest uppercase mb-6 flex items-center gap-3 ml-1">
            <span className="w-6 h-[2px] bg-[var(--acc)] rounded-full" />
            Vibe Check
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredTracks.slice(1, 6).map((track, i) => (
              <div
                key={track.id}
                className="group cursor-pointer reveal"
                onClick={() => handlePlay(track, filteredTracks)}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative aspect-square rounded-[28px] overflow-hidden mb-4 bg-[var(--s2)] border border-white/[0.03] hover-card-anim shadow-xl">
                  <img src={track.cover} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[1px]">
                     <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-black shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                        <Play size={24} fill="currentColor" className="ml-1" />
                     </div>
                  </div>
                </div>
                <h3 className="text-[#f0f2f4] text-sm font-bold truncate px-1 group-hover:text-[var(--acc)] transition-colors">{track.title}</h3>
                <p className="text-[#9098A0] text-[11px] font-black uppercase tracking-widest truncate px-1 opacity-60 mt-0.5">{track.artist}</p>
              </div>
            ))}
          </div>
        </div>


        {/* Section 4 — Hyped Songs List */}
        {hypedList.length > 0 && (
          <div ref={trackListReveal.ref} className={`mb-8 reveal ${trackListReveal.isVisible ? 'revealed' : ''}`}>
             
            <div className="flex items-center justify-between mb-6 px-1">
               <h2 className="text-xl font-bold text-white tracking-tight font-sans">Hyped Songs</h2>
            </div>
             
            <div className="hidden md:grid grid-cols-[40px_48px_1fr_1fr_70px_80px] gap-3 px-3 py-2 text-[var(--t3)] text-[11px] font-bold uppercase tracking-widest border-b border-[var(--acc-glow)] mb-1">
              <span className="text-right pr-2">#</span>
              <span></span>
              <span>Title</span>
              <span>Artist</span>
              <span className="text-right">Time</span>
              <span></span>
            </div>

            {hypedList.map((track, index) => {
              const liked = likedSongs.includes(track.id);
              const isCurrentlyPlaying = currentTrack?.id === track.id;
              
              return (
                <div
                  key={track.id}
                  onClick={() => handlePlay(track, filteredTracks)}
                  className={`grid grid-cols-[40px_48px_1fr_60px_40px] md:grid-cols-[40px_48px_1fr_1fr_70px_80px] gap-3 px-3 py-2 items-center cursor-pointer rounded-[10px] transition-colors hover:bg-[var(--acc-glow)] group hover-card-anim reveal ${trackListReveal.isVisible ? 'revealed' : ''} ${isCurrentlyPlaying ? 'bg-[var(--playing)] border flex-auto border-[var(--acc-border)]' : 'border border-transparent'}`}
                  style={{ transitionDelay: `${index * 40}ms` }}
                >
                  <span className={`text-right pr-2 text-[14px] tabular-nums font-mono ${isCurrentlyPlaying ? 'text-[var(--acc)]' : 'text-[var(--t3)] group-hover:text-[var(--t2)]'}`}>
                    {isCurrentlyPlaying && isPlaying ? (
                       <span className="flex items-end justify-end h-4 gap-[2px]">
                         <span className="w-[3px] bg-[var(--acc)] animate-[eqBar1_0.8s_ease-in-out_infinite]" />
                         <span className="w-[3px] bg-[var(--acc)] animate-[eqBar2_0.9s_ease-in-out_infinite]" />
                         <span className="w-[3px] bg-[var(--acc)] animate-[eqBar3_0.7s_ease-in-out_infinite]" />
                       </span>
                    ) : (isCurrentlyPlaying ? '♪' : index + 1)}
                  </span>
                  
                  <div className="w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-lg overflow-hidden relative shadow-md flex-shrink-0 bg-[var(--s2)]">
                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-100 md:opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10">
                      <Play size={16} fill="white" className="text-white ml-0.5" />
                    </div>
                  </div>

                  <div className="min-w-0 pr-2">
                    <p className={`text-[15px] md:text-[16px] font-bold font-sans truncate ${isCurrentlyPlaying ? 'text-[var(--acc)]' : 'text-[var(--t1)]'}`}>{track.title}</p>
                    <p className="text-[12px] md:text-[13px] text-[var(--t2)] font-mono truncate md:hidden mt-[1px]">{track.artist}</p>
                  </div>

                  <span className="text-[13px] text-[var(--t2)] font-mono truncate hidden md:block">{track.artist}</span>

                  <span className="text-[13px] text-[var(--t2)] font-mono text-right tabular-nums">{track.duration > 0 ? formatDuration(track.duration) : '--:--'}</span>

                  <div className="flex items-center justify-end gap-2 pr-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }}
                      className={`flex items-center justify-center transition-all ${liked ? 'text-[var(--acc)] animate-heart-pop' : 'text-[var(--t3)] opacity-100 md:opacity-0 group-hover:opacity-100 hover:text-[var(--acc-soft)]'}`}
                    >
                      <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                    </button>
                    <div className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <TrackMenu track={track} />
                    </div>
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
