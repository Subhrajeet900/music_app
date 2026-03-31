'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usePlayerStore } from '@/store/playerStore';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function ProfilePage() {
  const { username, email, logout } = useAuthStore();
  const { likedSongs, playlists } = usePlayerStore();
  const router = useRouter();
  
  const [songsPlayed, setSongsPlayed] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(username || '');

  // Toggles
  const [privateSession, setPrivateSession] = useState(false);
  const [explicitContent, setExplicitContent] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

  const headerReveal = useScrollReveal();
  const editReveal = useScrollReveal();
  const accReveal = useScrollReveal();
  const prefReveal = useScrollReveal();
  const dangerReveal = useScrollReveal();

  useEffect(() => {
    // Mock songs played counter
    if (typeof window !== 'undefined' && email) {
      const sp = localStorage.getItem(`moodtunes_plays_${email}`);
      setSongsPlayed(sp ? parseInt(sp, 10) : 142);
    }
  }, [email]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSaveProfile = () => {
    // In a real app we'd call an API and update authStore state here.
    // For this mock, we just exit edit mode.
    setIsEditing(false);
  };

  const initial = (username || 'U')[0].toUpperCase();

  return (
    <div className="min-h-full pb-32 w-full flex justify-center animate-page-enter">
      <div className="w-full max-w-[680px] p-5 md:p-10 flex flex-col gap-6">
        
        {/* Profile Header Card */}
        <div ref={headerReveal.ref} className={`bg-[var(--s1)] border border-[rgba(255,255,255,0.06)] rounded-[20px] p-8 flex flex-col items-center reveal ${headerReveal.isVisible ? 'revealed' : ''}`}>
          
          <div className="relative mb-5">
            <div className="absolute inset-[-6px] rounded-full border border-[rgba(200,205,212,0.1)] border-dashed animate-aura-spin pointer-events-none" />
            <div className="w-[88px] h-[88px] rounded-full bg-[var(--s2)] border-2 border-[var(--s3)] flex items-center justify-center shadow-xl text-[var(--acc)] text-[32px] font-sans font-bold z-10 relative">
              {initial}
            </div>
          </div>
          
          <h1 className="text-[24px] font-bold text-[var(--t1)] font-sans">{username || 'User'}</h1>
          <p className="text-[var(--t2)] text-[13px] mt-0.5">{email}</p>
          <p className="text-[var(--t3)] text-[11px] mt-1 mb-8">Member since 2026</p>

          <div className="w-full flex gap-3">
            {[
              { label: 'Liked Songs', count: likedSongs.length, delay: '0ms' },
              { label: 'Playlists', count: playlists.length, delay: '80ms' },
              { label: 'Songs Played', count: songsPlayed, delay: '160ms' }
            ].map((stat, i) => (
              <div 
                key={stat.label} 
                className={`flex-1 bg-[var(--s2)] rounded-[12px] p-[14px] px-5 flex flex-col items-center justify-center reveal-scale ${headerReveal.isVisible ? 'revealed' : ''}`}
                style={{ transitionDelay: stat.delay }}
              >
                <span className="text-[22px] font-sans font-bold text-[var(--t1)]">{stat.count}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--t2)] mt-1 text-center">{stat.label}</span>
              </div>
            ))}
          </div>

          {!isEditing && (
            <button 
              onClick={() => { setEditName(username); setIsEditing(true); }}
              className="mt-6 px-5 py-2 border border-[var(--s3)] rounded-[10px] text-[13px] font-bold text-[var(--t2)] hover:text-[var(--t1)] hover:bg-[var(--s2)] transition-colors button-active-anim"
            >
              Edit Profile
            </button>
          )}

          {isEditing && (
            <div ref={editReveal.ref} className={`w-full mt-6 bg-[var(--s2)] rounded-[12px] p-5 border border-[var(--s3)] flex flex-col gap-4 reveal-scale ${editReveal.isVisible ? 'revealed' : ''}`}>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase font-bold tracking-widest text-[var(--t3)]">Display Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="bg-[var(--bg)] border border-[var(--s4)] rounded-[8px] px-3 py-2 text-[13px] text-[var(--t1)] font-sans focus:outline-none focus:border-[var(--acc)] transition-colors"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-1.5 text-[12px] font-bold text-[var(--t2)] hover:text-[var(--t1)] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="px-4 py-1.5 bg-[var(--acc)] text-[var(--bg)] rounded-[8px] text-[12px] font-bold hover:bg-white transition-colors button-active-anim"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Account Section */}
        <div ref={accReveal.ref} className={`bg-[var(--s1)] border border-[rgba(255,255,255,0.06)] rounded-[20px] p-6 reveal ${accReveal.isVisible ? 'revealed' : ''}`}>
          <h2 className="text-[16px] font-sans font-bold text-[var(--t1)] mb-4">Account</h2>
          <div className="flex items-center justify-between py-[14px] border-b border-[rgba(255,255,255,0.04)]">
            <span className="text-[13px] text-[var(--t2)] font-medium">Email</span>
            <span className="text-[14px] text-[var(--t1)] font-sans">{email}</span>
          </div>
          <div className="flex items-center justify-between py-[14px] border-b border-[rgba(255,255,255,0.04)]">
            <span className="text-[13px] text-[var(--t2)] font-medium">Password</span>
            <button className="px-4 py-1.5 border border-[var(--s3)] rounded-[8px] text-[12px] font-bold text-[var(--t1)] hover:bg-[var(--s2)] transition-colors button-active-anim">
              Change Password
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div ref={prefReveal.ref} className={`bg-[var(--s1)] border border-[rgba(255,255,255,0.06)] rounded-[20px] p-6 reveal ${prefReveal.isVisible ? 'revealed' : ''}`}>
          <h2 className="text-[16px] font-sans font-bold text-[var(--t1)] mb-4">Preferences</h2>
          {[
            { id: 'private', label: 'Private Session', desc: 'Hide your listening activity from friends', state: privateSession, setter: setPrivateSession },
            { id: 'explicit', label: 'Explicit Content', desc: 'Allow playback of explicit tracks', state: explicitContent, setter: setExplicitContent },
            { id: 'notif', label: 'Notifications', desc: 'Receive updates about new releases', state: notifications, setter: setNotifications },
            { id: 'auto', label: 'Autoplay', desc: 'Enjoy nonstop music after your queue ends', state: autoplay, setter: setAutoplay },
          ].map(pref => (
            <div key={pref.id} className="flex items-center justify-between py-[14px] border-b border-[rgba(255,255,255,0.04)] last:border-0 last:pb-0">
              <div className="flex flex-col gap-0.5 pr-4">
                <span className="text-[14px] text-[var(--t1)] font-sans font-medium">{pref.label}</span>
                <span className="text-[12px] text-[var(--t3)] leading-tight">{pref.desc}</span>
              </div>
              <button 
                onClick={() => pref.setter(!pref.state)}
                className={`w-[36px] h-[20px] rounded-full relative transition-colors ${pref.state ? 'bg-[var(--acc)]' : 'bg-[var(--s3)]'}`}
              >
                <span 
                  className={`absolute top-[2px] left-[2px] w-[16px] h-[16px] bg-white rounded-full transition-transform shadow flex items-center justify-center ${pref.state ? 'transform translate-x-[16px]' : ''}`}
                >
                  <span className={`w-2 h-2 rounded-full ${pref.state ? 'bg-[var(--acc)]' : 'bg-[var(--s3)]'}`} />
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Danger Zone */}
        <div ref={dangerReveal.ref} className={`border border-[rgba(220,50,50,0.15)] bg-[rgba(220,50,50,0.02)] rounded-[12px] p-4 reveal ${dangerReveal.isVisible ? 'revealed' : ''}`}>
          <button 
            onClick={handleLogout}
            className="w-full py-3 bg-[rgba(220,50,50,0.1)] border border-[rgba(220,50,50,0.2)] rounded-[8px] text-[13px] font-bold text-[#f87171] hover:bg-[rgba(220,50,50,0.15)] flex items-center justify-center gap-2 transition-colors button-active-anim"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>

      </div>
    </div>
  );
}
