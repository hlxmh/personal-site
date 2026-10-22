'use client'

import dynamic from 'next/dynamic'
import type { ResolvedMusicTrack } from 'lib/music-types'

const YTPlayer = dynamic(() => import('components/yt-player'), { ssr: false })

export default function YTPlayerLoader({ tracks }: { tracks: ResolvedMusicTrack[] }) {
  return <YTPlayer tracks={tracks} />
}
