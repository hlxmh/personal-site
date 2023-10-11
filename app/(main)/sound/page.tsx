'use client'

import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube';
import Link from 'next/link';
import style from 'styles/txt.module.css'
import React from 'react';
import PlayerStates from 'youtube-player/dist/constants/PlayerStates';
import Image from 'next/image'
import igor from 'public/igor.jpg'
import { Canvas } from "@react-three/fiber";
import * as THREE from 'three'




// import type { Metadata } from 'next'
 
// export const metadata: Metadata = {
//   title: 'hear me roar',
//   description: 'so badass...',
// }







let scene, camera, renderer, analyser, uniforms;

const fftSize = 128;

const loadClass = "loading";
// document.body.classList.add(loadClass);
// document.body.classList.remove(loadClass);

export default function Home() {
    enum PLAYLIST {
        HEART = 0,
        HIPHOP = 1,
        POP = 2,
        JP = 3
    }


    const [active, setActive] = React.useState(PLAYLIST.HEART);
    const [backdrop, setBackdrop] = React.useState("backdrop-hue-rotate-90");
    // ?????^v
    var player: YouTubePlayer;
    var state : PlayerStates = PlayerStates.PLAYING;

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        // access to player in all event handlers via event.target
        player = event.target;
    }

    const onStateChange: YouTubeProps['onStateChange'] = async (event) => {
        state = await event.target.getPlayerState();
        if (state == YouTube.PlayerState.PLAYING) {

        }
    }
    
    const opts: YouTubeProps['opts'] = {
    height: '0',
    width: '0',
    playerVars: {
        autoplay: 1,
    },
    };

    function changeActive(playlist: PLAYLIST) {
        setActive(playlist)

        switch(playlist) { 
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
    <YouTube id="yt" videoId="9JQDPjpfiGw" opts={opts} onReady={onPlayerReady} onStateChange={onStateChange}/>
    <div className={["absolute", "top-0", "left-0", "h-screen", "w-screen", backdrop].join(" ")}></div>
    <div className="w-full">
        <Image
            className="m-auto"
            src={igor}
            alt="Picture of the author"
            // width={500} automatically provided
            // height={500} automatically provided
            // blurDataURL="data:..." automatically provided
            // placeholder="blur" // Optional blur-up while loading
        />

        {/* <Canvas
         camera={{
          position: [-6, 7, 7],
        }}
        >
        </Canvas> */}
    </div>
    <h2 className="mt-20 ml-10">title</h2>
    <h3 className="ml-10">artist</h3>
    

    <div className="ml-5 absolute bottom-0">
        <h2>playlist</h2>
        <nav>
            {/* <div className={active == PLAYLIST.HEART ? 'active' : ''}></div> */}
            <Link onMouseEnter={() => {
        changeActive(PLAYLIST.HEART);
      }} className={[style.menu__item, "mb-5", "post", "before:content-['']", active == PLAYLIST.HEART ? 'bg-black' : ''].join(" ")} href="https://google.com" target="_blank">
                <h3><span className={style.menu__item_name}>start</span></h3>
            </Link>
            <Link onMouseEnter={() => {
        changeActive(PLAYLIST.HIPHOP);
      }} className={[style.menu__item, "mb-5", "post", "before:content-['']", active == PLAYLIST.HIPHOP ? 'bg-black' : ''].join(" ")} href="https://google.com" target="_blank">
                <h3><span className={style.menu__item_name}>hip hop</span></h3>
            </Link>
            <Link className={[style.menu__item, "mb-5", "post", "before:content-['']",].join(" ")} href={`google.com`}>
                <h3><span className={style.menu__item_name}>pop</span></h3>
            </Link>
            <Link className={[style.menu__item, "mb-5", "post", "before:content-['']",].join(" ")} href={`google.com`}>
                <h3><span className={style.menu__item_name}>jp</span></h3>
            </Link>
        </nav>
    </div>


    <div className="mr-5 absolute bottom-0 right-0">
        <h3><span>prev</span><span onClick={playPause} className="cursor-pointer"> {state == PlayerStates.PLAYING ? '⏵' : 'booo'} </span><span>next</span></h3>
    </div>
    </>
  );
}
