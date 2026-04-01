'use client';
import { Search as SearchIcon, X, Music, Heart, Loader2, Sparkles, TrendingUp, Music2, Play } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Track, formatDuration } from '@/lib/tracks';
import { usePlayerStore } from '@/store/playerStore';
import { searchYouTube } from '@/lib/youtubeApi';
import { TrackMenu } from '@/components/menus/TrackMenu';
import { motion, AnimatePresence } from 'framer-motion';

const GENRES = [
  { name: 'Pop', gradient: 'from-[#ec4899] to-[#8b5cf6]' },
  { name: 'Hip-Hop', gradient: 'from-[#f59e0b] to-[#ef4444]' },
  { name: 'EDM', gradient: 'from-[#06b6d4] to-[#3b82f6]' },
  { name: 'Rock', gradient: 'from-[#64748b] to-[#0f172a]' },
  { name: 'Jazz', gradient: 'from-[#78350f] to-[#451a03]' },
  { name: 'Lofi', gradient: 'from-[#1e3a8a] to-[#1e1b4b]' },
  { name: 'Indie', gradient: 'from-[#10b981] to-[#064e3b]' },
  { name: 'Classical', gradient: 'from-[#d1d5db] to-[#4b5563]' },
  { name: 'Metal', gradient: 'from-[#422006] to-[#000000]' },
  { name: 'Country', gradient: 'from-[#b45309] to-[#78350f]' },
];

export default function SearchPage() {
  const likedSongs = usePlayerStore(state => state.likedSongs);
  const toggleLike = usePlayerStore(state => state.toggleLike);
  const currentTrack = usePlayerStore(state => state.currentTrack);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const playTrackFromList = usePlayerStore(state => state.playTrackFromList);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const tracks = await searchYouTube(searchQuery, 30);
      setResults(tracks);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); setSearched(false); return; }
    debounceRef.current = setTimeout(() => { performSearch(query); }, 600);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, performSearch]);

  const handlePlay = (track: Track) => {
    playTrackFromList(track, results);
  };

  return (
    <div className="flex-1 min-h-full px-5 md:px-8 pt-6 pb-20 animate-page-enter">
      {/* Glass Search Bar */}
      <div className="sticky top-0 z-40 pt-2 pb-6 -mx-8 px-8 pointer-events-none">
        <div className="max-w-3xl pointer-events-auto relative">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-[var(--t3)]">
            <SearchIcon size={22} strokeWidth={2.5} />
          </div>
          <input 
            ref={inputRef} 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="What do you want to listen to?" 
            className="w-full h-[52px] md:h-[60px] bg-white/[0.04] backdrop-blur-3xl text-white rounded-[24px] pl-16 pr-14 text-[16px] md:text-[18px] font-bold placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--acc)]/30 border border-white/[0.08] shadow-2xl transition-all" 
          />
          {query && (
            <button 
              onClick={() => { setQuery(''); setResults([]); setSearched(false); inputRef.current?.focus(); }} 
              className="absolute inset-y-0 right-6 flex items-center text-[var(--t2)] hover:text-white"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!query.trim() ? (
          <motion.div 
            key="browse"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h2 className="text-[22px] font-black text-white mb-6">Browse all</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
              {GENRES.map((genre, i) => (
                <div 
                  key={genre.name}
                  className="relative h-[110px] md:h-[130px] rounded-[24px] overflow-hidden cursor-pointer group shadow-lg border border-white/5 active:scale-95 transition-all"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${genre.gradient} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700`} />
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <span className="text-[18px] md:text-[20px] font-black text-white drop-shadow-md">{genre.name}</span>
                    <div className="self-end w-8 h-8 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                       <ChevronRight size={18} className="text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center py-40"
          >
            <Loader2 size={32} className="text-[var(--acc)] animate-spin mb-4" />
            <p className="text-[var(--t2)] text-sm font-bold tracking-widest uppercase">Searching...</p>
          </motion.div>
        ) : results.length > 0 ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-1"
          >
            <h2 className="text-[18px] font-black text-white mb-4 ml-2">Top results</h2>
            <div className="grid grid-cols-1 gap-1">
              {results.map((track, i) => {
                const playing = currentTrack?.id === track.id;
                const liked = likedSongs.includes(track.id);
                return (
                  <div 
                    key={track.id}
                    onClick={() => handlePlay(track)}
                    className={`group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/[0.04] transition-all cursor-pointer relative ${playing ? 'bg-white/[0.06]' : ''}`}
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-lg border border-white/5 relative">
                      <img src={track.cover} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <Play size={18} fill="currentColor" className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-[15px] md:text-[16px] font-bold truncate ${playing ? 'text-[var(--acc)]' : 'text-white'}`}>{track.title}</h4>
                      <p className="text-[12px] md:text-[13px] text-[var(--t2)] truncate">{track.artist}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                       <button 
                        onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }}
                        className={`p-2 rounded-full hover:bg-white/10 transition-all ${liked ? 'text-[var(--acc-pink)]' : 'text-[var(--t3)]'}`}
                       >
                         <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                       </button>
                       <TrackMenu track={track} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : searched && (
          <div className="flex flex-col items-center justify-center py-40">
             <Music size={48} className="text-[var(--t3)] mb-4" />
             <p className="text-white font-bold text-lg">No results found for &quot;{query}&quot;</p>
             <p className="text-[var(--t2)] text-sm">Check your spelling or try another search.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
