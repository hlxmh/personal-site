"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import style from "styles/app.module.css";

type Segment = { text: string; href?: string };

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
  { text: ". I DON'T REALLY CARE. SERIOUSLY. I DON'T KNOW WHY YOU DON'T BELIEVE ME." },
];

const completeText = segments.map(({ text }) => text).join("");
const positionedSegments = segments.map((segment, index) => ({
  ...segment,
  start: segments
    .slice(0, index)
    .reduce((total, precedingSegment) => total + precedingSegment.text.length, 0),
}));

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
  const totalLength = useMemo(
    () => segments.reduce((total, segment) => total + segment.text.length, 0),
    [],
  );
  const visibleLength = useTypedLength(totalLength);

  return (
	<p className={["overflow-x-hidden", style.text].join(" ")}>
      <span className="bg-black after:content-['│'] after:animate-blink animate-flicker">
        {positionedSegments.map((segment, index) => {
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
