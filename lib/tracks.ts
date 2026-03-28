export type Track = {
  id: string
  title: string
  artist: string
  album: string
  genre: string
  mood: string
  duration: number
  videoId: string
  cover: string
  dominantColor: string
  lyrics: string[]
}

export const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};
