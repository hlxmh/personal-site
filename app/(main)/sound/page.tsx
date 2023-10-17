import React from "react";
import asciify from "asciify-image";
import Convert from "ansi-to-html";
import { cn } from "lib/utils"
import YTPlayer from 'components/yt-player'

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
      <YTPlayer></YTPlayer>
    </>
  );
}
