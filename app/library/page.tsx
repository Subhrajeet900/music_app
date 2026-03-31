'use client';
import { useState } from 'react';
import { Heart, Plus, X, Music, Play } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { formatDuration } from '@/lib/tracks';

const PLAYLISTS = [
  { id: 'p1', title: 'Midnight Vibes', desc: 'Late night chill', img: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&q=80&w=200' },
  { id: 'p2', title: 'Focus Flow', desc: 'Deep work sessions', img: 'https://images.unsplash.com/photo-1497211419994-14ae40a3c7a3?auto=format&fit=crop&q=80&w=200' },
  { id: 'p3', title: 'Workout Mix', desc: 'High energy tracks', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=200' },
  { id: 'p4', title: 'Chill Evenings', desc: 'Relax and unwind', img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=200' },
  { id: 'p5', title: 'Road Trip', desc: 'Songs for the journey', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=200' },
];

export default function LibraryPage() {
  const { likedSongs, likedTracksData, playTrackFromList } = usePlayerStore();
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
      <h2 className="text-lg font-bold text-[#e6edf3] mb-4">Playlists</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {PLAYLISTS.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-[#1c2333] hover:bg-[#252d3a] rounded-xl p-4 cursor-pointer transition-all group"
          >
            <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-[#252d3a] relative">
              {playlist.img ? (
                <img src={playlist.img} alt={playlist.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music size={40} className="text-[#484f58]" />
                </div>
              )}
              <div className="absolute bottom-2 right-2 opacity-100 md:opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                <div className="w-10 h-10 bg-[#e2a93b] rounded-full flex items-center justify-center shadow-xl hover:scale-105">
                  <Play size={16} fill="currentColor" className="text-[#0d1117] ml-0.5" />
                </div>
              </div>
            </div>
            <h3 className="text-[#e6edf3] text-sm font-medium truncate">{playlist.title}</h3>
            <p className="text-[#7d8590] text-xs truncate">{playlist.desc}</p>
          </div>
        ))}
      </div>

      {/* Create Playlist Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
          <div className="bg-[#161b22] w-full max-w-sm mx-4 p-6 rounded-2xl border border-white/[0.06] shadow-2xl animate-[fade-in_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#e6edf3]">Create Playlist</h3>
              <button onClick={() => setShowCreate(false)} className="text-[#484f58] hover:text-[#e6edf3]"><X size={20} /></button>
            </div>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Playlist name" className="w-full bg-[#0d1117] border border-white/[0.08] rounded-xl px-4 py-3 text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#e2a93b] mb-3" />
            <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description (optional)" rows={3} className="w-full bg-[#0d1117] border border-white/[0.08] rounded-xl px-4 py-3 text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#e2a93b] mb-4 resize-none" />
            <button onClick={() => { setShowCreate(false); setNewName(''); setNewDesc(''); }} className="w-full py-2.5 bg-[#e2a93b] hover:bg-[#c9952f] text-[#0d1117] font-bold rounded-xl transition-all active:scale-[0.96]">
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
