import 'server-only'

import { unstable_cache } from 'next/cache'
import { normalizeSearchTerm, spotifyTrackKey } from './spotify-utils'

export { spotifyTrackKey }

const TOKEN_REVALIDATE_SECONDS = 50 * 60
const SEARCH_REVALIDATE_SECONDS = 12 * 60 * 60

type SpotifyTokenResponse = { access_token: string }

export type SpotifyTrackSearchResult = {
  tracks: {
    items: Array<{ album: { images: Array<{ url: string }> } }>
  }
}

function spotifyCredentials() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error(
      'Spotify is not configured. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in the server environment.'
    )
  }

  return { clientId, clientSecret }
}

const getCachedToken = unstable_cache(
  async (): Promise<string> => {
    const { clientId, clientSecret } = spotifyCredentials()
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    })
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Spotify token request failed with status ${response.status}.`)
    }

    const token = (await response.json()) as SpotifyTokenResponse
    return token.access_token
  },
  ['spotify-access-token'],
  { revalidate: TOKEN_REVALIDATE_SECONDS }
)

const searchCached = unstable_cache(
  async (title: string, artist: string): Promise<SpotifyTrackSearchResult> => {
    const token = await getCachedToken()
    const query = new URLSearchParams({
      q: `${artist} ${title}`,
      type: 'track',
      limit: '1',
    })
    const response = await fetch(`https://api.spotify.com/v1/search?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      throw new Error(`Spotify search request failed with status ${response.status}.`)
    }

    return (await response.json()) as SpotifyTrackSearchResult
  },
  ['spotify-track-search'],
  { revalidate: SEARCH_REVALIDATE_SECONDS }
)

export async function search(title: string, artist: string) {
  return searchCached(normalizeSearchTerm(title), normalizeSearchTerm(artist))
}
