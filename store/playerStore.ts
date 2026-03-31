import { create } from 'zustand';
import { Track } from '@/lib/tracks';

type RepeatMode = 'off' | 'all' | 'one';

interface YouTubePlayerRef {
  seekTo: (seconds: number) => void;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  color: string;
  tracks: Track[];
}

interface PlayerStore {
  activeEmail: string | null;
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  previousVolume: number;
  progress: number;
  currentTime: number;
  shuffle: boolean;
  repeatMode: RepeatMode;
  likedSongs: string[];
  likedTracksData: Track[];
  playlists: Playlist[];
  showLyrics: boolean;
  showQueue: boolean;
  youtubePlayerRef: YouTubePlayerRef | null;

  initUserData: (email: string | null) => void;
  setTrack: (track: Track) => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setProgress: (p: number) => void;
  setCurrentTime: (t: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
  setShowLyrics: (show: boolean) => void;
  setShowQueue: (show: boolean) => void;
  playTrackFromList: (track: Track, list: Track[]) => void;
  setTrackDuration: (duration: number) => void;
  setYouTubePlayerRef: (ref: YouTubePlayerRef | null) => void;
  seekTo: (seconds: number) => void;
  saveLikedTrackData: (track: Track) => void;
  removeLikedTrackData: (id: string) => void;

  createPlaylist: (name: string, description: string, color: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
}

// Helper to save to user-bound local storage
const saveUserBoundData = (email: string, key: string, data: any) => {
  if (typeof window === 'undefined' || !email) return;
  localStorage.setItem(`moodtunes_${key}_${email}`, JSON.stringify(data));
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  activeEmail: null,
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 0.8,
  previousVolume: 0.8,
  progress: 0,
  currentTime: 0,
  shuffle: false,
  repeatMode: 'off',
  likedSongs: [],
  likedTracksData: [],
  playlists: [],
  showLyrics: false,
  showQueue: false,
  youtubePlayerRef: null,

  initUserData: (email: string | null) => {
    if (!email || typeof window === 'undefined') {
      set({ activeEmail: null, likedSongs: [], likedTracksData: [], playlists: [], queue: [] });
      return;
    }

    try {
      const storedQueue = localStorage.getItem(`moodtunes_queue_${email}`);
      const storedSongs = localStorage.getItem(`moodtunes_likedSongs_${email}`);
      const storedData = localStorage.getItem(`moodtunes_likedTracksData_${email}`);
      const storedPlaylists = localStorage.getItem(`moodtunes_playlists_${email}`);

      set({
        activeEmail: email,
        queue: storedQueue ? JSON.parse(storedQueue) : [],
        likedSongs: storedSongs ? JSON.parse(storedSongs) : [],
        likedTracksData: storedData ? JSON.parse(storedData) : [],
        playlists: storedPlaylists ? JSON.parse(storedPlaylists) : []
      });
    } catch {
      set({ activeEmail: email, likedSongs: [], likedTracksData: [], playlists: [], queue: [] });
    }
  },

  setTrack: (track) => {
    set({ currentTrack: track, isPlaying: true, progress: 0, currentTime: 0 });
  },

  setQueue: (tracks) => {
    const { activeEmail } = get();
    set({ queue: tracks });
    if (activeEmail) saveUserBoundData(activeEmail, 'queue', tracks);
  },

  addToQueue: (track) => {
    const { queue, activeEmail } = get();
    if (!queue.find(t => t.id === track.id)) {
      const newQueue = [...queue, track];
      set({ queue: newQueue });
      if (activeEmail) saveUserBoundData(activeEmail, 'queue', newQueue);
    }
  },

  removeFromQueue: (id) => {
    const { queue, activeEmail } = get();
    const newQueue = queue.filter(t => t.id !== id);
    set({ queue: newQueue });
    if (activeEmail) saveUserBoundData(activeEmail, 'queue', newQueue);
  },

  clearQueue: () => {
    set({ queue: [] });
    const { activeEmail } = get();
    if (activeEmail) saveUserBoundData(activeEmail, 'queue', []);
  },

  togglePlay: () => {
    const { isPlaying, currentTrack } = get();
    if (!currentTrack) return;
    set({ isPlaying: !isPlaying });
  },

  nextTrack: () => {
    const { currentTrack, queue, shuffle, repeatMode, youtubePlayerRef } = get();
    if (!currentTrack || queue.length === 0) return;

    if (repeatMode === 'one') {
      set({ progress: 0, currentTime: 0, isPlaying: true });
      if (youtubePlayerRef) youtubePlayerRef.seekTo(0);
      return;
    }

    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);

    if (shuffle) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * queue.length);
      } while (nextIndex === currentIndex && queue.length > 1);
      set({ currentTrack: queue[nextIndex], isPlaying: true, progress: 0, currentTime: 0 });
    } else {
      const nextIndex = (currentIndex + 1) % queue.length;
      if (nextIndex === 0 && repeatMode === 'off') {
        set({ isPlaying: false, progress: 0, currentTime: 0 });
        return;
      }
      set({ currentTrack: queue[nextIndex], isPlaying: true, progress: 0, currentTime: 0 });
    }
  },

  prevTrack: () => {
    const { currentTrack, queue, currentTime, youtubePlayerRef } = get();
    if (!currentTrack || queue.length === 0) return;

    if (currentTime > 3) {
      set({ progress: 0, currentTime: 0, isPlaying: true });
      if (youtubePlayerRef) youtubePlayerRef.seekTo(0);
      return;
    }

    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    set({ currentTrack: queue[prevIndex], isPlaying: true, progress: 0, currentTime: 0 });
  },

  setVolume: (v) => set({ volume: v, previousVolume: v > 0 ? v : get().previousVolume }),

  toggleMute: () => {
    const { volume, previousVolume } = get();
    if (volume > 0) {
      set({ previousVolume: volume, volume: 0 });
    } else {
      set({ volume: previousVolume || 0.8 });
    }
  },

  setProgress: (p) => set({ progress: p }),
  setCurrentTime: (t) => set({ currentTime: t }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),

  toggleShuffle: () => set({ shuffle: !get().shuffle }),

  cycleRepeat: () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const current = modes.indexOf(get().repeatMode);
    set({ repeatMode: modes[(current + 1) % 3] });
  },

  toggleLike: (id) => {
    const { likedSongs, likedTracksData, currentTrack, queue, activeEmail } = get();
    const isCurrentlyLiked = likedSongs.includes(id);

    if (isCurrentlyLiked) {
      const updatedIds = likedSongs.filter(s => s !== id);
      const updatedData = likedTracksData.filter(t => t.id !== id);
      set({ likedSongs: updatedIds, likedTracksData: updatedData });
      if (activeEmail) {
        saveUserBoundData(activeEmail, 'likedSongs', updatedIds);
        saveUserBoundData(activeEmail, 'likedTracksData', updatedData);
      }
    } else {
      const updatedIds = [...likedSongs, id];
      const trackToSave = currentTrack?.id === id
        ? currentTrack
        : queue.find(t => t.id === id);

      let updatedData = likedTracksData;
      if (trackToSave && !likedTracksData.find(t => t.id === id)) {
        updatedData = [...likedTracksData, trackToSave];
      }

      set({ likedSongs: updatedIds, likedTracksData: updatedData });
      if (activeEmail) {
        saveUserBoundData(activeEmail, 'likedSongs', updatedIds);
        saveUserBoundData(activeEmail, 'likedTracksData', updatedData);
      }
    }
  },

  isLiked: (id) => get().likedSongs.includes(id),

  setShowLyrics: (show) => set({ showLyrics: show, showQueue: show ? false : get().showQueue }),
  setShowQueue: (show) => set({ showQueue: show, showLyrics: show ? false : get().showLyrics }),

  playTrackFromList: (track, list) => {
    const { activeEmail } = get();
    set({
      currentTrack: track,
      queue: list,
      isPlaying: true,
      progress: 0,
      currentTime: 0,
    });
    if (activeEmail) saveUserBoundData(activeEmail, 'queue', list);
  },

  setTrackDuration: (duration) => {
    const { currentTrack } = get();
    if (currentTrack) {
      set({ currentTrack: { ...currentTrack, duration } });
    }
  },

  setYouTubePlayerRef: (ref) => set({ youtubePlayerRef: ref }),

  seekTo: (seconds) => {
    const { youtubePlayerRef } = get();
    if (youtubePlayerRef) {
      youtubePlayerRef.seekTo(seconds);
    }
  },

  saveLikedTrackData: (track) => {
    const { likedTracksData, activeEmail } = get();
    if (!likedTracksData.find(t => t.id === track.id)) {
      const updated = [...likedTracksData, track];
      set({ likedTracksData: updated });
      if (activeEmail) saveUserBoundData(activeEmail, 'likedTracksData', updated);
    }
  },

  removeLikedTrackData: (id) => {
    const { likedTracksData, activeEmail } = get();
    const updated = likedTracksData.filter(t => t.id !== id);
    set({ likedTracksData: updated });
    if (activeEmail) saveUserBoundData(activeEmail, 'likedTracksData', updated);
  },

  createPlaylist: (name, description, color) => {
    const { playlists, activeEmail } = get();
    const id = 'pl_' + Date.now() + Math.random().toString(36).substring(2, 9);
    const newPlaylist = { id, name, description, color, tracks: [] };
    const updated = [...playlists, newPlaylist];
    
    set({ playlists: updated });
    if (activeEmail) saveUserBoundData(activeEmail, 'playlists', updated);
  },

  addTrackToPlaylist: (playlistId, track) => {
    const { playlists, activeEmail } = get();
    const updated = playlists.map(p => {
      if (p.id === playlistId) {
        if (p.tracks.find(t => t.id === track.id)) return p; // already in
        return { ...p, tracks: [...p.tracks, track] };
      }
      return p;
    });

    set({ playlists: updated });
    if (activeEmail) saveUserBoundData(activeEmail, 'playlists', updated);
  },

  removeTrackFromPlaylist: (playlistId, trackId) => {
    const { playlists, activeEmail } = get();
    const updated = playlists.map(p => {
      if (p.id === playlistId) {
        return { ...p, tracks: p.tracks.filter(t => t.id !== trackId) };
      }
      return p;
    });

    set({ playlists: updated });
    if (activeEmail) saveUserBoundData(activeEmail, 'playlists', updated);
  }
}));

// Setup global event listeners for auth changes
if (typeof window !== 'undefined') {
  window.addEventListener('moodtunes_user_logged_in', (e: any) => {
    usePlayerStore.getState().initUserData(e.detail.email);
  });
  window.addEventListener('moodtunes_user_logged_out', () => {
    usePlayerStore.getState().initUserData(null);
  });
}
