"use client";

// Youtube component needs function props so it has to be client... boo
import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import { TypeShuffle } from "components/type-shuffle";
import type { ResolvedMusicTrack } from "lib/music-types";
import { cx } from "lib/utils";

type AppProps = { tracks: ResolvedMusicTrack[] };

export default function YTPlayer({tracks} : AppProps) {
  const ascii = useMemo(
    () => ({ __html: `<div class="ascii">${tracks[0].ascii}</div>` }),
    [tracks],
  );
  const [trackIndex, setTrackIndex] = useState(0);
  const [playerState, setPlayerState] = useState(PlayerStates.PAUSED);
  const [playerReady, setPlayerReady] = useState(false);
  // i know this looks redundant but yt player states don't give enough info
  // Loading reflects only YouTube's UNSTARTED and BUFFERING states.
  const [loadingState, setLoadingState] = useState(true);
  // i know this also looks redundant but i need to delay the music info change so that i can have it transition out
  const [musicInfo, setMusicInfo] = useState({ title: tracks[0].title, artist: tracks[0].artist});

  const asciiTrans = useRef<TypeShuffle | undefined>(undefined);
  const infoTrans = useRef<TypeShuffle | undefined>(undefined);
  const oldTrackIndex = useRef(0)
  const player = useRef<YouTubePlayer | undefined>(undefined);
  const asciiHostRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);
	const loadGeneration = useRef(0);
  const stateRequestSequence = useRef(0);
  const trackListRef = useRef<HTMLOListElement>(null);
  const trackButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const trackIds = useMemo(
    () => tracks.map((track) => track.url),
    [tracks],
  );
	const trackIdsRef = useRef(trackIds);

	useLayoutEffect(() => {
		trackIdsRef.current = trackIds;
	}, [trackIds]);

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
      const html = document.createElement("div")
      html.innerHTML = asciiMarkup;
      html.classList.add("ascii")
      asciiTrans.current?.change(html)
    }

    // prevent spam, and also fixes bugs during init useEffect bombs
    if (oldTrackIndex.current !== trackIndex) {
      changeAscii(tracks[trackIndex].ascii)
      infoTrans?.current?.cleanTransition((() => setMusicInfo({ title: tracks[trackIndex].title, artist: tracks[trackIndex].artist })))
      
      oldTrackIndex.current = trackIndex
    }
  }, [trackIndex, tracks]);

  useEffect(() => {
    const textElement = infoRef.current;
    if (!textElement) return;

    infoTrans.current?.destroy();
    const transition = new TypeShuffle(textElement);
    infoTrans.current = transition;
    transition.initTransitionInfo();

    return () => {
      transition.destroy();
      if (infoTrans.current === transition) infoTrans.current = undefined;
    };
  }, [musicInfo]);

  useEffect(() => {
    const list = trackListRef.current;
    const button = trackButtonRefs.current[trackIndex];
    if (!list || !button) return;

    const listRect = list.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    if (buttonRect.top < listRect.top) {
      list.scrollTop -= listRect.top - buttonRect.top;
    } else if (buttonRect.bottom > listRect.bottom) {
      list.scrollTop += buttonRect.bottom - listRect.bottom;
    }
  }, [trackIndex]);

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    player.current = event.target;
	loadGeneration.current += 1;
	event.target.loadPlaylist(trackIdsRef.current, 0);
	setPlayerReady(true);
	setLoadingState(true);
  };

  // yt is really cool and decided not to make an event on video change
  const onStateChange: YouTubeProps["onStateChange"] = async (event) => {
	const target = event.target;
	const generation = loadGeneration.current;
	const requestSequence = ++stateRequestSequence.current;
	const expectedIds = trackIdsRef.current;
	const [state, idx, currentIds] = await Promise.all([
		target.getPlayerState(),
		target.getPlaylistIndex(),
		target.getPlaylist(),
	]);
	if (
		!mounted.current ||
		player.current !== target ||
		generation !== loadGeneration.current ||
		requestSequence !== stateRequestSequence.current ||
		!Array.isArray(currentIds) ||
		currentIds.length !== expectedIds.length ||
		currentIds.some((id: string, index: number) => id !== expectedIds[index])
	) return;

    setPlayerState(state);
	if (Number.isInteger(idx) && idx >= 0 && idx < tracks.length) {
	  setTrackIndex((current) => current !== idx ? idx : current);
    }
    setLoadingState(
      state === PlayerStates.UNSTARTED || state === PlayerStates.BUFFERING,
    );
  };

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

  function selectTrack(index: number) {
    if (!playerReady) return;
    stateRequestSequence.current += 1;
    setLoadingState(true);
    player.current?.playVideoAt(index);
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

      <main className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-5 py-16 xl:block">
        <div className="flex w-full min-w-0 max-w-[410px] flex-col items-center xl:absolute xl:left-1/2 xl:top-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2">
          <div
            // individual style-glow kills performance
            // Keep the original square ASCII box; source thumbnails are center-cropped before conversion.
            className={cx(
              "relative isolate h-[min(420px,calc(102.439vw-40.976px))] w-[min(410px,calc(100vw-40px))] text-[min(7.7px,calc(1.878vw-0.751px))]/[1.2]",
            )}
            ref={asciiHostRef}
          >
            <div aria-hidden="true" className="pointer-events-none absolute -inset-3 bg-black bg-opacity-40 shadow-lg"></div>
            <div className="relative z-10 h-full w-full" dangerouslySetInnerHTML={ascii}></div>
          </div>

          {/* key doesn't really matter, just need one to force react to completely re-render this*/}
          {/* else the splitting package leaves a stupid bannana attr that messes up the text change transitions */}
          {/* TODO make the blinking not suck */}
          <div className="mt-5 bg-black bg-opacity-40 px-6 py-3 shadow-lg">
            <div ref={infoRef} key={musicInfo.artist} className={cx('info', {'animate-slow_blink': (!loadingState && playerState == PlayerStates.PLAYING)})}>
              <h2 className="mr-20">{musicInfo.title}</h2>
              <h3 className="ml-20 text-xs opacity-70">{musicInfo.artist}</h3>
            </div>
          </div>

        </div>

        <aside className="w-full max-w-[410px] xl:absolute xl:right-5 xl:top-1/2 xl:w-[300px] xl:-translate-y-1/2">
          <section aria-label="Track list" aria-busy={loadingState} className="bg-black bg-opacity-40 px-3 py-3 shadow-lg">
            <ol ref={trackListRef} className="max-h-[min(420px,55vh)] overflow-y-auto overscroll-contain pr-1">
              {tracks.map((track, index) => {
                const isCurrent = index === trackIndex;

                return (
                  <li key={track.url}>
                    <button
                      ref={(element) => {
                        trackButtonRefs.current[index] = element;
                      }}
                      type="button"
                      onClick={() => selectTrack(index)}
                      disabled={!playerReady}
                      aria-current={isCurrent ? "true" : undefined}
                      className={cx(
                        "grid w-full grid-cols-[1rem_2rem_minmax(0,1fr)] items-start gap-2 px-2 py-2 text-left transition-colors",
                        "hover:bg-[#d2738a]/10 hover:text-[#d2738a]",
                        "disabled:cursor-wait disabled:opacity-40",
                        {"bg-[#d2738a]/15 text-[#d2738a]": isCurrent},
                      )}
                    >
                      <span aria-hidden="true">{isCurrent ? ">" : ""}</span>
                      <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                      <span className="min-w-0">
                        <span className="block truncate">{track.title}</span>
                        <span className="block truncate text-xs opacity-70">{track.artist}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>

          <div className="mt-8 flex w-full justify-end">
            <h3 className="flex h-fit gap-4 bg-black bg-opacity-40 px-4 py-3 shadow-lg">
              <button type="button" onClick={prev} disabled={loadingState} aria-label="Previous track" className={cx('cursor-pointer', {'opacity-40': loadingState})}>prev</button>
              <button type="button" onClick={playPause} disabled={loadingState} aria-label={playerState == PlayerStates.PLAYING ? "Pause" : "Play"} className={cx('cursor-pointer', {'opacity-40': loadingState})}>
                {playerState == PlayerStates.PLAYING ? "⏸" : "⏵"}
              </button>
              <button type="button" onClick={next} disabled={loadingState} aria-label="Next track" className={cx('cursor-pointer', {'opacity-40': loadingState})}>next</button>
            </h3>
          </div>
        </aside>
      </main>
    </>
  );
}
