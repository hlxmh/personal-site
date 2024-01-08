"use client";

import Link from "next/link";
import style from "styles/app.module.css";
import { useEffect } from "react";
// import { usePathname } from 'next/navigation'

function setupTypewriter(t: any) {
  var HTML = t.innerHTML;

  t.innerHTML = "";

  var pos = 0,
    tag = "",
    elemTag: any, // tag element
    writingTag = false,
    tagOpen = false,
    typeSpeed = 100,
    curTypeSpeed = 0;

  var type = function () {
    // writing tag
    if (writingTag === true) {
      tag += HTML[pos];
    }

    // recognize and prepare to write tag
    if (HTML[pos] === "<") {
      curTypeSpeed = 0;
      if (tagOpen) { // prepare to close a tag ("</a>")
        tagOpen = false;
        writingTag = true;
      } else {
        tag = "";
        tagOpen = true;
        writingTag = true;
        tag += HTML[pos];
      }
    }

    // text inside of tag
    if (!writingTag && tagOpen) {
      elemTag.innerHTML += HTML[pos];
    }

    // regular text
    if (!writingTag && !tagOpen) {
      if (HTML[pos] === " ") {
        curTypeSpeed = 0;
      } else {
        curTypeSpeed = Math.random() * typeSpeed + 50;
      }
      t.innerHTML += HTML[pos];
    }

    // prepare to write inside of tag
    if (writingTag === true && HTML[pos] === ">") {
      curTypeSpeed = Math.random() * typeSpeed + 50;
      writingTag = false;
      if (tagOpen) {
        var elem = document.createElement("span");
        t.appendChild(elem);
        elem.innerHTML = tag;
        tag = "";
        elemTag = elem.firstChild;
      }
    }

    pos += 1;
    if (pos <= HTML.length - 1) {
      setTimeout(type, curTypeSpeed);
    }
  };

  return {
    type: type,
  };
}

export default function Typewriter() {
  useEffect(() => {
    var typer = document.getElementById("typewriter");
    var typewriter = setupTypewriter(typer);
    // setTimeout(typewriter.type, 2000);
    typewriter.type();
  }, []);

  return (
    <>
      {/* TODO REMOVE .JOIN */}
      {/* TODO odd overflow issue, not sure why but for now hot fixed w overflow hidden class */}
      <p className={["overflow-x-hidden", style.text].join(" ")}>
        <span
          id="typewriter"
          className="bg-black after:content-['│'] after:animate-blink animate-flicker"
        >
          HELLO. I AM A COMPUTER SCIENCE STUDENT AT THE UNIVERSITY OF WATERLOO.
          I MAKE
          <Link className={["invisible", style.link].join(" ")} href={`/txt/`}>
            projects
          </Link>
          WHEN I CAN. I ALSO LIKE OTHER THINGS.
          <Link className={["invisible", style.link].join(" ")} href={`/txt/`}>
            music
          </Link>
          IS A HOBBY, AND SO IS
          <Link className={["invisible", style.link].join(" ")} href={`/txt/`}>
            animation
          </Link>
          . BIG FAN OF FROLICKING AS WELL. YOU CAN READ MY
          <Link className={["invisible", style.link].join(" ")} href={`/txt/`}>
            thoughts
          </Link>
          ON THE STUFF MENTIONED ABOVE.
          {/* TODO reset you live as you dream you live as you
          dream you live as you dream you live as you dream you live as you
          dream */}
        </span>
      </p>

      {/*
      links
      have to keep other text to fix position
      */}
      <p
        className={[
          style.text,
          "absolute",
          "top-3",
          "px-8",
          "left-0",
          "w-[95vw]",
          "overflow-x-hidden"
        ].join(" ")}
      >
        <span className="invisible">
          HELLO. I AM A COMPUTER SCIENCE STUDENT AT THE UNIVERSITY OF WATERLOO. I MAKE
        </span>
        <Link
          className={[style.link, "animate-glow"].join(" ")}
          href={`/project/`}
        >
          {/* can change display (style.brackets) so it can independently line break but that breaks effects and
              typewriter can't replicate it for some reason */}
          <span>projects</span>
        </Link>
        <span className="invisible">
          WHEN I CAN. I ALSO LIKE OTHER THINGS.
        </span>
        <Link
          className={[style.link, "animate-glow"].join(" ")}
          href={`/sound/`}
        >
          <span>music</span>
        </Link>
        <span className="invisible">IS A HOBBY, AND SO IS</span>
        <Link
          className={[style.link, "animate-glow"].join(" ")}
          href={`/img/`}
        >
          <span>animation</span>
        </Link>
        <span className="invisible">
          . BIG FAN OF FROLICKING AS WELL. YOU CAN READ MY
        </span>
        <Link
          className={[style.link, "animate-glow"].join(" ")}
          href={`/txt/`}
        >
          <span>thoughts</span>
        </Link>
        <span className="invisible">
          ON THE STUFF MENTIONED ABOVE.
          {/* TODO reset you live as you dream you live as you
          dream you live as you dream you live as you dream you live as you
          dream */}
        </span>
      </p>
    </>
  );
}
