import { Track } from './tracks';

// --- Types for YouTube API Responses ---

interface YouTubeSnippet {
  title: string;
  description: string;
  thumbnails: {
    default?: { url: string };
    medium?: { url: string };
    high?: { url: string };
    maxres?: { url: string };
  };
  channelTitle: string;
  publishedAt: string;
  categoryId?: string;
}

interface YouTubeSearchItem {
  id: { videoId: string } | string;
  snippet: YouTubeSnippet;
  contentDetails?: { duration: string };
  statistics?: { viewCount: string };
}

interface YouTubeResponse {
  items: YouTubeSearchItem[];
  nextPageToken?: string;
  pageInfo?: { totalResults: number; resultsPerPage: number };
}

// --- Cache ---

const cache = new Map<string, { data: YouTubeResponse; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key: string): YouTubeResponse | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: YouTubeResponse) {
  cache.set(key, { data, timestamp: Date.now() });
}

// --- API Functions ---

async function fetchYouTube(params: string): Promise<YouTubeResponse> {
  const cached = getCached(params);
  if (cached) return cached;

  const res = await fetch(`/api/youtube?${params}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'YouTube API request failed');
  }
  const data = await res.json();
  setCache(params, data);
  return data;
}

export async function searchYouTube(query: string, maxResults = 20): Promise<Track[]> {
  if (!query.trim()) return [];
  const data = await fetchYouTube(`type=search&q=${encodeURIComponent(query)}&maxResults=${maxResults}`);
  const items = data.items.filter((item) => {
    const id = typeof item.id === 'string' ? item.id : item.id?.videoId;
    return !!id && !!item.snippet;
  });

  // Get video details (duration, stats) for search results
  const videoIds = items.map((item) => typeof item.id === 'string' ? item.id : item.id.videoId).join(',');
  if (!videoIds) return [];

  const detailsData = await fetchYouTube(`type=details&videoId=${videoIds}`);
  return mapYouTubeItemsToTracks(detailsData.items);
}

export async function getTrendingMusic(maxResults = 20): Promise<Track[]> {
  const data = await fetchYouTube(`type=trending&maxResults=${maxResults}`);
  return mapYouTubeItemsToTracks(data.items);
}

export async function getVideoDetails(videoIds: string[]): Promise<Track[]> {
  if (videoIds.length === 0) return [];
  const data = await fetchYouTube(`type=details&videoId=${videoIds.join(',')}`);
  return mapYouTubeItemsToTracks(data.items);
}

// --- Helpers ---

export function parseDuration(isoDuration: string): number {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function cleanTitle(title: string): { cleanedTitle: string; artist: string } {
  // Try to extract artist from common patterns like "Artist - Song Title"
  const decoded = title
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  // Remove common suffixes
  const cleaned = decoded
    .replace(/\s*\(Official\s*(Music\s*)?Video\)/gi, '')
    .replace(/\s*\[Official\s*(Music\s*)?Video\]/gi, '')
    .replace(/\s*\(Official\s*Audio\)/gi, '')
    .replace(/\s*\[Official\s*Audio\]/gi, '')
    .replace(/\s*\(Lyrics?\)/gi, '')
    .replace(/\s*\[Lyrics?\]/gi, '')
    .replace(/\s*\(Official\s*Lyric\s*Video\)/gi, '')
    .replace(/\s*\[Official\s*Lyric\s*Video\]/gi, '')
    .replace(/\s*\|\s*.*$/, '')
    .replace(/\s*HD\s*$/i, '')
    .replace(/\s*HQ\s*$/i, '')
    .trim();

  // Try to split "Artist - Song" pattern
  const dashMatch = cleaned.match(/^(.+?)\s*[-–—]\s*(.+)$/);
  if (dashMatch) {
    return { artist: dashMatch[1].trim(), cleanedTitle: dashMatch[2].trim() };
  }

  return { cleanedTitle: cleaned, artist: '' };
}

function getThumbUrl(snippet: YouTubeSnippet): string {
  return snippet.thumbnails.maxres?.url
    || snippet.thumbnails.high?.url
    || snippet.thumbnails.medium?.url
    || snippet.thumbnails.default?.url
    || '';
}

function mapYouTubeItemsToTracks(items: YouTubeSearchItem[]): Track[] {
  return items
    .filter((item) => !!item.snippet)
    .map((item) => {
      const videoId = typeof item.id === 'string' ? item.id : item.id.videoId;
      const { cleanedTitle, artist } = cleanTitle(item.snippet.title);
      const duration = item.contentDetails?.duration
        ? parseDuration(item.contentDetails.duration)
        : 0;

      return {
        id: videoId,
        title: cleanedTitle,
        artist: artist || item.snippet.channelTitle.replace(/\s*-\s*Topic$/, ''),
        album: '',
        genre: '',
        mood: '',
        duration,
        videoId,
        cover: getThumbUrl(item.snippet),
        dominantColor: '#1a1a2e',
        lyrics: [],
      };
    });
}
