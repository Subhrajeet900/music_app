'use client';
import { useAuthStore } from '@/store/authStore';
import { usePlayerStore } from '@/store/playerStore';
import { User, Heart, Music, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { username, email, logout } = useAuthStore();
  const { likedSongs } = usePlayerStore();
  const router = useRouter();
  const likedCount = likedSongs.length;

  const initial = (username || 'U')[0].toUpperCase();

  return (
    <div className="min-h-full pb-32 p-5 md:p-6">
      <div className="flex items-center gap-6 mb-10">
        <div className="w-24 h-24 rounded-full bg-[#e2a93b] flex items-center justify-center shadow-xl text-[#0d1117] text-4xl font-bold">
          {initial}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#e6edf3]">{username || 'User'}</h1>
          <p className="text-[#7d8590] text-sm mt-1">{email}</p>
          <p className="text-[#484f58] text-xs mt-1">{likedCount} liked songs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-[#1c2333] rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#e2a93b]/15 rounded-full flex items-center justify-center">
            <Heart size={22} className="text-[#e2a93b]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#e6edf3]">{likedCount}</p>
            <p className="text-[#7d8590] text-xs">Liked Songs</p>
          </div>
        </div>
        <div className="bg-[#1c2333] rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#e2a93b]/15 rounded-full flex items-center justify-center">
            <Music size={22} className="text-[#e2a93b]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#e6edf3]">5</p>
            <p className="text-[#7d8590] text-xs">Playlists</p>
          </div>
        </div>
        <div className="bg-[#1c2333] rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#e2a93b]/15 rounded-full flex items-center justify-center">
            <User size={22} className="text-[#e2a93b]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#e6edf3]">12</p>
            <p className="text-[#7d8590] text-xs">Following</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => { logout(); router.push('/login'); }}
        className="flex items-center gap-2 px-6 py-3 border border-white/[0.08] rounded-full text-[#7d8590] hover:text-[#e6edf3] hover:border-white/[0.15] transition-all active:scale-[0.96]"
      >
        <LogOut size={18} /> Log out
      </button>
    </div>
  );
}
