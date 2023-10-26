import YTPlayer from 'components/yt-player'
import {getToken , search } from 'lib/spotify'
// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'hear me roar',
//   description: 'so badass...',
// }


class Playlist {
	// line position
  title;
    background = 0;
    // cells/chars
    tracks = [] as Track[];

	/**
	 * Constructor.
	 * @param {Element} DOM_el - the char element (<span>)
	 */
	constructor(title: string, background: number) {
    this.title = title;
		this.background = background;
	}
}


class Track {
	// line position
    title;
    artist;
    url;
    cover = "";
    // cells/chars

	/**
	 * Constructor.
	 * @param {Element} DOM_el - the char element (<span>)
	 */
	constructor(title: string, artist: string, url: string) {
		this.title = title;
    this.artist = artist;
    this.url = url;
	}
}

export default async function Sound() {

  // const intro = new Playlist("Intro", 0)
  const intro = { title: "Intro", bg: 0, tracks: [
    { title: "Self Control", artist: "Frank Ocean", url: "BME88lS6aVY", cover: "" },
    { title: "A BOY IS A GUN*", artist: "Tyler, the Creator", url: "9JQDPjpfiGw", cover: ""},
  ] }

  // intro.tracks = [
  //   new Track("Self Control", "Frank Ocean", "uzS3WG6__G4"),
  //   new Track("A BOY IS A GUN*", "Tyler, the Creator", "9JQDPjpfiGw"),
  // ]

  const hiphop = new Playlist("Hiphop", 30)
  hiphop.tracks = [
    new Track("A BOY IS A GUN*", "Tyler, the Creator", "9JQDPjpfiGw"),
    new Track("Pink and White", "Frank Ocean", "uzS3WG6__G4")
  ]

  const playlists = [intro]

  var res = await getToken();
  console.log(res)
  for (const playlist of playlists) {
    for (const track of playlist.tracks) {
      var searchRes = await search(res.access_token, track.title, track.artist)
      console.log(searchRes)
      track.cover = searchRes.tracks.items[0].album.images[0].url;
      console.log(track.cover)
    }
  }

  return (
    <>
      <YTPlayer playlists={playlists}></YTPlayer>
    </>
  );
}
