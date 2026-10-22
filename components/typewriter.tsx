"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import style from "styles/app.module.css";

type Segment =
  | { text: string; href?: string }
  | { icon: "github"; href: string; label: string };

const segments: Segment[] = [
  { text: "HELLO. I AM A DEVELOPER FROM THE UNIVERSITY OF WATERLOO. I MAKE " },
  { text: "projects", href: "/project/" },
  { text: " WHEN I CAN. I ALSO LISTEN TO A LOT OF " },
  { text: "music", href: "/sound/" },
  { text: "AND WATCH A LOT OF " },
  { text: "movies", href: "/img/" },
  { text: ". YOU CAN READ MY " },
  { text: "thoughts", href: "/txt/" },
  { text: " ON THOSE TOPICS. IF YOU WANT. IT'S NOT A BIG DEAL" },
  { text: ". I DON'T REALLY CARE. SERIOUSLY. " },
  {
    icon: "github",
    href: "https://github.com/hlxmh",
    label: "GitHub profile",
  },
];

function segmentTextLength(segment: Segment) {
  return "text" in segment ? segment.text.length : 0;
}

const completeText = segments
  .map((segment) => ("text" in segment ? segment.text : ""))
  .join("");

let segmentStart = 0;
const positionedSegments = segments.map((segment) => {
  const positionedSegment = { ...segment, start: segmentStart };
  segmentStart += segmentTextLength(segment);
  return positionedSegment;
});

function useTypedLength(totalLength: number) {
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (length >= totalLength) return;
    const delay = completeText[length] === " " ? 0 : 50 + Math.random() * 100;
    const timer = window.setTimeout(
      () => setLength((current) => Math.min(current + 1, totalLength)),
      delay,
    );
    return () => window.clearTimeout(timer);
  }, [length, totalLength]);

  return length;
}

export default function Typewriter() {
  const totalLength = completeText.length;
  const visibleLength = useTypedLength(totalLength);

  return (
	<p className={["overflow-x-hidden", style.text].join(" ")}>
      <span className="bg-black after:content-['│'] after:animate-blink animate-flicker">
        {positionedSegments.map((segment, index) => {
          if ("icon" in segment) {
            if (visibleLength < segment.start) return null;

            return (
              <a
                aria-label={segment.label}
                className={[style.githubLink, "animate-glow"].join(" ")}
                href={segment.href}
                key={`${segment.icon}-${segment.href}`}
              >
                <svg
                  aria-hidden="true"
                  className={style.githubIcon}
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-1.05-.02-1.9-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .08 1.53 1.06 1.53 1.06.89 1.57 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 7.17a9.3 9.3 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.25 10.25 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z"
                  />
                </svg>
              </a>
            );
          }

          const visibleText = segment.text.slice(
            0,
            Math.max(0, Math.min(segment.text.length, visibleLength - segment.start)),
          );

          if (!visibleText) return null;
          if (!segment.href) return <span key={index}>{visibleText}</span>;

          return (
            <Link className={[style.link, "animate-glow"].join(" ")} href={segment.href} key={segment.href}>
              <span>{visibleText}</span>
            </Link>
          );
        })}
      </span>
    </p>
  );
}
