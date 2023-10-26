"use client";

// Youtube component needs function props so it has to be client... boo
import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube";
import Link from "next/link";
import style from "styles/txt.module.css";
import { startTransition, useEffect, useRef, useState } from "react";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";
import asciify from "lib/asciify"
import { cn } from "lib/utils"

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
        this.original = this.DOM.el.innerHTML;
        this.state = this.original;
        this.position = position;
        this.previousCellPosition = previousCellPosition;
        this.color = this.originalColor = this.DOM.el.parentElement!!.parentElement!!.parentElement!!.style.color;
	}
    /**
     * @param {string} value
     */
    set(value: string) {
        this.state = value;
        this.DOM.el.innerHTML = this.state;
    }
}

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
        // should just be one?
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
        }
        this.clearCells();
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

      this.changeTransition(tmpLines);
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

    clearCells() {
      for (const line of this.lines) {
          for (const cell of line.cells) {
              cell.set('&nbsp;');
          }    
      }
    }

    // experiment with slower, very gradual
    initTransition() {
      // max iterations for each cell to change the current value
      const MAX_CELL_ITERATIONS = 5;

      const loop = (line : Line, cell : Cell, iteration = 0) => {
          if ( iteration === MAX_CELL_ITERATIONS-1 ) {
              cell.set(cell.original);
          }
          else {
              cell.set(this.getRandomChar());
          }

          ++iteration;
          if ( iteration < MAX_CELL_ITERATIONS ) {
              setTimeout(() => loop(line, cell, iteration), 40);
          }
      };

      for (const line of this.lines) {
          for (const cell of line.cells) {
              setTimeout(() => loop(line, cell), this.randomNumber(0,1500));
          }
      }
    }

    changeTransition(tmpLines: Line[]) {
      // max iterations for each cell to change the current value
      const MAX_CELL_ITERATIONS = 8;
      const loop = (line : Line, cell : Cell, iteration = 0) => {
          if ( iteration === MAX_CELL_ITERATIONS-1 ) {
              cell.set(tmpLines[line.position].cells[cell.position].original);
             
              cell.color = tmpLines[line.position].cells[cell.position].originalColor;
              cell.DOM.el.style.color = cell.color;
          }
          else {
              cell.set(this.getRandomChar());

              if (Math.random() > 0.5) {
                cell.DOM.el.style.color = tmpLines[line.position].cells[cell.position].originalColor;
              } else {
                cell.DOM.el.style.color = cell.color;
              }
          }

          ++iteration;
          if ( iteration < MAX_CELL_ITERATIONS ) {
              setTimeout(() => loop(line, cell, iteration), 40);
          }
      };

      for (const line of this.lines) {
          for (const cell of line.cells) {
              setTimeout(() => loop(line, cell), this.randomNumber(0, 500));
          }
      }
    }
}

// need to add a way to not screw the transition if it gets spammed

type AppProps = {
  playlists: {
    title: string,
    bg: number,
    tracks: { title: string, artist: string, url: string, cover: string }[]
  }[]
}

