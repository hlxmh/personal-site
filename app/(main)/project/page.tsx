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
	// so this is a little dumb thing so there aren't two grids
	const isCreated = useRef(false)

	useEffect(() => {
		var grid : Grid | null = null;
		if (isCreated.current === false) {
			grid = new Grid(document.querySelector('.grid'));
		}
		isCreated.current = true

		const cursor = new Cursor(document.querySelector('.cursor'));
		// change cursor text status when hovering a grid item
		grid?.on('mouseEnterItem', (itemTitle, itemDesc) => {cursor.DOM.text.innerHTML = itemTitle; cursor.DOM.desc.innerHTML = itemDesc; setTitle(itemTitle)});
		// replace this with opacity fade
		grid?.on('mouseLeaveItem', _ => cursor.DOM.text.innerHTML = '');
	  }, []);

  return (
    <>
        <main>
			<div className="message">Please view this demo on a desktop to see the effect.</div>
			<div className="content">
				<h2 className="content__title">
					<span className="content__title-line content__title-line--1" data-splitting>{title}</span>
					<span className="content__title-line content__title-line--2" data-splitting>August</span>
				</h2>
				<div className="grid">
					<a href="#preview-1" className="grid__item pos-1" data-title="ascii music player" 
					data-desc="built in react using react-youtube package for audio, spotify api for images, asciify-image and ansi-to-html to handle the ascii, and splitting to support transitions. lesson learned: frakensteining packages together sucks" >
						<div className="grid__item-img bg-[url('/blonde.jpg')]"></div>
					</a>
					<a href="#preview-2" className="grid__item pos-2" data-title="Procody X"><div className="grid__item-img bg-[url('/igor.jpg')]"></div></a>
					<a href="#preview-3" className="grid__item pos-3" data-title="Evenner"><div className="grid__item-img bg-[url('/wow.png')]"></div></a>
					<a href="#preview-4" className="grid__item pos-4" data-title="Evenner"><div className="grid__item-img bg-[url('/gingko.jpg')]"></div></a>
					<a href="#preview-5" className="grid__item pos-5" data-title="Evenner"><div className="grid__item-img bg-[url('/t.jpg')]"></div></a>

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