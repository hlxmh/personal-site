import { Suspense } from 'react'
import { io } from 'next/cache'
import YTPlayerLoader from 'components/yt-player-loader'
import htmlAsciify from 'lib/asciify'
import type { MusicTrack, ResolvedMusicTrack } from 'lib/music-types'

const tracks: MusicTrack[] = [
  { title: 'Self Control', artist: 'Frank Ocean', url: 'BME88lS6aVY' },
  { title: 'SUGAR', artist: 'BROCKHAMPTON', url: 'v2eG5Bty8Z0' },
  { title: 'Night Shift', artist: 'Lucy Dacus', url: 'rlt1PaIhitI' },
  { title: 'idiot', artist: 'boylife', url: 'fLMz-5xsyjc' },
  { title: 'EASIER', artist: 'Quadeca', url: 'nyzd24011Zc' },
  { title: 'kyu-kurarin', artist: 'iyowa', url: '2b1IexhKPz4' },
  { title: 'GONE, GONE / THANK YOU', artist: 'Tyler, the Creator', url: 'pVInBRkoKgY' },
  { title: 'Toronto 2014', artist: 'Daniel Caesar', url: 'SHP-xh5NnVs' },
  { title: 'Pink and White', artist: 'Frank Ocean', url: 'uzS3WG6__G4' },
  { title: 'A BOY IS A GUN*', artist: 'Tyler, the Creator', url: '9JQDPjpfiGw' },
]

async function SoundContent() {
  // Render at request time to avoid deployment issues
  await io()

  const videoIds = new Set(tracks.map((track) => track.url))
  const asciiEntries = await Promise.all(
    Array.from(videoIds, async (videoId) => {
      const thumbnailUrl = `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/maxresdefault.jpg`
      const ascii = await htmlAsciify(thumbnailUrl)
      return [videoId, ascii.__html] as const
    })
  )
  const asciiByVideoId = new Map(asciiEntries)
  const resolvedTracks: ResolvedMusicTrack[] = tracks.map((track) => ({
    ...track,
    ascii: asciiByVideoId.get(track.url) ?? '',
  }))

  return <YTPlayerLoader tracks={resolvedTracks} />
}

export default function Sound() {
  return (
    <Suspense fallback={null}>
      <SoundContent />
    </Suspense>
  )
}
