'use client';
import { useState } from 'react';
import { Heart, Plus, X, Music, Play, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { formatDuration } from '@/lib/tracks';
import { motion, AnimatePresence } from 'framer-motion';

export default function LibraryPage() {
  const likedSongs = usePlayerStore(state => state.likedSongs);
  const likedTracksData = usePlayerStore(state => state.likedTracksData);
  const playTrackFromList = usePlayerStore(state => state.playTrackFromList);
  const playlists = usePlayerStore(state => state.playlists);
  const createPlaylist = usePlayerStore(state => state.createPlaylist);
  
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const likedTracks = likedTracksData.filter(t => likedSongs.includes(t.id));

  return (
    <div className="flex-1 min-h-full px-5 md:px-8 pt-6 pb-32 animate-page-enter">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Your Library</h1>
          <p className="text-[var(--t2)] text-sm font-bold tracking-widest uppercase">Everything you love, in one place.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
             <button 
               onClick={() => setViewMode('grid')}
               className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-xl' : 'text-[var(--t3)]'}`}
             >
               <LayoutGrid size={20} />
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-xl' : 'text-[var(--t3)]'}`}
             >
               <List size={20} />
             </button>
           </div>
           <button 
             onClick={() => setShowCreate(true)}
             className="flex items-center gap-2 px-6 py-3.5 bg-white text-black font-black rounded-2xl text-[14px] hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(255,255,255,0.1)]"
           >
             <Plus size={18} strokeWidth={3} /> Create Playlist
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Liked Songs Hero Card - Left side on desktop */}
        <div className="lg:col-span-5 xl:col-span-4">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             onClick={() => { if (likedTracks.length > 0) playTrackFromList(likedTracks[0], likedTracks); }}
             className="group relative h-[280px] md:h-[340px] rounded-[40px] overflow-hidden cursor-pointer shadow-2xl border border-white/5"
           >
              <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed] via-[#ec4899] to-[#050508]" />
              {/* Dynamic Smoke Orbs inside card */}
              <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-white/10 blur-[80px] group-hover:scale-125 transition-transform duration-1000" />
              
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                 <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-3xl rounded-3xl flex items-center justify-center mb-6 border border-white/20 shadow-2xl">
                    <Heart size={32} fill="white" className="text-white" />
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2">Liked Songs</h2>
                 <p className="text-white/80 font-bold tracking-widest uppercase text-xs md:text-sm">{likedTracks.length} Saved Tracks</p>
              </div>

              {/* Float Play Button */}
              <div className="absolute bottom-8 right-8 w-16 h-16 bg-white rounded-full flex items-center justify-center text-black shadow-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                 <Play size={28} fill="currentColor" className="ml-1" />
              </div>

              {/* Surface Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
           </motion.div>
        </div>

        {/* Content Area - Playlists / Liked List */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-10">
           {/* Section Header */}
           <div className="flex items-center justify-between mb-2">
              <h2 className="text-[22px] font-black text-white tracking-tight">Your Collections</h2>
              {playlists.length > 0 && <span className="text-[var(--t3)] font-mono text-sm">{playlists.length} FOLDERS</span>}
           </div>

           {playlists.length === 0 ? (
             <div className="h-[300px] flex flex-col items-center justify-center rounded-[40px] border border-dashed border-white/10 bg-white/[0.02]">
                <Music size={48} className="text-[var(--t3)] mb-4 opacity-40" />
                <p className="text-white font-bold text-lg mb-1">Your playlists will live here</p>
                <p className="text-[var(--t2)] text-sm mb-6 max-w-xs text-center">Organize your music by mood, energy, or activity.</p>
                <button 
                  onClick={() => setShowCreate(true)}
                  className="px-8 py-3 bg-white/5 border border-white/10 text-white font-black rounded-full hover:bg-white/10 transition-all"
                >
                  Start a Collection
                </button>
             </div>
           ) : (
             <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                {playlists.map((playlist) => (
                  <motion.div
                    key={playlist.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`group relative ${viewMode === 'grid' ? 'p-3 rounded-[32px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06]' : 'flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5'} transition-all cursor-pointer`}
                    onClick={() => playlist.tracks.length > 0 && playTrackFromList(playlist.tracks[0], playlist.tracks)}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className="aspect-square rounded-[24px] overflow-hidden mb-4 relative shadow-xl bg-[var(--s2)]">
                           <div className="absolute inset-0 opacity-40" style={{ background: `linear-gradient(135deg, ${playlist.color}, transparent)` }} />
                           <div className="flex items-center justify-center h-full text-white/20">
                              <Music size={64} strokeWidth={1} />
                           </div>
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]">
                              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-black shadow-2xl scale-75 group-hover:scale-100 transition-all duration-300">
                                 <Play size={24} fill="currentColor" className="ml-1" />
                              </div>
                           </div>
                        </div>
                        <div className="px-1">
                           <h3 className="text-white font-bold text-[15px] truncate group-hover:text-[var(--acc)] transition-colors">{playlist.name}</h3>
                           <p className="text-[var(--t2)] text-[12px] font-medium tracking-wide uppercase truncate mt-0.5">{playlist.tracks.length} Tracks</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-xl overflow-hidden relative flex-shrink-0 bg-white/5 border border-white/10">
                           <div className="absolute inset-0 opacity-40" style={{ background: playlist.color }} />
                           <div className="flex items-center justify-center h-full text-white/20"><Music size={24} /></div>
                        </div>
                        <div className="flex-1 min-w-0">
                           <h3 className="text-white font-bold truncate group-hover:text-[var(--acc)] transition-colors">{playlist.name}</h3>
                           <p className="text-[var(--t2)] text-xs mt-0.5">{playlist.tracks.length} songs • {playlist.description || 'Custom collection'}</p>
                        </div>
                        <ChevronRight size={20} className="text-[var(--t3)] group-hover:text-white transition-colors" />
                      </>
                    )}
                  </motion.div>
                ))}
             </div>
           )}
        </div>
      </div>

      {/* Recommended for You section could go here */}

      {/* Create Playlist Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[#050508]/80 backdrop-blur-xl animate-fade-in" onClick={() => setShowCreate(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-[#0d0d14] p-8 md:p-12 rounded-[48px] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-[var(--acc)]/20 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-3xl font-black text-white tracking-tight">Create Playlist</h3>
                <button onClick={() => setShowCreate(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-[var(--t3)] hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6 relative z-10">
                <div>
                  <label className="text-[10px] font-black text-[var(--t3)] uppercase tracking-widest mb-2 block ml-1">Playlist Identity</label>
                  <input 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    placeholder="E.g. Neon Nights or Deep Focus" 
                    className="w-full bg-white/[0.04] border border-white/5 rounded-2xl px-6 py-5 text-white font-bold placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--acc)]/30 transition-all" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-[var(--t3)] uppercase tracking-widest mb-2 block ml-1">Story / Vibe</label>
                  <textarea 
                    value={newDesc} 
                    onChange={(e) => setNewDesc(e.target.value)} 
                    placeholder="Describe the mood of these tracks..." 
                    rows={4} 
                    className="w-full bg-white/[0.04] border border-white/5 rounded-2xl px-6 py-5 text-white font-bold placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--acc)]/30 transition-all resize-none" 
                  />
                </div>
              </div>

              <button 
                onClick={() => { 
                  if (newName.trim()) {
                    createPlaylist(newName, newDesc, '#7c3aed');
                    setShowCreate(false); setNewName(''); setNewDesc(''); 
                  }
                }} 
                disabled={!newName.trim()}
                className="w-full mt-10 py-5 bg-white text-black font-black rounded-3xl text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] relative z-10 disabled:opacity-50"
              >
                Launch Collection
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
