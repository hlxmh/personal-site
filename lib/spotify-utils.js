function normalizeSearchTerm(value) {
  return value.trim().replace(/\s+/g, ' ').toLowerCase()
}

function spotifyTrackKey(title, artist) {
  return `${normalizeSearchTerm(artist)}\u0000${normalizeSearchTerm(title)}`
}

function collectUniqueTracks(playlists) {
  const uniqueTracks = new Map()

  for (const playlist of playlists) {
    for (const track of playlist.tracks) {
      uniqueTracks.set(spotifyTrackKey(track.title, track.artist), {
        title: track.title,
        artist: track.artist,
      })
    }
  }

  return uniqueTracks
}

function mapTrackMetadata(playlists, metadataByTrack) {
  return playlists.map((playlist) => ({
    ...playlist,
    tracks: playlist.tracks.map((track) => ({
      ...track,
      ...metadataByTrack.get(spotifyTrackKey(track.title, track.artist)),
    })),
  }))
}

module.exports = {
  collectUniqueTracks,
  mapTrackMetadata,
  normalizeSearchTerm,
  spotifyTrackKey,
}
