import Typewriter from "components/typewriter";
import style from "styles/app.module.css";

export default function Home() {
  return (
    <div className="flex h-[100%] px-[2.5%]">
      <div className="max-w-[100%] max-h-[95%] shadow-lg bg-black px-8 py-3 relative bg-opacity-40 mt-4 h-fit">
        <div className="absolute top-3 left-3 animate-slow_blink text-5xl">
          &lceil;
        </div>
        <div className="absolute bottom-3 right-3 animate-slow_blink text-5xl">
          &rfloor;
        </div>
        <Typewriter></Typewriter>
      </div>
    </div>
  );
}
