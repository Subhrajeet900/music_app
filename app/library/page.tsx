'use client';
import { useState } from 'react';
import { Heart, Plus, X, Music, Play } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { formatDuration } from '@/lib/tracks';

export default function LibraryPage() {
  const likedSongs = usePlayerStore(state => state.likedSongs);
  const likedTracksData = usePlayerStore(state => state.likedTracksData);
  const playTrackFromList = usePlayerStore(state => state.playTrackFromList);
  const playlists = usePlayerStore(state => state.playlists);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const likedTracks = likedTracksData.filter(t => likedSongs.includes(t.id));

  return (
    <div className="min-h-full pb-32 p-5 md:p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-[#e6edf3] tracking-tight">Your Library</h1>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-[#e2a93b] hover:bg-[#c9952f] text-[#0d1117] font-medium rounded-full text-sm transition-all active:scale-[0.96]">
          <Plus size={16} /> Create Playlist
        </button>
      </div>

      {/* Liked Songs Card */}
      <div
        onClick={() => { if (likedTracks.length > 0) playTrackFromList(likedTracks[0], likedTracks); }}
        className="mb-8 bg-gradient-to-br from-[#e2a93b]/20 to-[#161b22] rounded-2xl p-6 cursor-pointer hover:from-[#e2a93b]/30 transition-all group relative overflow-hidden"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#e2a93b] to-[#f0c75e] rounded-xl flex items-center justify-center shadow-lg">
            <Heart size={28} fill="currentColor" className="text-[#0d1117]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#e6edf3]">Liked Songs</h2>
            <p className="text-[#7d8590] text-sm">{likedTracks.length} song{likedTracks.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
          <div className="w-12 h-12 bg-[#e2a93b] rounded-full flex items-center justify-center shadow-xl hover:scale-105">
            <Play size={20} fill="currentColor" className="text-[#0d1117] ml-0.5" />
          </div>
        </div>
      </div>

      {/* Liked Songs List */}
      {likedTracks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#e6edf3] mb-4">Your Liked Songs</h2>
          <div className="space-y-1">
            {likedTracks.map((track, i) => (
              <div
                key={track.id}
                onClick={() => playTrackFromList(track, likedTracks)}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/[0.03] transition-colors group"
              >
                <span className="text-[#484f58] text-sm w-6 text-right tabular-nums">{i + 1}</span>
                <img src={track.cover} alt={track.title} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-[#e6edf3] text-sm font-medium truncate">{track.title}</p>
                  <p className="text-[#7d8590] text-xs truncate">{track.artist}</p>
                </div>
                <span className="text-xs text-[#484f58]">{track.duration > 0 ? formatDuration(track.duration) : ''}</span>
                <div className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                  <button className="w-8 h-8 bg-[#e2a93b] rounded-full flex items-center justify-center text-[#0d1117] shadow-lg hover:scale-105">
                    <Play size={12} fill="currentColor" className="ml-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Playlist Grid */}
      <h2 className="text-lg font-bold text-[#e6edf3] mb-4">Your Playlists</h2>
      {playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white/[0.02] rounded-3xl border border-dashed border-white/[0.1] text-center">
          <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center mb-4">
            <Music size={32} className="text-[#484f58]" />
          </div>
          <h3 className="text-[#e6edf3] font-bold mb-1">No playlists yet</h3>
          <p className="text-[#7d8590] text-sm mb-6 max-w-xs">Create your first playlist to start organizing your musical universe.</p>
          <button 
            onClick={() => setShowCreate(true)}
            className="px-6 py-2 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform active:scale-95"
          >
            Create Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-10">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-[#1c2333]/40 border border-white/[0.03] hover:border-white/[0.1] hover:bg-[#252d3a]/60 rounded-2xl p-4 cursor-pointer transition-all group backdrop-blur-md"
              onClick={() => {
                if (playlist.tracks.length > 0) {
                  playTrackFromList(playlist.tracks[0], playlist.tracks);
                }
              }}
            >
              <div className="aspect-square mb-3 rounded-xl overflow-hidden bg-gradient-to-br from-[#1e3a8a]/20 to-black relative shadow-2xl">
                <div 
                  className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity" 
                  style={{ background: `radial-gradient(circle at center, ${playlist.color}80 0%, transparent 70%)` }} 
                />
                <div className="w-full h-full flex items-center justify-center relative z-10 scale-90 group-hover:scale-100 transition-transform duration-500">
                  <Music size={48} className="text-white/20" />
                </div>
                
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <div className="w-10 h-10 bg-[var(--acc)] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90">
                    <Play size={16} fill="currentColor" className="text-black ml-0.5" />
                  </div>
                </div>
              </div>
              <h3 className="text-[#f0f2f4] text-sm font-bold truncate mb-1">{playlist.name}</h3>
              <p className="text-[#9098A0] text-xs truncate">{playlist.tracks.length} songs • {playlist.description || 'Custom Mix'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-md animate-[fade-in_0.2s_ease-out]" onClick={() => setShowCreate(false)}>
          <div className="bg-[#0a0c10] w-full max-w-sm mx-4 p-8 rounded-[32px] border border-white/[0.08] shadow-[0_0_50px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#f0f2f4] tracking-tight">New Playlist</h3>
              <button onClick={() => setShowCreate(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.05] text-[#7d8590] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#7d8590] uppercase tracking-widest ml-1 mb-1.5 block">Name</label>
                <input 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  autoFocus
                  placeholder="Midnight Drive..." 
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 text-[#f0f2f4] placeholder-[#484f58] focus:outline-none focus:border-[var(--acc)] transition-all" 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#7d8590] uppercase tracking-widest ml-1 mb-1.5 block">Description</label>
                <textarea 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)} 
                  placeholder="Songs for the long haul..." 
                  rows={3} 
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 text-[#f0f2f4] placeholder-[#484f58] focus:outline-none focus:border-[var(--acc)] transition-all resize-none shadow-inner" 
                />
              </div>
            </div>

            <button 
              onClick={() => { 
                if (newName.trim()) {
                  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];
                  const color = colors[Math.floor(Math.random() * colors.length)];
                  usePlayerStore.getState().createPlaylist(newName, newDesc, color);
                  setShowCreate(false); 
                  setNewName(''); 
                  setNewDesc(''); 
                }
              }} 
              disabled={!newName.trim()}
              className="w-full mt-8 py-4 bg-white text-black font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 shadow-xl shadow-white/5"
            >
              Create Playlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
