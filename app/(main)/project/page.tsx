// "use client";
// import { Grid } from './grid';
// import { Cursor } from './cursor';
// import { useLayoutEffect } from 'react';
// import  style from 'styles/project.module.css'
// import 'styles/project.css'





export default function YTPlayer() {
	// useLayoutEffect(() => {
	// 	const grid = new Grid(document.querySelector('.grid'));

	// 	const cursor = new Cursor(document.querySelector('.cursor'));
	// 	// change cursor text status when hovering a grid item
	// 	grid.on('mouseEnterItem', itemTitle => cursor.DOM.text.innerHTML = itemTitle);
	// 	grid.on('mouseLeaveItem', _ => cursor.DOM.text.innerHTML = '');
	//   }, []);

  return (
    <>
        <main>
			<div className="message">Please view this demo on a desktop to see the effect.</div>
			<div className="frame">
				<div className="frame__title-wrap">
					<h1 className="frame__title">3D Grid Interaction with Content Preview</h1>
				</div>
				<div className="frame__links">
					<a href="https://tympanus.net/Development/3DGridContentPreview/">Previous demo</a>
					<a href="https://tympanus.net/codrops/?p=54253">Article</a>
					<a href="https://github.com/codrops/3DGridContentPreview">GitHub</a>
				</div>
			</div>
			<div className="content">
				<h2 className="content__title">
					<span className="content__title-line content__title-line--1" data-splitting>July/</span>
					<span className="content__title-line content__title-line--2" data-splitting>August</span>
				</h2>
				<div className="grid">
					{/* bg-[url('/img/hero-pattern.svg')] */}
					<a href="#preview-1" className="grid__item pos-1" data-title="Mohanneles"><div className="grid__item-img bg-[url('/blonde.jpg')]"></div></a>
					<a href="#preview-2" className="grid__item pos-2" data-title="Procody X"><div className="grid__item-img bg-[url('/igor.jpg')]"></div></a>
					<a href="#preview-3" className="grid__item pos-3" data-title="Evenner"><div className="grid__item-img bg-[url('/wow.png')]"></div></a>
					{/* <a href="#preview-4" className="grid__item pos-4" data-title="M-Dignate"><div className="grid__item-img bg-[url('/gingko.jpg']"></div></a> */}
					{/* <a href="#preview-5" className="grid__item pos-5" data-title="Boxtony"><div className="grid__item-img bg-[url(img/thumbs/5.jpg);"></div></a>
					<a href="#preview-6" className="grid__item pos-6" data-title="Ruthfull"><div className="grid__item-img bg-[url(img/thumbs/6.jpg);"></div></a>
					<a href="#preview-7" className="grid__item pos-7" data-title="La Facuoup"><div className="grid__item-img bg-[url(img/thumbs/7.jpg);"></div></a>
					<a href="#preview-8" className="grid__item pos-8" data-title="Medivict"><div className="grid__item-img bg-[url(img/thumbs/8.jpg);"></div></a>
					<a href="#preview-9" className="grid__item pos-9" data-title="Steeplump"><div className="grid__item-img bg-[url(img/thumbs/9.jpg);"></div></a>
					<a href="#preview-10" className="grid__item pos-10" data-title="Resson"><div className="grid__item-img bg-[url(img/thumbs/10.jpg);"></div></a>
					<a href="#preview-11" className="grid__item pos-11" data-title="Atinkers"><div className="grid__item-img bg-[url(img/thumbs/11.jpg);"></div></a>
					<a href="#preview-12" className="grid__item pos-12" data-title="Twinhouse"><div className="grid__item-img bg-[url(img/thumbs/12.jpg);"></div></a>
					<a href="#preview-13" className="grid__item pos-13" data-title="Lonstrian"><div className="grid__item-img bg-[url(img/thumbs/13.jpg);"></div></a>
					<a href="#preview-14" className="grid__item pos-14" data-title="Satinge"><div className="grid__item-img bg-[url(img/thumbs/14.jpg);"></div></a>
					<a href="#preview-15" className="grid__item pos-15" data-title="Vikins"><div className="grid__item-img bg-[url(img/thumbs/15.jpg);"></div></a>
					<a href="#preview-16" className="grid__item pos-16" data-title="Choulder V"><div className="grid__item-img bg-[url(img/thumbs/16.jpg);"></div></a> */}
				</div>
			</div>
		</main>
		<div className="cursor">
			<span className="cursor__text"></span>
		</div>
        </>
  );
}