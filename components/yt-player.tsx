"use client";

// Youtube component needs function props so it has to be client... boo
import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube";
import Link from "next/link";
import style from "styles/txt.module.css";
import { useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";
import asciify from "lib/asciify"
import { cx } from "lib/utils"

/**
 * Class representing one line
 */
class Line {
	// line position
    position = -1;
    // cells/chars
    cells = [] as Cell[];

	/**
	 * Constructor.
	 * @param {Element} DOM_el - the char element (<span>)
	 */
	constructor(linePosition: number) {
		this.position = linePosition;
	}
}

/**
 * Class representing one cell/char
 */
class Cell {
	// DOM elements
	DOM = {
		// the char element (<span>)
		el: document.createElement('span'),
	};
    // cell position
    position = -1;
    // previous cell position
    previousCellPosition = -1;
    // original innerHTML
    original;
    // current state/innerHTML
    state;
    color;
    originalColor;

	/**
	 * Constructor.
	 * @param {Element} DOM_el - the char element (<span>)
	 */
	constructor(DOM_el : HTMLSpanElement, {
        position = -1,
        previousCellPosition = -1
    } = {}) {
		this.DOM.el = DOM_el;
        // need to use attr since the set writes over this.original retroactively for specifically the info text... idk
        this.original = this.DOM.el.getAttribute("data-char")!;
        // this.original = this.DOM.el.innerHTML;
        this.state = this.original;
        this.position = position;
        this.previousCellPosition = previousCellPosition;
        this.color = this.originalColor = this.DOM.el.parentElement?.parentElement?.parentElement?.style.color;
        this.set('&nbsp;');
      }
    /**
     * @param {string} value
     */
    set(value: string) {
        this.state = value;
        this.DOM.el.innerHTML = this.state;
    }
}

// TODO consolidate these functions so we don't have 500 lines

/**
 * Class representing the TypeShuffle object
 */
export class TypeShuffle {
	// DOM elements
	DOM = {
		// the main text element
		el : document.createElement('div'),
	};
    // array of Line objs
    lines = [] as Line[];
    // array of letters and symbols
    lettersAndSymbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '!', '@', '#', '$', '&', '*', '(', ')', '-', '_', '+', '=', '/', '[', ']', '{', '}', ';', ':', '<', '>', ',', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    // to prevent multi-transition bugs
    totalChars = 0;
    inProgress = false;
    transQueue = [] as Line[][];

    // to handle song spam on info text
    changeMusic = Function()
  
	/**
	 * Constructor.
	 * @param {Element} DOM_el - main text element
	 */
	constructor(DOM_el : HTMLDivElement) {
        this.DOM.el = DOM_el;
        // Apply Splitting (two times to have lines, words and chars)
        const results: Splitting.Result[] = Splitting({
            target: this.DOM.el,
            by: 'lines'
        })
        // TODO fix TS decl
        results.forEach(s => Splitting({ target: s.words }));
        
        // for every line
        for (const [linePosition, lineArr] of results[0].lines!!.entries()) {
            // create a new Line
            const line = new Line(linePosition);
            let cells = [];
            let charCount = 0;
            // for every word of each line
            for (const word of lineArr) {
                // for every character of each line
                for (const char of [...word.querySelectorAll('.char')]) {
                    cells.push(
                        new Cell(char as HTMLSpanElement, {
                            position: charCount,
                            previousCellPosition: charCount === 0 ? -1 : charCount-1
                        })
                    );
                    ++charCount;
                }
            }
            line.cells = cells;
            this.lines.push(line);
            this.totalChars += charCount;
        }
        // TODO
        // window.addEventListener('resize', () => this.resize());
	}
    change(DOM_el : HTMLDivElement) {
      // Apply Splitting (two times to have lines, words and chars)
      const tmpLines : Line[] = [];

      const results: Splitting.Result[] = Splitting({
          target: DOM_el,
          by: 'lines'
      })
      results.forEach(s => Splitting({ target: s.words }));
      
      // for every line
      for (const [linePosition, lineArr] of results[0].lines!!.entries()) {
          // create a new Line
          const line = new Line(linePosition);
          let cells = [];
          let charCount = 0;
          // for every word of each line
          for (const word of lineArr) {
              // for every character of each line
              for (const char of [...word.querySelectorAll('.char')]) {
                  cells.push(
                      new Cell(char as HTMLSpanElement, {
                          position: charCount,
                          previousCellPosition: charCount === 0 ? -1 : charCount-1
                      })
                  );
                  ++charCount;
              }
          }
          line.cells = cells;
          tmpLines.push(line);
      }

      if (this.inProgress) {
        this.transQueue.push(tmpLines)
      } else {
        this.changeTransition(tmpLines);
      }
    }

    /**
     * 
     * @returns {string} a random char from this.lettersAndSymbols
     */
    getRandomChar() {
        return this.lettersAndSymbols[Math.floor(Math.random() * this.lettersAndSymbols.length)];
    }

    randomNumber(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    initTransition() {
      this.inProgress = true;
      let finished = 0;

      // iterations for each cell to change the current value
      const MAX_CELL_ITERATIONS = 30;

      const loop = (line : Line, cell : Cell, iteration = 0) => {
        if ( iteration === MAX_CELL_ITERATIONS-1 ) {
            finished++;
            if (finished === this.totalChars) {
              // in progress refers to finishing the whole transition
              // could potentially make a bit smoother by setting inProgress at MAX_CELL_ITERATIONS-9
              this.inProgress = false
              if (this.transQueue.length > 0) {
                this.changeTransition(this.transQueue.shift()!);
              }
            }

            cell.set(cell.original);
        }
        else {
            cell.set(this.getRandomChar());
        }

        ++iteration;
        if ( iteration < MAX_CELL_ITERATIONS ) {
            setTimeout(() => loop(line, cell, iteration), 80);
        }
      };

      for (const line of this.lines) {
          for (const cell of line.cells) {
              setTimeout(() => loop(line, cell), this.randomNumber(500, 20000));
          }
      }
    }

    initTransitionInfo() {
      // iterations for each cell to change the current value
      const MAX_CELL_ITERATIONS = 5;

      const loop = (line : number, cell : number, iteration = 0) => {
        const cellObj = this.lines[line].cells[cell]
        if ( iteration >= MAX_CELL_ITERATIONS-1 ) {
          cellObj.set(cellObj.original);
          if (cell < this.lines[line].cells.length - 1) {
            loop(line, cell + 1, 0);
          } else if (line < this.lines.length - 1) {
            loop(line + 1, 0, 0);
          }
        }
        else {
          cellObj.set(this.getRandomChar());
        }

        ++iteration;
        if ( iteration < MAX_CELL_ITERATIONS ) {
            setTimeout(() => loop(line, cell, iteration + this.randomNumber(0, 1)), 40);
        }
      };

      loop(0, 0);
    }

    changeTransition(tmpLines: Line[]) {
      this.inProgress = true;
      let finished = 0;
      
      // iterations for each cell to change the current value
      const MAX_CELL_ITERATIONS = 10;
      const loop = (line : Line, cell : Cell, iteration = 0) => {
        if (iteration === 0) {
          finished++;
          if (finished === this.totalChars) {
            // in progress refers to starting the loop on every cell, not finishing the whole transition
            this.inProgress = false
            if (this.transQueue.length > 0) {
              this.changeTransition(this.transQueue.shift()!);
            }
          }
        }
        if ( iteration === MAX_CELL_ITERATIONS-1 ) {
            cell.set(tmpLines[line.position].cells[cell.position].original);
          
            cell.color = tmpLines[line.position].cells[cell.position].originalColor;
            cell.DOM.el.style.color = cell.color!;
        }
        else {
            cell.set(this.getRandomChar());

            if (Math.random() > 0.5) {
              cell.DOM.el.style.color = tmpLines[line.position].cells[cell.position].originalColor!;
            } else {
              cell.DOM.el.style.color = cell.color!;
            }
        }

        ++iteration;
        if ( iteration < MAX_CELL_ITERATIONS ) {
            setTimeout(() => loop(line, cell, iteration), 80);
        }
      };

      for (const line of this.lines) {
          for (const cell of line.cells) {
              setTimeout(() => loop(line, cell), this.randomNumber(500, 15000));
          }
      }
    }

    // to gracefully get rid of old info text before setting new text
    cleanTransition(callback: Function) {
      this.changeMusic = callback;
      if (this.inProgress) return;
      this.inProgress = true;

      // iterations for each cell to change the current value
      const MAX_CELL_ITERATIONS = 5;

      const loop = (line : number, cell : number, iteration = 0) => {
        const cellObj = this.lines[line].cells[cell]
        if ( iteration === MAX_CELL_ITERATIONS-1 ) {
          cellObj.set('&nbsp;');
          if (cell < this.lines[line].cells.length - 1) {
            loop(line, cell + 1, 0);
          } else if (line < this.lines.length - 1) {
            loop(line + 1, 0, 0);
          } else {
            this.inProgress = false;
            this.changeMusic(); 
          }
        }
        else {
          cellObj.set(this.getRandomChar());
        }

        ++iteration;
        if ( iteration < MAX_CELL_ITERATIONS ) {
            setTimeout(() => loop(line, cell, iteration), 40);
        }
      };

      loop(0, 0);
    }
}

type AppProps = {
  playlists: {
    title: string,
    bg: number,
    tracks: { title: string, artist: string, url: string, cover: string }[]
  }[]
}

export default function YTPlayer({playlists} :  AppProps) {
  // manually synced w/ playlists prop
  enum PLAYLIST {
    HEART = 0,
    HIPHOP = 1,
    POP = 2,
    JP = 3,
  }

  // kinda sucks that ascii is state but can't set during init, has to be post-render bc of async
  const [ascii, setAscii] = useState<{ __html: string }>({ __html: "<div class='ascii'>loading...<div>" });
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

  // not sure how much this actually helps
  const [isTrans, startTrans] = useTransition()

  // TODO blink when playing

  const backdrop = playlists[music.playlist].bg;

  // runs once on page load, load in html for ascii
  // has to be in useEffect bc initImg is async
  // (will turn into infinite render fun if outside)
  useEffect(() => {
    console.log("A")
    // can't directly make TypeShuffle bc it has to point to the initialized element
    async function initImg() {
      var html = document.createElement("div")
      var res = await asciify(playlists[music.playlist].tracks[music.track].cover);
      html.innerHTML = res.__html;
      html.classList.add("ascii")

      startTrans(() => {
        setAscii({__html: html.outerHTML});
      });
    }

    initImg()

    // text for info already set, can directly select and split from here
    makeNewInfo()
  }, []);

  // runs once after ascii set, splits html for transitions
  useLayoutEffect(() => {
    console.log("B")
    const textElement = document.querySelector('.ascii');
    console.log(textElement)
    if (textElement) {
      asciiTrans.current = new TypeShuffle(textElement as HTMLDivElement);
      asciiTrans.current.initTransition()
    }
  }, [ascii]);

  // all other img transitions
  useEffect(() => {
    console.log("C")
    // done this way bc need to keep the same TypeShuffle for smooth transition
    async function changeAscii(img: string) {
      var html = document.createElement("div")
      var res = await asciify(img)
      html.innerHTML = res.__html;
      html.classList.add("ascii")
      asciiTrans?.current?.change(html)
    }

    // prevent spam, and also fixes bugs during init useEffect bombs
    if (oldMusic.current.playlist !== music.playlist || oldMusic.current.track !== music.track) {
      changeAscii(playlists[music.playlist].tracks[music.track].cover)
      infoTrans?.current?.cleanTransition((() => setMusicInfo({ title: playlists[music.playlist].tracks[music.track].title, artist: playlists[music.playlist].tracks[music.track].artist })))
      
      oldMusic.current = music
    }
  }, [music]);

  useEffect(() => {
    console.log("D")
    makeNewInfo()
  }, [musicInfo]);

  function makeNewInfo() {
    const textElement = document.querySelector('.info');

    if (textElement) {
        infoTrans.current = new TypeShuffle(textElement as HTMLDivElement)
        infoTrans.current.initTransitionInfo() 
    }
  }

  // couple options to handle the player, if this breaks down just change video from videoId prop
  // though ideally don't because it'll re-render the whole thing (it might already be though)
  // well it definitely does for playlist changing, but idk about video

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    console.log("PLAYER READY")
    player.current = event.target;
    // TODO If you have shuffled the playlist, the return value will identify the video's order within the shuffled playlist.
    // shuffle on after first visit (server action?), will have to init img stuff after shuffle i guess
  };

  // yt is really cool and decided not to make an event on video change
  const onStateChange: YouTubeProps["onStateChange"] = async (event) => {
    let state = await event.target.getPlayerState();
    setPlayerState(state);
    console.log("STATE: " + state);
    const idx = await event.target.getPlaylistIndex()
    if (state == PlayerStates.UNSTARTED) {
      if (music.track != idx) {
        setMusic({playlist: music.playlist, track: idx})
        setLoadingState(true);
      }
    } else if (state === PlayerStates.PLAYING && loadingState) {
      setLoadingState(false);
    }
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

  const opts: YouTubeProps["opts"] = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      playlist: playlists[music.playlist].tracks.map((track) => track.url).join(","),
      loop: 1,
    },
  };

  const playlistSelect = playlists.map((playlist, idx) =>
    <div
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
    >
      <h3>
        <span className={style.menu__item_name}>{playlist.title.toLowerCase()}</span>
      </h3>
    </div>
  );

  return (
    <>
      <YouTube
        id="yt"
        title={playlists[music.playlist].title}
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

      <div className="flex justify-center items-center flex-col h-[100%]">
        <div
          // individual style-glow kills performance
          // have to manually set width to ensure correct image ratio
          // manual height is to ensure no layout shift from loading in image
          className={cx("w-[410px] h-[420px] text-[14px]/[1.2]")}
          dangerouslySetInnerHTML={ascii}
        ></div>

        {/* key doesn't really matter, just need one to force react to completely re-render this*/}
        {/* else the splitting package leaves a stupid bannana attr that messes up the text change transitions */}
        <div key={musicInfo.artist} className="info">
          <h2 className="mt-5 mr-20">{musicInfo.title}</h2>
          <h3 className="ml-20">{musicInfo.artist}</h3>
        </div>
      </div>

      <div className="flex justify-self-end justify-between w-[100%] absolute bottom-0 px-5 pb-3">
          {/* playlist select */}
          <div className="">
            <h2>playlist</h2>
            <nav>
              {playlistSelect}
            </nav>
          </div>
          
          {/* TODO ADD LOADING ANIMATION?? */}
          <h3 className="h-fit self-end flex gap-4">
          <span onClick={prev} className={cx('cursor-pointer', {'opacity-40 pointer-events-none': loadingState})}>prev</span>
            <span onClick={playPause} className={cx('cursor-pointer', {'opacity-40 pointer-events-none': loadingState})}>
              {playerState == PlayerStates.PLAYING ? "⏸" : "⏵"}
            </span>
            <span onClick={next} className={cx('cursor-pointer', {'opacity-40 pointer-events-none': loadingState})}>next</span>
          </h3>
        </div>
    </>
  );
}