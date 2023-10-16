// 'use client'

// import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube';
import Link from "next/link";
import style from "styles/app.module.css";
import React from "react";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import Image from "next/image";
import igor from "public/igor.jpg";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import YTPlayer from "components/yt-player";
import asciify from "asciify-image";
import Convert from "ansi-to-html";
import { cn } from "lib/utils"

// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'hear me roar',
//   description: 'so badass...',
// }

var convert = new Convert();

var options: any = {
  fit: "box",
  width: 20,
  height: 20,
};

var ascii_img: any = { __html: "<p>some raw html</p>" };

let scene, camera, renderer, analyser, uniforms;

const fftSize = 128;

const loadClass = "loading";
// document.body.classList.add(loadClass);
// document.body.classList.remove(loadClass);

export default function Home() {
  asciify("public/igor.jpg", options, function (err, asciified) {
    if (err) throw err;

    // typeof asciified === "string" ? console.log(asciified) : ascii_img = "";
    typeof asciified === "string"
      ? (ascii_img.__html = convert.toHtml(asciified))
      : (ascii_img = "");
  });

  return (
    <>
      <div className={`flex justify-center`}>
        <div
        // individual style-glow kills performance
        className={cn("leading-[1.2] w-0")}
          dangerouslySetInnerHTML={ascii_img}
        ></div>
      </div>
      {/* <YTPlayer></YTPlayer> */}
    </>
  );
}
