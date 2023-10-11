'use client'

import YouTube, { YouTubeProps } from 'react-youtube';
import Link from 'next/link';
import style from 'styles/txt.module.css'
import React from 'react';

export default function Home() {
    enum PLAYLIST {
        HEART = 0,
        HIPHOP = 1,
        POP = 2,
        JP = 3
    }


    const [active, setActive] = React.useState(PLAYLIST.HEART);
    const [backdrop, setBackdrop] = React.useState("backdrop-hue-rotate-90");
    
    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        // access to player in all event handlers via event.target
        // event.target.pauseVideo();
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
    
  return (
    <>
    <YouTube videoId="9JQDPjpfiGw" opts={opts} onReady={onPlayerReady} />
    <div className={["absolute", "top-0", "left-0", "h-screen", "w-screen", backdrop].join(" ")}></div>
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
        <h3><span>prev</span><span>play/pause</span><span>next</span></h3>
    </div>
    </>
  );
}
