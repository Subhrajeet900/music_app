'use client';
import { useEffect, useState } from 'react';
import { Play, Heart, Loader2 } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { Track, formatDuration } from '@/lib/tracks';
import { searchYouTube } from '@/lib/youtubeApi';
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
        // Fetch 20 varied tracks
        const results = await searchYouTube('popular lofi pop hiphop vibes', 20);
        
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

  // Create infinite looping array for posters (3x the 20 items to ensure it loops smoothly)
  const posterRow1 = [...allTracks].slice(0, 10);
  const posterRow2 = [...allTracks].slice(10, 20);
  const loop1 = [...posterRow1, ...posterRow1, ...posterRow1];
  const loop2 = [...posterRow2, ...posterRow2, ...posterRow2];

  return (
    <div className="relative w-full min-h-full pb-32 animate-page-enter">
      <div className="p-5 md:p-8">

        {/* Section 1 — Mood Filter */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
          {MOOD_CHIPS.map(chip => (
            <button
              key={chip}
              onClick={() => setActiveMood(chip)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border button-active-anim ${
                activeMood === chip
                  ? 'bg-[var(--acc)] text-[var(--bg)] border-[var(--acc)] shadow-[0_0_15px_var(--acc-dim)]'
                  : 'bg-transparent text-[var(--t2)] border-[var(--s3)] hover:border-[var(--s5)] hover:text-[var(--t1)]'
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
            className={`grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr] gap-4 mb-10 reveal ${featuredReveal.isVisible ? 'revealed' : ''}`}
          >
            {/* Main Featured */}
            <div
              className="relative rounded-[18px] overflow-hidden cursor-pointer group h-[220px] bg-[var(--s2)] border border-[rgba(255,255,255,0.05)] md:row-span-2 hover-card-anim flex flex-col justify-end p-6"
              onClick={() => handlePlay(featuredTrack, filteredTracks)}
              style={{ transitionDelay: '0ms' }}
            >
               {/* Massive watermark */}
               <div className="absolute top-[-20%] left-[-5%] text-[72px] font-sans font-extrabold text-[rgba(255,255,255,0.03)] leading-none pointer-events-none whitespace-nowrap overflow-hidden z-0">
                 {featuredTrack.title.toUpperCase()}
               </div>
               
               {/* Decorative Graphic */}
               <svg className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none" viewBox="0 0 100 100">
                 <circle cx="100" cy="0" r="40" fill="none" stroke="#c8cdd4" strokeWidth="2"/>
                 <circle cx="100" cy="0" r="60" fill="none" stroke="#c8cdd4" strokeWidth="2"/>
                 <circle cx="100" cy="0" r="80" fill="none" stroke="#c8cdd4" strokeWidth="2"/>
               </svg>

               <div className="relative z-10">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/40 border border-[rgba(255,255,255,0.05)] text-[var(--t1)] text-[9px] font-bold uppercase tracking-widest rounded-full mb-4">
                   <span className="w-1.5 h-1.5 bg-[var(--acc)] rounded-full animate-pulse-slow" />
                   TRENDING NOW
                 </div>
                 <h2 className="text-[20px] font-sans font-bold text-[var(--t1)] mb-1 line-clamp-1 truncate pr-8">{featuredTrack.title}</h2>
                 <p className="text-[var(--t2)] text-[12px] truncate">{featuredTrack.artist} • {formatDuration(featuredTrack.duration)}</p>
                 <button className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--acc)] text-[var(--bg)] rounded-full font-bold text-[13px] hover:bg-white transition-colors">
                   <Play size={14} fill="currentColor" /> Play Now
                 </button>
               </div>
            </div>

            {/* Side cards */}
            {sideCards.map((track, i) => (
              <div
                key={track.id}
                className="relative rounded-[18px] overflow-hidden cursor-pointer group h-[100px] md:h-[102px] bg-[var(--s2)] border border-[rgba(255,255,255,0.05)] hover-card-anim flex flex-col justify-end p-4 reveal"
                onClick={() => handlePlay(track, filteredTracks)}
                style={{ transitionDelay: `${(i + 1) * 100}ms` }}
              >
                {/* Large letter art */}
                <div className="absolute right-2 bottom-[-10px] text-[80px] font-sans font-black text-[rgba(255,255,255,0.02)] leading-none pointer-events-none z-0">
                  {track.title.charAt(0).toUpperCase()}
                </div>

                <div className="relative z-10 w-full pr-12">
                   <span className="absolute top-0 right-[-40px] px-2 py-0.5 bg-[rgba(255,255,255,0.05)] text-[var(--t2)] text-[8px] font-bold uppercase tracking-widest rounded-md border border-[rgba(255,255,255,0.02)]">
                     {i === 0 ? 'HOT' : 'NEW'}
                   </span>
                   <h3 className="text-[14px] font-sans font-bold text-[var(--t1)] truncate bg-gradient-to-r from-[var(--t1)] to-[var(--t2)] bg-clip-text text-transparent">{track.title}</h3>
                   <p className="text-[var(--t3)] text-[11px] font-mono mt-0.5">{track.artist} · {formatDuration(track.duration)}</p>
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20">
                  <div className="w-10 h-10 bg-[var(--acc)] rounded-full flex items-center justify-center text-[var(--bg)] shadow-xl animate-slide-up-fast">
                    <Play size={16} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section 3 — Animated Scrolling Poster Strip */}
        <div className="w-full h-[200px] rounded-[14px] my-10 relative overflow-hidden flex flex-col justify-center gap-3 group/strip animate-fade-in [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          {/* Row 1 - Left sliding */}
          <div className="flex gap-[10px] w-max animate-[scrollLeft_35s_linear_infinite] group-hover/strip:[animation-play-state:paused] pointer-events-auto">
             {loop1.map((track, i) => (
                <div 
                  key={'r1-' + i} 
                  onClick={() => handlePlay(track, allTracks)}
                  className="w-[140px] h-[88px] rounded-[12px] flex-shrink-0 relative overflow-hidden cursor-pointer hover-card-anim border border-[rgba(255,255,255,0.06)] flex items-end p-3"
                  style={{ background: POSTER_GRADIENTS[i % POSTER_GRADIENTS.length] }}
                >
                   {/* Geometric shape decoration */}
                   {i % 3 === 0 && <div className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-[rgba(255,255,255,0.08)]" />}
                   {i % 3 === 1 && <div className="absolute top-2 right-2 w-0 h-0 border-l-[8px] border-l-transparent border-b-[14px] border-b-[rgba(255,255,255,0.08)] border-r-[8px] border-r-transparent" />}
                   {i % 3 === 2 && <div className="absolute top-2 right-2 w-6 h-1 bg-[rgba(255,255,255,0.08)] rotate-45" />}

                   <div className="w-full min-w-0">
                     <p className="text-[rgba(255,255,255,0.6)] text-[9px] truncate mb-0.5 leading-tight">{track.artist}</p>
                     <p className="text-[var(--t1)] text-[11px] font-sans font-bold leading-tight line-clamp-2">{track.title}</p>
                   </div>
                </div>
             ))}
          </div>
          {/* Row 2 - Right sliding */}
          <div className="flex gap-[10px] w-max animate-[scrollRight_28s_linear_infinite] group-hover/strip:[animation-play-state:paused] pointer-events-auto ml-[-200px]">
             {loop2.map((track, i) => (
                <div 
                  key={'r2-' + i} 
                  onClick={() => handlePlay(track, allTracks)}
                  className="w-[140px] h-[88px] rounded-[12px] flex-shrink-0 relative overflow-hidden cursor-pointer hover-card-anim border border-[rgba(255,255,255,0.06)] flex items-end p-3"
                  style={{ background: POSTER_GRADIENTS[(i + 4) % POSTER_GRADIENTS.length] }}
                >
                   {i % 3 === 0 && <div className="absolute top-2 right-2 w-4 h-1 bg-[rgba(255,255,255,0.08)] -rotate-45" />}
                   {i % 3 === 1 && <div className="absolute top-2 right-2 w-4 h-4 rounded-sm border-2 border-[rgba(255,255,255,0.08)] rotate-12" />}
                   {i % 3 === 2 && <div className="absolute top-2 right-2 w-5 h-5 rounded-full border-t-2 border-r-2 border-[rgba(255,255,255,0.08)] rotate-45" />}

                   <div className="w-full min-w-0">
                     <p className="text-[rgba(255,255,255,0.6)] text-[9px] truncate mb-0.5 leading-tight">{track.artist}</p>
                     <p className="text-[var(--t1)] text-[11px] font-sans font-bold leading-tight line-clamp-2">{track.title}</p>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Section 4 — Top Tracks */}
        {filteredTracks.length > 0 && (
          <div ref={trackListReveal.ref} className={`mb-8 reveal ${trackListReveal.isVisible ? 'revealed' : ''}`}>
            <div className="flex items-end justify-between mb-4 px-1">
              <h2 className="text-xl font-bold text-[var(--t1)] tracking-tight font-sans">Top Tracks</h2>
              <span className="text-[12px] text-[var(--t2)] font-bold uppercase tracking-wider hover:text-[var(--acc)] cursor-pointer transition-colors">See all →</span>
            </div>

            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[40px_1fr_1fr_70px_80px] gap-3 px-3 py-2 text-[var(--t3)] text-[11px] font-bold uppercase tracking-widest border-b border-[var(--acc-glow)] mb-1">
              <span className="text-right pr-2">#</span>
              <span>Title</span>
              <span>Artist</span>
              <span className="text-right">Time</span>
              <span></span>
            </div>

            {/* Table Rows */}
            {filteredTracks.map((track, index) => {
              const liked = likedSongs.includes(track.id);
              const isCurrentlyPlaying = currentTrack?.id === track.id;
              
              return (
                <div
                  key={track.id}
                  onClick={() => handlePlay(track, filteredTracks)}
                  className={`grid grid-cols-[40px_1fr_60px_40px] md:grid-cols-[40px_1fr_1fr_70px_80px] gap-3 px-3 py-2 items-center cursor-pointer rounded-[10px] transition-colors hover:bg-[var(--acc-glow)] group hover-card-anim reveal ${trackListReveal.isVisible ? 'revealed' : ''} ${isCurrentlyPlaying ? 'bg-[var(--playing)] border border-[var(--acc-border)]' : 'border border-transparent'}`}
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

                  <div className="min-w-0 pr-2">
                    <p className={`text-[16px] font-bold font-sans truncate ${isCurrentlyPlaying ? 'text-[var(--acc)]' : 'text-[var(--t1)]'}`}>{track.title}</p>
                    <p className="text-[13px] text-[var(--t2)] font-mono truncate md:hidden mt-0.5">{track.artist}</p>
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