export default function YTPlayer({playlists} :  AppProps) {
  // simplest answer is to just manually sync these w/ playlists prop
  enum PLAYLIST {
    HEART = 0,
    HIPHOP = 1,
    POP = 2,
    JP = 3,
  }

  const [ascii, setAscii] = useState<{ __html: string }>({ __html: "<div class='ascii'>loading...<div>" });
  const [text, setText] = useState<TypeShuffle>();
  const [curList, setCurList] = useState(PLAYLIST.HEART);
  const [backdrop, setBackdrop] = useState("backdrop-hue-rotate-0");
  const [curTrack, setCurTrack] = useState(0);

  const player = useRef<YouTubePlayer>();
  const oldList = useRef(curList);
  const oldTrack = useRef(curTrack);


  // make text transitions (L to R)
  const trackTitle = playlists[curList].tracks[curTrack].title;
  const trackArtist = playlists[curList].tracks[curTrack].artist;

  // runs once, load in html for ascii
  // has to be in useEffect bc initImg is async
  // will turn into infinite render fun if outside
  useEffect(() => {
    // can't directly make TypeShuffle bc it has to point to the initialized element
    // so we gotta do this stupid style manipulation to make the loading effect work
    async function initImg() {
      var html = document.createElement("div")
      var res = await asciify(playlists[curList].tracks[curTrack].cover);
      html.innerHTML = res.__html;
      html.classList.add("ascii")
      html.style.display = "none"
      startTransition(() => setAscii({__html: html.outerHTML}))
    }

    initImg()
  }, []);

  // runs once after ascii set, splits html for transitions
  useEffect(() => {
    const textElement = document.querySelector('.ascii');
    if (textElement) {
      startTransition(() => setText(new TypeShuffle(textElement as HTMLDivElement)))
    }
  }, [ascii]);
  
  // runs once after split complete, does initial transition
  useEffect(() => {
    const textElement = document.querySelector('.ascii');
    (textElement as HTMLDivElement).style.display = "block"
    text?.initTransition() 
  }, [text]);

  // all other img transitions
  useEffect(() => {
    // worried about double effect
    // if (skipFlag) {
      console.log("waaaaaaaa")
      console.log(player.current)

      async function changeAscii(img: string) {
        var html = document.createElement("div")
        var res = await asciify(img)
        html.innerHTML = res.__html;
        html.classList.add("ascii")
        text?.change(html)
      }
      
      changeAscii(playlists[curList].tracks[curTrack].cover)

      oldList.current = curList;
      oldTrack.current = curTrack;
    // }
  }, [curList, curTrack]);

  // done this way bc need to keep the same TypeShuffle for smooth transition
  // instead of fn, useState w/ name of file?
  async function changeAscii(img: string) {
    var html = document.createElement("div")
    var res = await asciify(img)
    html.innerHTML = res.__html;
    html.classList.add("ascii")
    text?.change(html)
  }

  // couple options to handle the player, if this breaks down just change video from videoId prop
  // though ideally don't because it'll re-render the whole thing (it might already be though)

  var state: PlayerStates = PlayerStates.PLAYING;

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    console.log("WWWWWW")
    player.current = event.target;
    // If you have shuffled the playlist, the return value will identify the video's order within the shuffled playlist.
    // shuffle on after first visit (server action?), will have to init img stuff after shuffle i guess
  };

  const onStateChange: YouTubeProps["onStateChange"] = async (event) => {
    state = await event.target.getPlayerState();
    console.log(state);

    if (state === YouTube.PlayerState.UNSTARTED) {
      const idx = await event.target.getPlaylistIndex()
      if (curTrack != idx) {
        // try to change it reactively?
        // as far as i can tell, this also works on playlist change
        // changeAscii(playlists[curList].tracks[idx].cover)
        setCurTrack(idx)
      }
    }
  };

  function changeCurList(playlist: PLAYLIST) {

    setCurList(playlist);
    console.log("wah")
    // if (curTrack === 0) {
    //   skipFlag.current = true;
    // }
    // maybe multiple effects for active playlist?

    switch (playlist) {
      case PLAYLIST.HEART: {
        setBackdrop("backdrop-hue-rotate-0");
        break;
      }
      case PLAYLIST.HIPHOP: {
        setBackdrop("backdrop-hue-rotate-0");
        break;
      }
      case PLAYLIST.HEART: {
        setBackdrop("backdrop-hue-rotate-60");
        break;
      }
      case PLAYLIST.HEART: {
        setBackdrop("backdrop-hue-rotate-30");
        break;
      }
    }
  }

  function playPause() {
    if (state == PlayerStates.PLAYING) {
      player.current?.pauseVideo();
    } else {
      player.current?.playVideo();
    }
  }

  function next() {
    player.current?.nextVideo();
  }

  const opts: YouTubeProps["opts"] = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      playlist: playlists[curList].tracks.map((track) => track.url).join(","),
      loop: 1,
    },
  };

  return (
    <>
      <YouTube
        id="yt"
        title={playlists[curList].title}
        className="boooo"
        iframeClassName="bahhh"
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onStateChange}
      />
      <div className="flex justify-center">
        <div
          // individual style-glow kills performance
          // have to manually set width.. though not a big deal
          className={cn("w-[410px] text-[14px]/[1.2]")}
          dangerouslySetInnerHTML={ascii}
        ></div>
      </div>
      <div
        className={[
          "absolute",
          "top-0",
          "left-0",
          "h-screen",
          "w-screen",
          backdrop,
        ].join(" ")}
      ></div>
      <h2 className="mt-20 ml-10">{trackTitle}</h2>
      <h3 className="ml-10">{trackArtist}</h3>

      <div className="ml-5 absolute bottom-0">
        <h2>playlist</h2>
        <nav>
          <Link
            onMouseEnter={() => {
              changeCurList(PLAYLIST.HEART);
            }}
            className={[
              style.menu__item,
              "mb-5",
              "post",
              "before:content-['']",
              curList == PLAYLIST.HEART ? "bg-black" : "",
            ].join(" ")}
            href="https://google.com"
            target="_blank"
          >
            <h3>
              <span className={style.menu__item_name}>start</span>
            </h3>
          </Link>
          <Link
            onMouseEnter={() => {
              changeCurList(PLAYLIST.HIPHOP);
            }}
            className={[
              style.menu__item,
              "mb-5",
              "post",
              "before:content-['']",
              curList == PLAYLIST.HIPHOP ? "bg-black" : "",
            ].join(" ")}
            href="https://google.com"
            target="_blank"
          >
            <h3>
              <span className={style.menu__item_name}>hip hop</span>
            </h3>
          </Link>
          <Link
            className={[
              style.menu__item,
              "mb-5",
              "post",
              "before:content-['']",
            ].join(" ")}
            href={`google.com`}
          >
            <h3>
              <span className={style.menu__item_name}>pop</span>
            </h3>
          </Link>
          <Link
            className={[
              style.menu__item,
              "mb-5",
              "post",
              "before:content-['']",
            ].join(" ")}
            href={`google.com`}
          >
            <h3>
              <span className={style.menu__item_name}>jp</span>
            </h3>
          </Link>
        </nav>
      </div>

      <div className="mr-5 absolute bottom-0 right-0">
        <h3>
          <span>prev</span>
          <span onClick={playPause} className="cursor-pointer">
            {" "}
            {state == PlayerStates.PLAYING ? "⏵" : "booo"}{" "}
          </span>
          {/* <span onClick={() => startTransition(() => asciify())}>next</span> */}
          {/* <span onClick={async () => await changeAscii()}>next</span> */}
          <span onClick={next}>next</span>

          {/* <span onClick={async () => setAscii(await asciify("public/blonde.jpg"))}>next</span> */}
        </h3>
      </div>
    </>
  );
}