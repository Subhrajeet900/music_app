'use client';
import { usePlayerStore } from '@/store/playerStore';
import { Track, formatDuration } from '@/lib/tracks';
import { Play, Heart, ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

const PLAYLISTS: Record<string, { title: string; desc: string }> = {
  'liked': { title: 'Liked Songs', desc: 'Your favorites' },
  'chill': { title: 'Chill Vibes', desc: 'Relax and unwind' },
  'workout': { title: 'Workout Mix', desc: 'Get pumped' },
  'focus': { title: 'Focus Flow', desc: 'Deep concentration' },
};

export default function PlaylistPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { playTrackFromList, likedSongs, likedTracksData, toggleLike, currentTrack, isPlaying } = usePlayerStore();

  const playlist = PLAYLISTS[id];
  if (!playlist) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <p className="text-[#7d8590]">Playlist not found</p>
      </div>
    );
  }

  const tracks: Track[] = id === 'liked'
    ? likedTracksData.filter(t => likedSongs.includes(t.id))
    : [];

  return (
    <div className="min-h-full pb-32 p-5 md:p-6">
      <button onClick={() => router.back()} className="text-[#7d8590] hover:text-[#e6edf3] mb-6 flex items-center gap-2 transition-colors">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="flex items-center gap-6 mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-[#e2a93b] to-[#f0c75e] rounded-xl flex items-center justify-center shadow-xl">
          <Heart size={48} className="text-[#0d1117]" fill={id === 'liked' ? 'currentColor' : 'none'} />
        </div>
        <div>
          <p className="text-xs text-[#7d8590] uppercase tracking-wider mb-1">Playlist</p>
          <h1 className="text-3xl font-bold text-[#e6edf3]">{playlist.title}</h1>
          <p className="text-[#7d8590] text-sm mt-1">{playlist.desc} · {tracks.length} songs</p>
        </div>
      </div>

      {tracks.length === 0 ? (
        <p className="text-[#7d8590] text-center py-10">No songs in this playlist yet</p>
      ) : (
        <div>
          <div className="mb-4">
            <button onClick={() => tracks.length > 0 && playTrackFromList(tracks[0], tracks)} className="w-12 h-12 bg-[#e2a93b] rounded-full flex items-center justify-center text-[#0d1117] shadow-lg hover:scale-105 hover:bg-[#c9952f] transition-all">
              <Play size={20} fill="currentColor" className="ml-0.5" />
            </button>
          </div>
          {tracks.map((track, i) => {
            const liked = likedSongs.includes(track.id);
            const playing = currentTrack?.id === track.id && isPlaying;
            return (
              <div key={track.id} onClick={() => playTrackFromList(track, tracks)} className={`grid grid-cols-[32px_48px_1fr_70px_32px] md:grid-cols-[32px_48px_1fr_1fr_70px_32px] gap-3 px-3 py-2 items-center cursor-pointer rounded-lg hover:bg-white/[0.03] group ${playing ? 'bg-[#e2a93b]/[0.06]' : ''}`}>
                <span className={`text-right text-sm ${playing ? 'text-[#e2a93b]' : 'text-[#484f58]'}`}>{playing ? '♪' : i + 1}</span>
                <div className="w-10 h-10 rounded-lg overflow-hidden"><img src={track.cover} className="w-full h-full object-cover" alt="" /></div>
                <div className="min-w-0"><p className={`text-sm font-medium truncate ${playing ? 'text-[#e2a93b]' : 'text-[#e6edf3]'}`}>{track.title}</p><p className="text-xs text-[#7d8590] truncate">{track.artist}</p></div>
                <span className="text-sm text-[#7d8590] truncate hidden md:block">{track.artist}</span>
                <span className="text-sm text-[#7d8590] text-right tabular-nums">{track.duration > 0 ? formatDuration(track.duration) : ''}</span>
                <button onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }} className={`flex items-center justify-center ${liked ? 'text-[#e2a93b]' : 'text-[#484f58] opacity-0 group-hover:opacity-100'}`}><Heart size={14} fill={liked ? 'currentColor' : 'none'} /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
