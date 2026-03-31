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

        {/* Section 2 — Featured Strip (Pure CSS) */}
        {featuredTrack && (
          <div 
            ref={featuredReveal.ref}
            className={`grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr] gap-6 mb-12 reveal ${featuredReveal.isVisible ? 'revealed' : ''}`}
          >
            {/* Main Featured */}
            <div
              className="relative rounded-[24px] overflow-hidden cursor-pointer group h-[240px] bg-[var(--s2)] border border-[rgba(255,255,255,0.05)] md:row-span-2 hover-card-anim flex flex-col justify-between p-8 shadow-2xl backdrop-blur-md"
              onClick={() => handlePlay(featuredTrack, filteredTracks)}
              style={{ transitionDelay: '0ms' }}
            >
               {/* Massive watermark */}
               <div className="absolute top-[-20%] left-[-5%] text-[120px] font-sans font-extrabold text-[rgba(255,255,255,0.03)] leading-none pointer-events-none whitespace-nowrap overflow-hidden z-0">
                 {featuredTrack.title.toUpperCase()}
               </div>

               <div className="relative z-10 flex flex-col gap-6">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/40 border border-[rgba(255,255,255,0.05)] text-[var(--t1)] text-[9px] font-bold uppercase tracking-widest rounded-full w-max">
                   <span className="w-1.5 h-1.5 bg-[var(--t1)] rounded-full animate-pulse-slow" />
                   TRENDING NOW
                 </div>
                 
                 <div>
                    <h2 className="text-[28px] md:text-[32px] font-sans font-extrabold text-[#f0f2f4] mb-2 leading-tight tracking-tight line-clamp-1 truncate">{featuredTrack.title}<br/><span className="text-[#a0a8b0]">— {featuredTrack.artist}</span></h2>
                    <p className="text-[#a0a8b0] text-[13px] truncate">Trending Hits • {formatDuration(featuredTrack.duration)}</p>
                 </div>
               </div>
               
               <button className="relative z-10 mt-auto inline-flex items-center gap-2 px-6 py-3 bg-[var(--acc)] text-[var(--bg)] rounded-[12px] font-bold text-[14px] hover:bg-white transition-colors w-max shadow-lg">
                 <Play size={16} fill="currentColor" /> Play Now
               </button>
            </div>

            {/* Side cards */}
            {sideCards.map((track, i) => (
              <div
                key={track.id}
                className="relative rounded-[24px] overflow-hidden cursor-pointer group h-[240px] bg-[var(--s2)] border border-[rgba(255,255,255,0.05)] hover-card-anim shadow-xl flex flex-col p-6 backdrop-blur-md reveal"
                onClick={() => handlePlay(track, filteredTracks)}
                style={{ transitionDelay: `${(i + 1) * 100}ms` }}
              >
                {/* Large letter art */}
                <div className="absolute right-[-10%] bottom-[-10px] text-[150px] font-sans font-black text-[rgba(255,255,255,0.02)] leading-none pointer-events-none z-0">
                  {track.title.charAt(0).toUpperCase()}
                </div>

                <div className="relative z-10 flex-col flex h-full">
                   {/* Fake Image Box */}
                   <div className="w-[60px] h-[60px] rounded-[14px] mb-6 shadow-md" style={{ background: POSTER_GRADIENTS[i === 0 ? 0 : 2] }} />
                   
                   <div className="mt-auto">
                     <h3 className="text-[18px] font-sans font-bold text-[#f0f2f4] truncate mb-1 border-b border-transparent">{track.title}</h3>
                     <p className="text-[#9098A0] text-[12px] font-mono mb-4">{track.artist} · {formatDuration(track.duration)}</p>
                     
                     <span className="inline-block px-3 py-1 bg-[rgba(255,255,255,0.04)] text-[var(--t2)] text-[10px] font-bold uppercase tracking-widest rounded-lg border border-[rgba(255,255,255,0.03)]">
                       {i === 0 ? 'HOT' : 'NEW DROP'}
                     </span>
                   </div>
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20 backdrop-blur-[2px]">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black shadow-xl scale-95 group-hover:scale-100 transition-transform">
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section 3 — Hyped Songs List */}
        {filteredTracks.length > 0 && (
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

            {filteredTracks.slice(0, 10).map((track, index) => {
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
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10">
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
                      className={`flex items-center justify-center transition-all ${liked ? 'text-[var(--acc)] animate-heart-pop' : 'text-[var(--t3)] opacity-0 group-hover:opacity-100 hover:text-[var(--acc-soft)]'}`}
                    >
                      <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                    </button>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
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
