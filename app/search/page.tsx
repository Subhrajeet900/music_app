'use client';
import { Search as SearchIcon, X, Music, Heart, MoreHorizontal, Play, ListPlus, Share2, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Track, formatDuration } from '@/lib/tracks';
import { usePlayerStore } from '@/store/playerStore';
import { searchYouTube } from '@/lib/youtubeApi';

export default function SearchPage() {
  const { likedSongs, toggleLike, currentTrack, isPlaying } = usePlayerStore();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const tracks = await searchYouTube(searchQuery, 20);
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
    debounceRef.current = setTimeout(() => { performSearch(query); }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, performSearch]);

  const handlePlay = (track: Track) => {
    usePlayerStore.getState().playTrackFromList(track, results);
  };

  return (
    <div className="min-h-full pb-20 p-5 md:p-6">
      <div className="sticky top-0 z-30 bg-[#161b22]/95 pb-4 pt-2 backdrop-blur-xl -mx-5 px-5 -mt-5">
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#484f58]"><SearchIcon size={20} /></div>
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search songs, artists on YouTube..." className="w-full bg-[#1c2333] text-[#e6edf3] rounded-full py-3 pl-12 pr-12 text-[15px] placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-[#e2a93b]/40 border border-white/[0.06]" />
          {query && <button onClick={() => { setQuery(''); setResults([]); setSearched(false); inputRef.current?.focus(); }} className="absolute inset-y-0 right-4 flex items-center text-[#484f58] hover:text-[#e6edf3]"><X size={18} /></button>}
        </div>
      </div>

      <div className="mt-4">
        {!query.trim() ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#1c2333] rounded-full flex items-center justify-center mx-auto mb-4"><SearchIcon size={28} className="text-[#7d8590]" /></div>
            <p className="text-[#7d8590] text-lg font-medium">Search for your favorite music</p>
            <p className="text-[#484f58] text-sm mt-1">Find songs and artists on YouTube</p>
          </div>
        ) : loading ? (
          <div className="text-center py-20">
            <Loader2 size={32} className="text-[#e2a93b] animate-spin mx-auto mb-4" />
            <p className="text-[#7d8590] text-sm">Searching YouTube...</p>
          </div>
        ) : searched && results.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#1c2333] rounded-full flex items-center justify-center mx-auto mb-4"><Music size={28} className="text-[#7d8590]" /></div>
            <p className="text-[#e6edf3] text-lg font-medium">No results for &apos;{query}&apos;</p>
            <p className="text-[#7d8590] text-sm mt-1">Try different keywords</p>
          </div>
        ) : (
          <div>
            <p className="text-[#7d8590] text-sm mb-4">{results.length} result{results.length !== 1 ? 's' : ''}</p>
            <div className="hidden md:grid grid-cols-[32px_48px_1fr_1fr_70px_32px_32px] gap-3 px-3 py-2 text-[#484f58] text-[10px] font-semibold uppercase tracking-wider border-b border-white/[0.04] mb-1">
              <span className="text-right">#</span><span></span><span>Title</span><span>Artist</span><span className="text-right">Duration</span><span></span><span></span>
            </div>
            {results.map((track, index) => {
              const liked = likedSongs.includes(track.id);
              const playing = currentTrack?.id === track.id && isPlaying;
              return (
                <div key={track.id} onClick={() => handlePlay(track)} className={`grid grid-cols-[32px_48px_1fr_70px_32px] md:grid-cols-[32px_48px_1fr_1fr_70px_32px_32px] gap-3 px-3 py-2 items-center cursor-pointer rounded-lg transition-colors hover:bg-white/[0.03] group ${playing ? 'bg-[#e2a93b]/[0.06]' : ''}`}>
                  <span className={`text-right text-sm ${playing ? 'text-[#e2a93b]' : 'text-[#484f58]'}`}>{playing ? '♪' : index + 1}</span>
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-[#1c2333]">
                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Play size={14} fill="white" className="text-white ml-0.5" /></div>
                  </div>
                  <div className="min-w-0"><p className={`text-sm font-medium truncate ${playing ? 'text-[#e2a93b]' : 'text-[#e6edf3]'}`}>{track.title}</p><p className="text-xs text-[#7d8590] truncate md:hidden">{track.artist}</p></div>
                  <span className="text-sm text-[#7d8590] truncate hidden md:block">{track.artist}</span>
                  <span className="text-sm text-[#7d8590] text-right tabular-nums">{track.duration > 0 ? formatDuration(track.duration) : '--:--'}</span>
                  <button onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }} className={`flex items-center justify-center transition-all ${liked ? 'text-[#e2a93b]' : 'text-[#484f58] opacity-0 group-hover:opacity-100'}`}><Heart size={14} fill={liked ? 'currentColor' : 'none'} /></button>
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === track.id ? null : track.id); }} className="flex items-center justify-center text-[#484f58] opacity-0 group-hover:opacity-100 hover:text-[#e6edf3] transition-all"><MoreHorizontal size={14} /></button>
                    {menuOpen === track.id && (
                      <div className="absolute right-0 top-full mt-1 w-44 bg-[#1c2333] rounded-xl shadow-2xl border border-white/[0.06] py-1 z-50 animate-[fade-in_0.15s_ease-out]" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => { usePlayerStore.getState().addToQueue(track); setMenuOpen(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.04]"><ListPlus size={14} /> Add to Queue</button>
                        <button onClick={() => setMenuOpen(null)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#7d8590] hover:text-[#e6edf3] hover:bg-white/[0.04]"><Share2 size={14} /> Share</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />}
    </div>
  );
}
