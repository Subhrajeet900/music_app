'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore } from '@/store/playerStore';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface YTPlayer {
  loadVideoById: (videoId: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  getPlayerState: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
}

interface YTPlayerConstructor {
  new (element: HTMLElement, options: any): YTPlayer;
}

interface YTNamespace {
  Player: YTPlayerConstructor;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

declare global {
  interface Window {
    YT: YTNamespace;
    onYouTubeIframeAPIReady: () => void;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

let apiLoaded = false;
let apiReady = false;
const readyCallbacks: (() => void)[] = [];

function loadYouTubeAPI() {
  if (apiLoaded) return;
  apiLoaded = true;

  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode?.insertBefore(tag, firstScript);

  window.onYouTubeIframeAPIReady = () => {
    apiReady = true;
    readyCallbacks.forEach((cb) => cb());
    readyCallbacks.length = 0;
  };
}

function onAPIReady(cb: () => void) {
  if (apiReady) {
    cb();
  } else {
    readyCallbacks.push(cb);
  }
}

export function YouTubePlayer() {
  const playerRef = useRef<YTPlayer | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentVideoIdRef = useRef<string | null>(null);
  const playerInitialized = useRef(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    currentTrack,
    isPlaying,
    volume,
    nextTrack,
    prevTrack,
    togglePlay,
    seekTo,
  } = usePlayerStore();

  // Media Session API Setup
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.setActionHandler('play', () => {
      usePlayerStore.getState().setIsPlaying(true);
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      usePlayerStore.getState().setIsPlaying(false);
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      usePlayerStore.getState().prevTrack();
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      usePlayerStore.getState().nextTrack();
    });
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined) {
        usePlayerStore.getState().seekTo(details.seekTime);
      }
    });

    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
      navigator.mediaSession.setActionHandler('seekto', null);
    };
  }, []);

  // Sync Silent Audio with Playback State
  // This keeps the browser's audio context alive on mobile even when screen is locked
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        // Autoplay might be blocked until user interaction, 
        // but this usually works since it's triggered by a user's play click
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Update Media Session Metadata
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.artist,
      album: 'MoodTunes',
      artwork: [
        { src: currentTrack.cover, sizes: '96x96', type: 'image/jpeg' },
        { src: currentTrack.cover, sizes: '128x128', type: 'image/jpeg' },
        { src: currentTrack.cover, sizes: '192x192', type: 'image/jpeg' },
        { src: currentTrack.cover, sizes: '256x256', type: 'image/jpeg' },
        { src: currentTrack.cover, sizes: '384x384', type: 'image/jpeg' },
        { src: currentTrack.cover, sizes: '512x512', type: 'image/jpeg' },
      ],
    });
  }, [currentTrack]);

  // Update Media Session Playback State
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [isPlaying]);

  const clearProgressInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startProgressTracking = useCallback(() => {
    clearProgressInterval();
    intervalRef.current = setInterval(() => {
      const player = playerRef.current;
      if (player && typeof player.getCurrentTime === 'function' && typeof player.getDuration === 'function') {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        if (duration > 0) {
          const progress = (currentTime / duration) * 100;
          usePlayerStore.getState().setProgress(progress);
          usePlayerStore.getState().setCurrentTime(currentTime);

          const track = usePlayerStore.getState().currentTrack;
          if (track && (track.duration === 0 || Math.abs(track.duration - duration) > 2)) {
            usePlayerStore.getState().setTrackDuration(Math.floor(duration));
          }
        }
      }
    }, 500);
  }, [clearProgressInterval]);

  useEffect(() => {
    loadYouTubeAPI();

    onAPIReady(() => {
      if (!wrapperRef.current || playerInitialized.current) return;
      playerInitialized.current = true;

      // Create a disposable inner div for the YT.Player to replace.
      // This keeps React's DOM tree intact — React manages the wrapper,
      // and YouTube can freely replace the inner element with an iframe.
      const innerDiv = document.createElement('div');
      innerDiv.id = 'yt-player-target';
      wrapperRef.current.appendChild(innerDiv);

      playerRef.current = new window.YT.Player(innerDiv, {
        height: '0',
        width: '0',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            const player = playerRef.current;
            if (player) {
              player.setVolume(usePlayerStore.getState().volume * 100);
            }
          },
          onStateChange: (event: { data: number }) => {
            const state = event.data;
            if (state === window.YT.PlayerState.ENDED) {
              clearProgressInterval();
              usePlayerStore.getState().nextTrack();
            } else if (state === window.YT.PlayerState.PLAYING) {
              usePlayerStore.getState().setIsPlaying(true);
              startProgressTracking();
            } else if (state === window.YT.PlayerState.PAUSED) {
              clearProgressInterval();
            }
          },
          onError: (event: { data: number }) => {
            console.error('YouTube Player error:', event.data);
            clearProgressInterval();
            usePlayerStore.getState().nextTrack();
          },
        },
      });
    });

    return () => {
      clearProgressInterval();
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignore destroy errors
        }
        playerRef.current = null;
      }
      playerInitialized.current = false;
    };
  }, [clearProgressInterval, startProgressTracking]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !currentTrack?.videoId) return;

    if (currentVideoIdRef.current !== currentTrack.videoId) {
      currentVideoIdRef.current = currentTrack.videoId;
      if (typeof player.loadVideoById === 'function') {
        player.loadVideoById(currentTrack.videoId);
      }
    }
  }, [currentTrack?.videoId]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !currentTrack?.videoId) return;
    if (typeof player.getPlayerState !== 'function') return;

    try {
      const state = player.getPlayerState();
      if (isPlaying && state !== window.YT.PlayerState.PLAYING) {
        player.playVideo();
      } else if (!isPlaying && state === window.YT.PlayerState.PLAYING) {
        player.pauseVideo();
      }
    } catch (e) {
      // Player not ready yet
    }
  }, [isPlaying, currentTrack?.videoId]);

  useEffect(() => {
    const player = playerRef.current;
    if (player && typeof player.setVolume === 'function') {
      player.setVolume(volume * 100);
    }
  }, [volume]);

  useEffect(() => {
    usePlayerStore.getState().setYouTubePlayerRef({
      seekTo: (seconds: number) => {
        const player = playerRef.current;
        if (player && typeof player.seekTo === 'function') {
          player.seekTo(seconds, true);
        }
      },
    });

    return () => {
      usePlayerStore.getState().setYouTubePlayerRef(null);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        top: -9999,
        left: -9999,
        width: 0,
        height: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <audio
        ref={audioRef}
        loop
        src="data:audio/wav;base64,UklGRigAAABXQVZFRm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAP8A"
        style={{ display: 'none' }}
      />
    </div>
  );
}
