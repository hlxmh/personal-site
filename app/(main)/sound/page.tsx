import YTPlayer from 'components/yt-player'
import htmlAsciify from 'lib/asciify'
import { search } from 'lib/spotify'
import { collectUniqueTracks, mapTrackMetadata } from 'lib/spotify-utils'
import type { MusicPlaylist, MusicTrack } from 'lib/music-types'

export const dynamic = 'force-dynamic'

const playlists: MusicPlaylist[] = [
  {
    title: 'INTRO',
    bg: 0,
    tracks: [
      { title: 'Self Control', artist: 'Frank Ocean', url: 'BME88lS6aVY', cover: '' },
      { title: 'A BOY IS A GUN*', artist: 'Tyler, the Creator', url: '9JQDPjpfiGw', cover: '' },
      { title: 'kyu-kurarin', artist: 'iyowa', url: '2b1IexhKPz4', cover: '' },
    ],
  },
  {
    title: 'HIP HOP',
    bg: 0,
    tracks: [
      { title: 'kyu-kurarin', artist: 'iyowa', url: '2b1IexhKPz4', cover: '' },
      { title: 'Pink and White', artist: 'Frank Ocean', url: 'uzS3WG6__G4', cover: '' },
      { title: 'A BOY IS A GUN*', artist: 'Tyler, the Creator', url: '9JQDPjpfiGw', cover: '' },
    ],
  },
]

export default async function Sound() {
  const uniqueTracks = collectUniqueTracks(playlists) as Map<
    string,
    Pick<MusicTrack, 'title' | 'artist'>
  >

  const metadataEntries = await Promise.all(
    Array.from(uniqueTracks, async ([key, track]) => {
      const result = await search(track.title, track.artist)
      const cover = result.tracks.items[0].album.images[0].url
      const ascii = await htmlAsciify(cover)
      return [key, { cover, ascii: ascii.__html }] as const
    })
  )
  const resolvedPlaylists = mapTrackMetadata(playlists, new Map(metadataEntries))

  return <YTPlayer playlists={resolvedPlaylists} />
}
