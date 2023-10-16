"use client";

import Link from "next/link";
import style from "styles/app.module.css";
import { useEffect } from "react";
// import { usePathname } from 'next/navigation'

function setupTypewriter(t: any) {
  var HTML = t.innerHTML;

  t.innerHTML = "";

  var cursorPosition = 0,
    tag = "",
    elem,
    elemC: any,
    writingTag = false,
    tagOpen = false,
    typeSpeed = 100,
    tempTypeSpeed = 0;

  var type = function () {
    if (writingTag === true) {
      tag += HTML[cursorPosition];
      console.log(1);
      console.log(tag);
    }

    if (HTML[cursorPosition] === "<") {
      tempTypeSpeed = 0;
      if (tagOpen) {
        tagOpen = false;
        writingTag = true;
      } else {
        tag = "";
        tagOpen = true;
        writingTag = true;
        tag += HTML[cursorPosition];
        console.log(2);
        console.log(tag);
      }
    }
    if (!writingTag && tagOpen) {
      elemC.innerHTML += HTML[cursorPosition];
      console.log(3);
      console.log(typeof tag);
      console.log(tag);
    }
    if (!writingTag && !tagOpen) {
      if (HTML[cursorPosition] === " ") {
        tempTypeSpeed = 0;
      } else {
        tempTypeSpeed = Math.random() * typeSpeed + 50;
      }
      t.innerHTML += HTML[cursorPosition];
    }
    if (writingTag === true && HTML[cursorPosition] === ">") {
      tempTypeSpeed = Math.random() * typeSpeed + 50;
      writingTag = false;
      if (tagOpen) {
        elem = document.createElement("span");
        t.appendChild(elem);
        elem.innerHTML = tag;
        tag = "";
        elemC = elem.firstChild;
        console.log(4);
        console.log(tag);
      }
    }

    cursorPosition += 1;
    if (cursorPosition < HTML.length - 1) {
      setTimeout(type, tempTypeSpeed);
    }
  };

  return {
    type: type,
  };
}

export default function Home() {
  useEffect(() => {
    var typer = document.getElementById("typewriter");
    var typewriter = setupTypewriter(typer);
    // setTimeout(typewriter.type, 2000);
    typewriter.type();
  }, []);

  return (
    <>
      {/* REMOVE .JOIN */}
      <p className={style.text}>
        <span
          id="typewriter"
          className="bg-black after:content-['│'] after:animate-blink animate-flicker"
        >
          HELLO. I AM A COMPUTER SCIENCE STUDENT AT THE UNIVERSITY OF WATERLOO.
          I MAKE{" "}
          <Link className={["invisible", style.link].join(" ")} href={`/txt/`}>
            projects
          </Link>{" "}
          WHEN I CAN. I ALSO LIKE OTHER THINGS.{" "}
          <Link className={["invisible", style.link].join(" ")} href={`/txt/`}>
            music
          </Link>{" "}
          IS A HOBBY, AND SO IS{" "}
          <Link className={["invisible", style.link].join(" ")} href={`/txt/`}>
            photography
          </Link>
          . I FROLICK IN FIELDS TOO. YOU CAN READ MY{" "}
          <Link className={["invisible", style.link].join(" ")} href={`/txt/`}>
            thoughts
          </Link>{" "}
          ON THE STUFF MENTIONED ABOVE. you live as you dream you live as you
          dream you live as you dream you live as you dream you live as you
          dream
        </span>
      </p>

      {/* links */}
      <p
        className={[
          style.text,
          "absolute",
          "top-3",
          "px-8",
          "left-0",
          "w-[95vw]",
        ].join(" ")}
      >
        <span className="invisible">
          HELLO. I AM A COMPUTER SCIENCE STUDENT AT THE UNIVERSITY OF WATERLOO.
          I MAKE{" "}
        </span>
        <Link
          className={[style.link, style.brackets, "animate-glow"].join(" ")}
          href={`/txt/`}
        >
          <span>projects</span>
        </Link>
        <span className="invisible">
          {" "}
          WHEN I CAN. I ALSO LIKE OTHER THINGS.{" "}
        </span>
        <Link
          className={[style.link, style.brackets, "animate-glow"].join(" ")}
          href={`/sound/`}
        >
          music
        </Link>
        <span className="invisible"> IS A HOBBY, AND SO IS </span>
        <Link
          className={[style.link, style.brackets, "animate-glow"].join(" ")}
          href={`/txt/`}
        >
          photography
        </Link>
        <span className="invisible">
          . I FROLICK IN FIELDS TOO. YOU CAN READ MY{" "}
        </span>
        <Link
          className={[style.link, style.brackets, "animate-glow"].join(" ")}
          href={`/txt/`}
        >
          thoughts
        </Link>
        <span className="invisible">
          {" "}
          ON THE STUFF MENTIONED ABOVE. you live as you dream you live as you
          dream you live as you dream you live as you dream you live as you
          dream
        </span>
      </p>
    </>
  );
}
