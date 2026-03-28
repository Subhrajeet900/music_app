import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'search';
  const query = searchParams.get('q') || '';
  const maxResults = searchParams.get('maxResults') || '20';
  const videoId = searchParams.get('videoId') || '';
  const pageToken = searchParams.get('pageToken') || '';

  if (!API_KEY) {
    return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
  }

  try {
    let url = '';

    if (type === 'search') {
      url = `${BASE_URL}/search?part=snippet&type=video&videoCategoryId=10&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`;
      if (pageToken) url += `&pageToken=${pageToken}`;
    } else if (type === 'trending') {
      url = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&videoCategoryId=10&regionCode=IN&maxResults=${maxResults}&key=${API_KEY}`;
      if (pageToken) url += `&pageToken=${pageToken}`;
    } else if (type === 'details') {
      if (!videoId) {
        return NextResponse.json({ error: 'videoId is required for details type' }, { status: 400 });
      }
      url = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;
    } else if (type === 'related') {
      // Use search with relatedToVideoId
      url = `${BASE_URL}/search?part=snippet&type=video&relatedToVideoId=${videoId}&maxResults=${maxResults}&key=${API_KEY}`;
    } else {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    const response = await fetch(url, { next: { revalidate: 300 } }); // Cache for 5 mins
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'YouTube API error' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('YouTube API proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch from YouTube API' }, { status: 500 });
  }
}
