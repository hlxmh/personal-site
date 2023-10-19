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

export default function Home() {
  // var ascii_img: any = { __html: "<p>some raw html</p>" };
  // const res = await asciify("public/blonde.jpg", options);

  //   // typeof asciified === "string" ? console.log(asciified) : ascii_img = "";
  //   typeof res === "string"
  //     ? (ascii_img.__html = convert.toHtml(res))
  //     : (ascii_img = "");
  return (
    <>
      {/* <div className={`flex justify-center`}>
        <div
        // individual style-glow kills performance
        className={cn("leading-[1.2] w-[380px] ascii")}
          dangerouslySetInnerHTML={ascii_img}
        ></div>
      </div> */}
      <YTPlayer></YTPlayer>
    </>
  );
}
