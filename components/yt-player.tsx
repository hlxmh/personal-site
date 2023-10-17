"use client";

import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube";
import Link from "next/link";
import style from "styles/txt.module.css";
import React from "react";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import { useEffect } from "react";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";

const loadClass = "loading";
// document.body.classList.add(loadClass);
// document.body.classList.remove(loadClass);

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
        console.log("ohhhhhhh")
        // console.log(this.original)
        this.state = this.original;
        this.position = position;
        this.previousCellPosition = previousCellPosition;
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
    totalChars = 0;

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
            this.totalChars += charCount;
        }

        // TODO
        // window.addEventListener('resize', () => this.resize());
	}
    /**
     * clear all the cells chars, very likely not needed
     */
    clearCells() {
      console.log('bai  bais')
        for (const line of this.lines) {
            for (const cell of line.cells) {
                console.log(cell.original)
                // cell.set('&nbsp;');
            }    
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
    fx3() {
        const MAX_CELL_ITERATIONS = 10;
        this.clearCells();

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
                setTimeout(() => loop(line, cell), this.randomNumber(0,2000));
            }
        }
    }

}





export default function YTPlayer() {

  const [text, setText] = React.useState<TypeShuffle>();

  useEffect(() => {
    const textElement = document.querySelector('.weh');
    console.log(textElement)
    setText(new TypeShuffle(textElement as HTMLDivElement));
    console.log("oh yeah")
    // textElement ? text = ts : "";
    console.log(text)
  }, []);


  enum PLAYLIST {
    HEART = 0,
    HIPHOP = 1,
    POP = 2,
    JP = 3,
  }

  const [active, setActive] = React.useState(PLAYLIST.HEART);
  const [backdrop, setBackdrop] = React.useState("backdrop-hue-rotate-90");
  // ?????^v
  var player: YouTubePlayer;
  var state: PlayerStates = PlayerStates.PLAYING;

  // fix this dependency
  useEffect(() => {
    console.log("oh no")
    console.log(text)
    text ? text.fx3() : console.log("FFFFFFFFFFFFFFF");
  }, [active]);

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
        setBackdrop("backdrop-hue-rotate-90");
        break;
      }
      case PLAYLIST.HIPHOP: {
        setBackdrop("backdrop-hue-rotate-180");
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
      <div className="w-full">

      </div>
      <h2 className="mt-20 ml-10">title</h2>
      <h3 className="ml-10">artist</h3>

      <div className="ml-5 absolute bottom-0">
        <h2>playlist</h2>
        <nav>
          {/* <div className={active == PLAYLIST.HEART ? 'active' : ''}></div> */}
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
          <span>next</span>
        </h3>
      </div>


      <div className="mr-5 absolute bottom-0 right-0 weh">
        <h3>
          <span>next NAD THAT HS HOW IFELT WHEN ISAW THAT STUFF</span>
          <span>AND THERE IS NO MEANING TO IT AT ALL, IT IS WHAT</span>
        </h3>
      </div>
    </>
  );
}
