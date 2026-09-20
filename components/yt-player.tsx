"use client";

// Youtube component needs function props so it has to be client... boo
import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube";
import style from "styles/txt.module.css";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import { TypeShuffle } from "components/type-shuffle";
import type { ResolvedMusicPlaylist } from "lib/music-types";
import { cx } from "lib/utils";

type AppProps = { playlists: ResolvedMusicPlaylist[] };

export default function YTPlayer({playlists} : AppProps) {
  // manually synced w/ playlists prop
  enum PLAYLIST {
    HEART = 0,
    HIPHOP = 1,
    POP = 2,
    JP = 3,
  }

  const ascii = useMemo(
    () => ({ __html: `<div class="ascii">${playlists[0].tracks[0].ascii}</div>` }),
    [playlists],
  );
  const [music, setMusic] = useState({ playlist: PLAYLIST.HEART, track: 0 });
  const [playerState, setPlayerState] = useState(PlayerStates.PAUSED);
  // i know this looks redundant but yt player states don't give enough info
  // loading when new video (UNSTARTED), done once playing (PLAYING)
  const [loadingState, setLoadingState] = useState(true);
  // i know this also looks redundant but i need to delay the music info change so that i can have it transition out
  const [musicInfo, setMusicInfo] = useState({ title: playlists[music.playlist].tracks[music.track].title, artist: playlists[music.playlist].tracks[music.track].artist});

  const asciiTrans = useRef<TypeShuffle>();
  const infoTrans = useRef<TypeShuffle>();
  const oldMusic = useRef({ playlist: PLAYLIST.HEART, track: 0 })
  const player = useRef<YouTubePlayer>();
  const asciiHostRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);
	const loadGeneration = useRef(0);
	const loadedPlaylist = useRef<number>();
  const playlistIds = useMemo(
    () => playlists[music.playlist].tracks.map((track) => track.url),
    [music.playlist, playlists],
  );
	const selectedPlaylist = useRef(music.playlist);
	const playlistIdsRef = useRef(playlistIds);
	selectedPlaylist.current = music.playlist;
	playlistIdsRef.current = playlistIds;

	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
			loadGeneration.current += 1;
			player.current = undefined;
		};
	}, []);

  // runs once after ascii set, splits html for transitions
  useLayoutEffect(() => {
    const textElement = asciiHostRef.current?.querySelector('.ascii');
    if (textElement) {
      asciiTrans.current = new TypeShuffle(textElement as HTMLDivElement);
      asciiTrans.current.initTransition()
    }
    return () => asciiTrans.current?.destroy();
  }, [ascii]);

  // all other img transitions
  useEffect(() => {
    // done this way bc need to keep the same TypeShuffle for smooth transition
    function changeAscii(asciiMarkup: string) {
      var html = document.createElement("div")
      html.innerHTML = asciiMarkup;
      html.classList.add("ascii")
      asciiTrans.current?.change(html)
    }

    // prevent spam, and also fixes bugs during init useEffect bombs
    if (oldMusic.current.playlist !== music.playlist || oldMusic.current.track !== music.track) {
      changeAscii(playlists[music.playlist].tracks[music.track].ascii)
      infoTrans?.current?.cleanTransition((() => setMusicInfo({ title: playlists[music.playlist].tracks[music.track].title, artist: playlists[music.playlist].tracks[music.track].artist })))
      
      oldMusic.current = music
    }
  }, [music, playlists]);

  useEffect(() => {
    makeNewInfo()
    return () => infoTrans.current?.destroy();
  }, [musicInfo]);

  function makeNewInfo() {
    const textElement = infoRef.current;

    if (textElement) {
        infoTrans.current?.destroy();
        infoTrans.current = new TypeShuffle(textElement as HTMLDivElement)
        infoTrans.current.initTransitionInfo() 
    }
  }

  // couple options to handle the player, if this breaks down just change video from videoId prop
  // though ideally don't because it'll re-render the whole thing (it might already be though)
  // well it definitely does for playlist changing, but idk about video

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    player.current = event.target;
	loadedPlaylist.current = selectedPlaylist.current;
	loadGeneration.current += 1;
	event.target.loadPlaylist(playlistIdsRef.current, 0);
	setLoadingState(true);
    // TODO If you have shuffled the playlist, the return value will identify the video's order within the shuffled playlist.
    // shuffle on after first visit (server action?), will have to init img stuff after shuffle i guess
  };

  // yt is really cool and decided not to make an event on video change
  const onStateChange: YouTubeProps["onStateChange"] = async (event) => {
	const target = event.target;
	const generation = loadGeneration.current;
	const expectedPlaylist = selectedPlaylist.current;
	const expectedIds = playlistIdsRef.current;
	const [state, idx, currentIds] = await Promise.all([
		target.getPlayerState(),
		target.getPlaylistIndex(),
		target.getPlaylist(),
	]);
	if (
		!mounted.current ||
		player.current !== target ||
		generation !== loadGeneration.current ||
		expectedPlaylist !== selectedPlaylist.current ||
		!Array.isArray(currentIds) ||
		currentIds.length !== expectedIds.length ||
		currentIds.some((id: string, index: number) => id !== expectedIds[index])
	) return;

    setPlayerState(state);
    if (state == PlayerStates.UNSTARTED) {
	  if (idx >= 0) {
		setMusic((current) => current.playlist === expectedPlaylist && current.track !== idx
		  ? {playlist: expectedPlaylist, track: idx}
		  : current);
        setLoadingState(true);
      }
	} else if (state === PlayerStates.PLAYING) {
	  setLoadingState(false);
    }
  };

  useEffect(() => {
	if (!player.current || loadedPlaylist.current === music.playlist) return;
	loadedPlaylist.current = music.playlist;
	loadGeneration.current += 1;
	player.current.loadPlaylist(playlistIds, 0);
    setLoadingState(true);
	}, [music.playlist, playlistIds]);

  function playPause() {
    if (playerState == PlayerStates.PLAYING) {
      player.current?.pauseVideo();
    } else {
      player.current?.playVideo();
    }
  }

  function next() {
    player.current?.nextVideo();
  }

  function prev() {
    player.current?.previousVideo();
  }

	const opts = useMemo<YouTubeProps["opts"]>(() => ({
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      loop: 1,
    },
	}), []);

  const playlistSelect = playlists.map((playlist, idx) =>
    <button
    type="button"
    key={idx}
    onClick={() => {
      setMusic({playlist : idx, track: 0});;
    }}
    className={[
      style.menu__item,
      "mb-5",
      "post",
      "before:content-['']",
      music.playlist == idx ? "bg-black bg-opacity-20" : "",
    ].join(" ")}
    // TODO add spotify link
    // href="https://google.com"
    // target="_blank"
    aria-pressed={music.playlist == idx}
    >
      <h3>
        <span className={style.menu__item_name}>{playlist.title.toLowerCase()}</span>
      </h3>
    </button>
  );

  return (
    <>
      <YouTube
        id="yt"
		title="Music player"
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onStateChange}
      />

      {/* backdrop filter */}
      {/* <div
        className={[
          "absolute",
          "top-0",
          "left-0",
          "h-screen",
          "w-screen",
          backdrop,
        ].join(" ")}
      >
      </div> */}

      <div className="flex justify-center items-center flex-col h-full">
        <div
          // individual style-glow kills performance
          // have to manually set width to ensure correct image ratio
          // manual height is to ensure no layout shift from loading in image
          className={cx("w-[410px] h-[420px] text-[14px]/[1.2]")}
          ref={asciiHostRef}
          dangerouslySetInnerHTML={ascii}
        ></div>

        {/* key doesn't really matter, just need one to force react to completely re-render this*/}
        {/* else the splitting package leaves a stupid bannana attr that messes up the text change transitions */}
        {/* TODO make the blinking not suck */}
        <div ref={infoRef} key={musicInfo.artist} className={cx('info', {'animate-slow_blink': (!loadingState && playerState == PlayerStates.PLAYING)})}>
          <h2 className="mt-5 mr-20">{musicInfo.title}</h2>
          <h3 className="ml-20">{musicInfo.artist}</h3>
        </div>
      </div>

      <div className="flex justify-self-end justify-between w-full absolute bottom-0 px-5 pb-3">
          {/* playlist select */}
          <div className="">
            <h2>playlist</h2>
            <nav>
              {playlistSelect}
            </nav>
          </div>
          
          <h3 className="h-fit self-end flex gap-4">
          <button type="button" onClick={prev} disabled={loadingState} aria-label="Previous track" className={cx('cursor-pointer', {'opacity-40': loadingState})}>prev</button>
            <button type="button" onClick={playPause} disabled={loadingState} aria-label={playerState == PlayerStates.PLAYING ? "Pause" : "Play"} className={cx('cursor-pointer', {'opacity-40': loadingState})}>
              {playerState == PlayerStates.PLAYING ? "⏸" : "⏵"}
            </button>
            <button type="button" onClick={next} disabled={loadingState} aria-label="Next track" className={cx('cursor-pointer', {'opacity-40': loadingState})}>next</button>
          </h3>
        </div>
    </>
  );
}
