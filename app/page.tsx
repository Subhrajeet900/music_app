'use client';
import { useEffect, useState } from 'react';
import { Play, Heart, MoreHorizontal, ListPlus, Share2, Loader2 } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { Track, formatDuration } from '@/lib/tracks';
import { getTrendingMusic, searchYouTube } from '@/lib/youtubeApi';

const MOOD_CHIPS = ['All', 'Chill', 'Hype', 'Focus', 'Sleep', 'Workout'];

export default function Home() {
  const { playTrackFromList, likedSongs, toggleLike, currentTrack, isPlaying } = usePlayerStore();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMood, setActiveMood] = useState('All');

  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [chillTracks, setChillTracks] = useState<Track[]>([]);
  const [popTracks, setPopTracks] = useState<Track[]>([]);
  const [hiphopTracks, setHiphopTracks] = useState<Track[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadMusic() {
      try {
        setLoading(true);
        setError(null);

        const [trending, chill, pop, hiphop] = await Promise.all([
          getTrendingMusic(12),
          searchYouTube('chill lofi beats music', 8),
          searchYouTube('latest pop hits 2026', 8),
          searchYouTube('trending hip hop rap songs', 8),
        ]);

        if (!cancelled) {
          setTrendingTracks(trending);
          setChillTracks(chill);
          setPopTracks(pop);
          setHiphopTracks(hiphop);
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

  const featuredTrack = trendingTracks[0];
  const sideCards = trendingTracks.slice(1, 3);

  const handlePlay = (track: Track, list: Track[]) => {
    playTrackFromList(track, list);
  };

  if (loading) {
    return (
      <div className="p-5 md:p-6">
        <div className="animate-pulse">
          <div className="flex gap-3 mb-6">
            {MOOD_CHIPS.map(c => (
              <div key={c} className="h-8 w-16 bg-[#1c2333] rounded-full shimmer-skeleton" />
            ))}
          </div>
          <div className="h-48 w-full bg-[#1c2333] rounded-xl mb-8 shimmer-skeleton" />
          <div className="flex gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-[180px] h-[240px] bg-[#1c2333] rounded-xl shimmer-skeleton" />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center mt-12 gap-3 text-[#7d8590]">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Loading music from YouTube...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 md:p-6">
        <div className="text-center py-20">
          <p className="text-red-400 text-lg font-medium mb-2">Failed to load music</p>
          <p className="text-[#7d8590] text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#e2a93b] text-[#0d1117] rounded-full font-medium hover:bg-[#c9952f] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-full pb-10">
      <div className="p-5 md:p-6">

        {/* Mood Filter Chips */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {MOOD_CHIPS.map(chip => (
            <button
              key={chip}
              onClick={() => setActiveMood(chip)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                activeMood === chip
                  ? 'bg-[#e2a93b] text-[#0d1117] border-[#e2a93b] shadow-[0_0_12px_rgba(226,169,59,0.3)]'
                  : 'bg-transparent text-[#7d8590] border-[#252d3a] hover:border-[#484f58] hover:text-[#e6edf3]'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Featured Section: Large card + 2 side cards */}
        {featuredTrack && (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_200px] gap-3 mb-8">
            {/* Main featured card */}
            <div
              className="relative rounded-xl overflow-hidden cursor-pointer group h-[200px] md:row-span-2"
              onClick={() => handlePlay(featuredTrack, trendingTracks)}
            >
              <img src={featuredTrack.cover} alt={featuredTrack.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e2a93b]/90 text-[#0d1117] text-[10px] font-bold uppercase tracking-wider rounded-full">
                  <span className="w-1.5 h-1.5 bg-[#0d1117] rounded-full animate-pulse" />
                  Trending Now
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-xl font-bold text-white mb-0.5 line-clamp-2">{featuredTrack.title}</h2>
                <p className="text-[#7d8590] text-sm">{featuredTrack.artist} · {featuredTrack.duration > 0 ? formatDuration(featuredTrack.duration) : ''}</p>
                <button className="mt-3 inline-flex items-center gap-2 px-5 py-2 bg-[#e6edf3] text-[#0d1117] rounded-full font-semibold text-sm hover:bg-white transition-colors">
                  <Play size={14} fill="currentColor" /> Play Now
                </button>
              </div>
            </div>

            {/* Side cards */}
            {sideCards.map((track, i) => (
              <div
                key={track.id}
                className="relative rounded-xl overflow-hidden cursor-pointer group h-[95px] md:h-auto"
                onClick={() => handlePlay(track, trendingTracks)}
              >
                <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-sm font-bold text-white truncate">{track.title}</h3>
                  <p className="text-[#7d8590] text-[11px]">{track.artist} · {track.duration > 0 ? formatDuration(track.duration) : ''}</p>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-0.5 bg-white/10 text-[#7d8590] text-[9px] font-semibold uppercase rounded-md backdrop-blur-sm">
                    {i === 0 ? 'Lyrical' : 'New Drop'}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-10 h-10 bg-[#e2a93b] rounded-full flex items-center justify-center text-[#0d1117] shadow-xl">
                    <Play size={16} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Top Tracks Table */}
        {trendingTracks.length > 0 && (
          <div className="mb-8">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-lg font-bold text-[#e6edf3] tracking-tight">Top Tracks</h2>
              <span className="text-xs text-[#7d8590] font-medium hover:text-[#e2a93b] cursor-pointer transition-colors">See all →</span>
            </div>

            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[32px_48px_1fr_1fr_70px_32px_32px] gap-3 px-3 py-2 text-[#484f58] text-[10px] font-semibold uppercase tracking-wider border-b border-white/[0.04] mb-1">
              <span className="text-right">#</span>
              <span></span>
              <span>Title</span>
              <span>Album / Artist</span>
              <span className="text-right">Duration</span>
              <span></span>
              <span></span>
            </div>

            {/* Table Rows */}
            {trendingTracks.slice(0, 8).map((track, index) => {
              const liked = likedSongs.includes(track.id);
              const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying;
              return (
                <div
                  key={track.id}
                  onClick={() => handlePlay(track, trendingTracks)}
                  className={`grid grid-cols-[32px_48px_1fr_70px_32px] md:grid-cols-[32px_48px_1fr_1fr_70px_32px_32px] gap-3 px-3 py-2 items-center cursor-pointer rounded-lg transition-colors hover:bg-white/[0.03] group ${isCurrentlyPlaying ? 'bg-[#e2a93b]/[0.06]' : ''}`}
                >
                  {/* # */}
                  <span className={`text-right text-sm tabular-nums ${isCurrentlyPlaying ? 'text-[#e2a93b]' : 'text-[#484f58]'}`}>
                    {isCurrentlyPlaying ? '♪' : index + 1}
                  </span>

                  {/* Cover */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-[#1c2333]">
                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play size={14} fill="white" className="text-white ml-0.5" />
                    </div>
                  </div>

                  {/* Title + Artist */}
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${isCurrentlyPlaying ? 'text-[#e2a93b]' : 'text-[#e6edf3]'}`}>{track.title}</p>
                    <p className="text-xs text-[#7d8590] truncate md:hidden">{track.artist}</p>
                  </div>

                  {/* Artist/Album (desktop) */}
                  <span className="text-sm text-[#7d8590] truncate hidden md:block">{track.artist}</span>

                  {/* Duration */}
                  <span className="text-sm text-[#7d8590] text-right tabular-nums">{track.duration > 0 ? formatDuration(track.duration) : '--:--'}</span>

                  {/* Heart */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }}
                    className={`flex items-center justify-center transition-all ${liked ? 'text-[#e2a93b]' : 'text-[#484f58] opacity-0 group-hover:opacity-100'}`}
                  >
                    <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
                  </button>

                  {/* Menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === track.id ? null : track.id); }}
                      className="flex items-center justify-center text-[#484f58] opacity-0 group-hover:opacity-100 hover:text-[#e6edf3] transition-all"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                    {menuOpen === track.id && (
                      <div className="absolute right-0 top-full mt-1 w-44 bg-[#1c2333] rounded-xl shadow-2xl border border-white/[0.06] py-1 z-50 animate-[fade-in_0.15s_ease-out]" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => { usePlayerStore.getState().addToQueue(track); setMenuOpen(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.04]">
                          <ListPlus size={14} /> Add to Queue
                        </button>
                        <button onClick={() => setMenuOpen(null)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.04]">
                          <Share2 size={14} /> Share
                        </button>
                        <button onClick={() => setMenuOpen(null)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.04]">
                          <ListPlus size={14} /> Add to Playlist
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Horizontal Scroll Sections */}
        {chillTracks.length > 0 && <ScrollSection title="Chill Vibes" tracks={chillTracks} onPlay={handlePlay} />}
        {popTracks.length > 0 && <ScrollSection title="Pop Hits" tracks={popTracks} onPlay={handlePlay} />}
        {hiphopTracks.length > 0 && <ScrollSection title="Hip Hop & Rap" tracks={hiphopTracks} onPlay={handlePlay} />}
      </div>

      {/* Click outside to close menus */}
      {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />}
    </div>
  );
}

function ScrollSection({ title, tracks, onPlay }: {
  title: string;
  tracks: Track[];
  onPlay: (track: Track, list: Track[]) => void;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-lg font-bold text-[#e6edf3] tracking-tight hover:underline cursor-pointer">{title}</h2>
        <span className="text-xs text-[#7d8590] font-medium hover:text-[#e2a93b] cursor-pointer transition-colors">Show all</span>
      </div>
      <div className="flex items-start gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="min-w-[145px] md:min-w-[160px] group bg-[#1c2333] hover:bg-[#252d3a] p-3 rounded-xl transition-all cursor-pointer flex flex-col shrink-0 relative"
            onClick={() => onPlay(track, tracks)}
          >
            <div className="relative mb-3 w-full aspect-square">
              <img src={track.cover} alt={track.title} className="w-full h-full object-cover rounded-lg shadow-lg" />
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <button className="w-9 h-9 bg-[#e2a93b] rounded-full flex items-center justify-center text-[#0d1117] shadow-xl hover:scale-105 hover:bg-[#c9952f]">
                  <Play size={16} fill="currentColor" className="ml-0.5" />
                </button>
              </div>
            </div>
            <h4 className="font-medium text-[#e6edf3] text-sm mb-0.5 truncate">{track.title}</h4>
            <p className="text-xs text-[#7d8590] truncate">{track.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
