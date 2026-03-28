import { create } from 'zustand';
import { Track } from '@/lib/tracks';

type RepeatMode = 'off' | 'all' | 'one';

interface YouTubePlayerRef {
  seekTo: (seconds: number) => void;
}

interface PlayerStore {
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
  showLyrics: boolean;
  showQueue: boolean;
  youtubePlayerRef: YouTubePlayerRef | null;

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
}

const loadLikedSongs = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('likedSongs');
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
};

const saveLikedSongs = (ids: string[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('likedSongs', JSON.stringify(ids));
};

const loadLikedTracksData = (): Track[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('likedTracksData');
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
};

const saveLikedTracksData = (tracks: Track[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('likedTracksData', JSON.stringify(tracks));
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 0.8,
  previousVolume: 0.8,
  progress: 0,
  currentTime: 0,
  shuffle: false,
  repeatMode: 'off',
  likedSongs: loadLikedSongs(),
  likedTracksData: loadLikedTracksData(),
  showLyrics: false,
  showQueue: false,
  youtubePlayerRef: null,

  setTrack: (track) => {
    set({ currentTrack: track, isPlaying: true, progress: 0, currentTime: 0 });
  },

  setQueue: (tracks) => set({ queue: tracks }),

  addToQueue: (track) => {
    const { queue } = get();
    if (!queue.find(t => t.id === track.id)) {
      set({ queue: [...queue, track] });
    }
  },

  removeFromQueue: (id) => {
    set({ queue: get().queue.filter(t => t.id !== id) });
  },

  clearQueue: () => set({ queue: [] }),

  togglePlay: () => {
    const { isPlaying, currentTrack } = get();
    if (!currentTrack) return;
    set({ isPlaying: !isPlaying });
  },

  nextTrack: () => {
    const { currentTrack, queue, shuffle, repeatMode } = get();
    if (!currentTrack || queue.length === 0) return;

    if (repeatMode === 'one') {
      set({ progress: 0, currentTime: 0, isPlaying: true });
      const ref = get().youtubePlayerRef;
      if (ref) ref.seekTo(0);
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
    const { currentTrack, queue, currentTime } = get();
    if (!currentTrack || queue.length === 0) return;

    // If more than 3 seconds into the song, restart it
    if (currentTime > 3) {
      set({ progress: 0, currentTime: 0, isPlaying: true });
      const ref = get().youtubePlayerRef;
      if (ref) ref.seekTo(0);
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
    const { likedSongs, likedTracksData, currentTrack, queue } = get();
    const isCurrentlyLiked = likedSongs.includes(id);

    if (isCurrentlyLiked) {
      // Unlike
      const updatedIds = likedSongs.filter(s => s !== id);
      const updatedData = likedTracksData.filter(t => t.id !== id);
      saveLikedSongs(updatedIds);
      saveLikedTracksData(updatedData);
      set({ likedSongs: updatedIds, likedTracksData: updatedData });
    } else {
      // Like — also save the track data
      const updatedIds = [...likedSongs, id];
      const trackToSave = currentTrack?.id === id
        ? currentTrack
        : queue.find(t => t.id === id);

      let updatedData = likedTracksData;
      if (trackToSave && !likedTracksData.find(t => t.id === id)) {
        updatedData = [...likedTracksData, trackToSave];
      }

      saveLikedSongs(updatedIds);
      saveLikedTracksData(updatedData);
      set({ likedSongs: updatedIds, likedTracksData: updatedData });
    }
  },

  isLiked: (id) => get().likedSongs.includes(id),

  setShowLyrics: (show) => set({ showLyrics: show, showQueue: show ? false : get().showQueue }),
  setShowQueue: (show) => set({ showQueue: show, showLyrics: show ? false : get().showLyrics }),

  playTrackFromList: (track, list) => {
    set({
      currentTrack: track,
      queue: list,
      isPlaying: true,
      progress: 0,
      currentTime: 0,
    });
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
    const { likedTracksData } = get();
    if (!likedTracksData.find(t => t.id === track.id)) {
      const updated = [...likedTracksData, track];
      saveLikedTracksData(updated);
      set({ likedTracksData: updated });
    }
  },

  removeLikedTrackData: (id) => {
    const updated = get().likedTracksData.filter(t => t.id !== id);
    saveLikedTracksData(updated);
    set({ likedTracksData: updated });
  },
}));
