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
  const intro = { title: "INTRO", bg: 0, tracks: [
    { title: "Self Control", artist: "Frank Ocean", url: "BME88lS6aVY", cover: "" },
    { title: "A BOY IS A GUN*", artist: "Tyler, the Creator", url: "9JQDPjpfiGw", cover: ""},
    { title: "kyu-kurarin", artist: "iyowa", url: "2b1IexhKPz4", cover: ""},
  ] }

  const hiphop = { title: "HIP HOP", bg: 0, tracks: [
    { title: "kyu-kurarin", artist: "iyowa", url: "2b1IexhKPz4", cover: ""},
    { title: "Pink and White", artist: "Frank Ocean", url: "uzS3WG6__G4", cover: "" },
    { title: "A BOY IS A GUN*", artist: "Tyler, the Creator", url: "9JQDPjpfiGw", cover: ""},
  ] }

  const playlists = [intro, hiphop]

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
