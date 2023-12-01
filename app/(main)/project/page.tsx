"use client";
import { Grid } from './grid';
import { Cursor } from './cursor';
import { useEffect, useRef, useState } from 'react';

// i feel bad about this but there's no good way to get overflow on the body/html as far as i can tell
import 'styles/project.css'

export default function Project() {
	const [title, setTitle] = useState("");
	
	// beyond confused but apparently the old grid doesn't get deleted once its ref is overwritten during double setup
	// (i do the same thing in /sound and it works there?)
	// so this is a little dumb thing so there aren't two grids in dev
	const isCreated = useRef(false)

	useEffect(() => {
		var grid : Grid | null = null;
		if (isCreated.current === false) {
			grid = new Grid(document.querySelector('.grid'));
			isCreated.current = true
		}

		const cursor = new Cursor(document.querySelector('.cursor'));
		// change cursor text status when hovering a grid item
		grid?.on('mouseEnterItem', (itemTitle, itemDesc) => {cursor.DOM.text.innerHTML = itemTitle; cursor.DOM.desc.innerHTML = itemDesc; setTitle(itemTitle)});
		// replace this with opacity fade
		grid?.on('mouseLeaveItem', _ => {cursor.DOM.text.innerHTML = '';  cursor.DOM.desc.innerHTML = '';});
	  }, []);

  return (
    <>
	{/* main? */}
        <main className="h-full">
			<div className="flex w-full h-full items-center">
				{/* mess with text size, default looks fine too */}
				{/* TODO animate, should be h1 */}
				<h2 className="m-0 text-[12vw] text-[#d3d3d3] uppercase">
					<span>{title}</span>
				</h2>
				<div className="grid grid-cols-[repeat(50,_2%)] grid-rows-[repeat(50,_2%)] absolute w-[120%] h-[120%] top-[-10%] left-[-10%] will-change-transform" style={{ ["perspective" as any]: "1000px" }}>
					{/* TODO refactor to Link component?, or make own custom component.... */}
					{/* max col: 41, max row: 39 */}
					<a href="/sound" className="grid__item bg-cover bg-center rounded-[10px] bg-[url('/blonde.jpg')] col-[1_/_span_10] row-[30_/_span_12]"
					data-title="ascii music player" 
					data-desc="built in react using react-youtube package for audio, spotify api for images, asciify-image and ansi-to-html to handle the ascii, and splitting to support transitions. lesson learned: frakensteining packages together sucks" >
					</a>
					<a href="/sound" className="grid__item bg-cover bg-center rounded-[10px] bg-[url('/igor.jpg')] col-[18_/_span_10] row-[1_/_span_12]"
					data-title="orange site" 
					data-desc="this one sucks." >
					</a>
					<a href="/sound" className="grid__item bg-cover bg-center rounded-[10px] bg-[url('/wow.png')] col-[29_/_span_10] row-[1_/_span_12]"
					data-title="pdf crawl rip" 
					data-desc="small little serverside printing" >
					</a>
					<a href="/sound" className="grid__item bg-cover bg-center rounded-[10px] bg-[url('/wow.png')] col-[12_/_span_10] row-[15_/_span_12]"
					data-title="pdf crawl rip" 
					data-desc="small little serverside printing" >
					</a>
					<a href="/sound" className="grid__item bg-cover bg-center rounded-[10px] bg-[url('/gingko.jpg')] col-[25_/_span_10] row-[17_/_span_12]"
					data-title="classified" 
					data-desc="like area 51 17 38 i w" >
					</a>
					<a href="/sound" className="grid__item bg-cover bg-center rounded-[10px] bg-[url('/blonde.jpg')] col-[41_/_span_10] row-[20_/_span_12]"
					data-title="kusa" 
					data-desc="www" >
					</a>
				</div>
			</div>
		</main>
		<div className="cursor absolute w-full h-full top-0 left-[30px] pointer-events-none z-50">
			<span className="cursor-title absolute top-0 text-md uppercase"></span>
			<span className="cursor-desc absolute top-8 left-[20px] text-sm uppercase w-1/2"></span>
		</div>
        </>
  );
}