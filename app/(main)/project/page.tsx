"use client";
// TODO eventually TS all this
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
				<h2 className="m-0 text-[8vw] text-[#d3d3d3] uppercase">
					<span>{title}</span>
				</h2>
				<div className="grid grid-cols-[repeat(50,_2%)] grid-rows-[repeat(50,_2%)] absolute w-[120%] h-[120%] top-[-10%] left-[-10%] will-change-transform" style={{ ["perspective" as any]: "1000px" }}>
					{/* TODO refactor to Link component?, or make own custom component.... */}
					{/* TODO on hover video */}
					{/* TODO add hover effects */}
					{/* TODO add curve effect */}
					{/* max col: 41, max row: 39 */}
					<a href="/sound" className="grid-item bg-cover bg-center rounded-[10px] bg-[url('/ascii.png')] col-[14_/_span_10] row-[15_/_span_12]"
					data-title="ascii music player" 
					data-desc="built in react using react-youtube package for audio, spotify api for images, asciify-image and ansi-to-html to handle the ascii, and splitting to support transitions. lessons learned: frakensteining packages together sucks." >
					</a>
					<a href="https://github.com/hlxmh/orange-site" target="_blank" className="grid-item bg-cover bg-center rounded-[10px] bg-[url('/orange.png')] col-[1_/_span_10] row-[1_/_span_12]"
					data-title="orange co. site" 
					data-desc="raw html + css, js for flavour. first 'project'. abandoned bc of unclear requests." >
					</a>
					<a href="https://github.com/hlxmh/image-pdf-test" className="grid-item bg-cover bg-center rounded-[10px] bg-[url('/pdf-test.png')] col-[29_/_span_10] row-[1_/_span_12]"
					data-title="client image, server pdf" 
					data-desc="server side printing test, uses ngx-capture for screenshots, pdfkit to handle pdfs, and express for the server." >
					</a>
					<a href="https://github.com/hlxmh/mainnet-test" className="grid-item bg-cover bg-center rounded-[10px] bg-[url('/mainnet-test.png')] col-[30_/_span_10] row-[30_/_span_12]"
					data-title="mainnet api test" 
					data-desc="pure html, create wallets and transfer bch test coins using mainnet api. lessons learned: outdated documentation is death.">
					</a>
					<a href="/project/os161" className="grid-item bg-cover bg-center rounded-[10px] bg-[url('/os161.png')] col-[25_/_span_10] row-[17_/_span_12]"
					data-title="os161" 
					data-desc="an operating system written for school in c and occasionally assembly, ran on wsl2 docker. supports concurrency and mem management." >
					</a>
					<a href="/project/hydra" className="grid-item bg-cover bg-center rounded-[10px] bg-[url('/hydra.png')] col-[5_/_span_10] row-[30_/_span_12]"
					data-title="terminal hydra" 
					data-desc="a text implementation of the hydra card game. written in c++, featuring the mvc model and the observer design pattern." >
					</a>
				</div>
			</div>
		</main>
		{/* TODO add a background, make more readable */}
		<div className="cursor absolute w-full h-full top-0 left-[30px] pointer-events-none z-50">
			<span className="cursor-title absolute top-0 text-md uppercase text-black"></span>
			<span className="cursor-desc absolute top-8 left-[20px] text-sm uppercase w-1/4 text-slate-800"></span>
		</div>
        </>
  );
}