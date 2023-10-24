"use client";

// Youtube component needs function props so it has to be client... boo
import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube";
import Link from "next/link";
import style from "styles/txt.module.css";
import { startTransition, useEffect, useState } from "react";
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
    // should be able to not create a span just for this
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

    initTransition() {
      // max iterations for each cell to change the current value
      const MAX_CELL_ITERATIONS = 6;

      const loop = (line : Line, cell : Cell, iteration = 0) => {
          if ( iteration === MAX_CELL_ITERATIONS-1 ) {
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
              setTimeout(() => loop(line, cell), this.randomNumber(0,3000));
          }
      }
    }

    changeTransition(tmpLines: Line[]) {
      // max iterations for each cell to change the current value
      const MAX_CELL_ITERATIONS = 10;
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
              setTimeout(() => loop(line, cell, iteration), 80);
          }
      };

      for (const line of this.lines) {
          for (const cell of line.cells) {
              setTimeout(() => loop(line, cell), this.randomNumber(0,2000));
          }
      }
    }
}



export default function YTPlayer() {
  const [ascii, setAscii] = useState<{ __html: string }>({ __html: "<div class='ascii'>loading...<div>" });
  const [text, setText] = useState<TypeShuffle>();
  
  // can't directly make TypeShuffle bc it has to point to the initialized element
  // so we gotta do this stupid style manipulation to make the loading effect work
  async function initImg() {
    var html = document.createElement("div")
    var res = await asciify("public/igor.jpg");
    html.innerHTML = res.__html;
    html.classList.add("ascii")
    html.style.display = "none"
    startTransition(() => setAscii({__html: html.outerHTML}))
  }

  // runs once, load in html for ascii
  // has to be in useEffect bc initImg is async
  // will turn into infinite render fun if outside
  useEffect(() => {
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
  // done this way bc need to keep the same TypeShuffle for smooth transition
  // instead of fn, useState w/ name of file?
  async function changeAscii() {
    var html = document.createElement("div")
    var res = await asciify("public/blonde.jpg")
    html.innerHTML = res.__html;
    html.classList.add("ascii")
    text?.change(html)
  }

  enum PLAYLIST {
    HEART = 0,
    HIPHOP = 1,
    POP = 2,
    JP = 3,
  }

  const [active, setActive] = useState(PLAYLIST.HEART);
  const [backdrop, setBackdrop] = useState("backdrop-hue-rotate-0");

  var player: YouTubePlayer;
  var state: PlayerStates = PlayerStates.PLAYING;

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    // access to player in all event handlers via event.target
    player = event.target;
  };

  const onStateChange: YouTubeProps["onStateChange"] = async (event) => {
    state = await event.target.getPlayerState();
    if (state == YouTube.PlayerState.PLAYING) {
    }
  };

  const opts: YouTubeProps["opts"] = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
    },
  };

  function changeActive(playlist: PLAYLIST) {
    setActive(playlist);

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
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }


  return (
    <>
      <YouTube
        id="yt"
        videoId="9JQDPjpfiGw"
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onStateChange}
      />
      <div className="flex justify-center">
        <div
          // individual style-glow kills performance
          className={cn("w-[380px] text-[16px]/[1.2]")}
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
      <h2 className="mt-20 ml-10">title</h2>
      <h3 className="ml-10">artist</h3>

      <div className="ml-5 absolute bottom-0">
        <h2>playlist</h2>
        <nav>
          <Link
            onMouseEnter={() => {
              changeActive(PLAYLIST.HEART);
            }}
            className={[
              style.menu__item,
              "mb-5",
              "post",
              "before:content-['']",
              active == PLAYLIST.HEART ? "bg-black" : "",
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
              changeActive(PLAYLIST.HIPHOP);
            }}
            className={[
              style.menu__item,
              "mb-5",
              "post",
              "before:content-['']",
              active == PLAYLIST.HIPHOP ? "bg-black" : "",
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
          <span onClick={async () => await changeAscii()}>next</span>
          {/* <span onClick={async () => setAscii(await asciify("public/blonde.jpg"))}>next</span> */}
        </h3>
      </div>
    </>
  );
}