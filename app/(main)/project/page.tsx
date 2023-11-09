"use client";
import { Grid } from './grid';
import { Cursor } from './cursor';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import  style from 'styles/project.module.css'
import 'styles/project.css'





export default function YTPlayer() {
	const [title, setTitle] = useState("");
	
	// beyond confused but apparently the old grid doesn't get deleted once its ref is overwritten during double setup
	// (i do the same thing in sound and it works there?)
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
        <main>
			<div className="content">
				<h2 className="content__title">
					<span>{title}</span>
				</h2>
				<div className="grid">
					{/* TODO refactor to Link component? */}
					<a href="/sound" className="grid__item grid__item-img pos-1 bg-[url('/blonde.jpg')]" data-title="ascii music player" 
					data-desc="built in react using react-youtube package for audio, spotify api for images, asciify-image and ansi-to-html to handle the ascii, and splitting to support transitions. lesson learned: frakensteining packages together sucks" >
					</a>
					<a href="/sound" className="grid__item grid__item-img pos-2 bg-[url('/igor.jpg')]" data-title="orange site" 
					data-desc="this one sucks." >
					</a>
					<a href="/sound" className="grid__item grid__item-img pos-3 bg-[url('/wow.png')]" data-title="pdf crawl rip" 
					data-desc="small little serverside printing" >
					</a>
					<a href="/sound" className="grid__item grid__item-img pos-4 bg-[url('/wow.png')]" data-title="pdf crawl rip" 
					data-desc="small little serverside printing" >
					</a>
					<a href="/sound" className="grid__item grid__item-img pos-5 bg-[url('/gingko.jpg')]" data-title="classified" 
					data-desc="like area 51 17 38 i w" >
					</a>
					<a href="/sound" className="grid__item grid__item-img pos-6 bg-[url('/blonde.jpg')]" data-title="kusa" 
					data-desc="www" >
					</a>
				</div>
			</div>
		</main>
		<div className="cursor">
			<span className="cursor_title"></span>
			<span className="cursor_desc"></span>
		</div>
        </>
  );
}