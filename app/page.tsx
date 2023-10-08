import Typewriter from 'components/typewriter'
import style from 'styles/app.module.css'

export default function Home() {
  return (
    <div className="flex justify-center h-[100%]">
        <div  className="max-w-[95%] max-h-[95%] shadow-lg bg-black px-8 py-6 relative bg-opacity-40 mt-4 h-fit">
          <h1 className="absolute top-0 left-3 animate-slow_blink">
            &lceil;
          </h1>
          <h1 className="absolute bottom-0 right-3 animate-slow_blink">
            &rfloor;
          </h1>
          <Typewriter></Typewriter>
        </div>
    </div>
  );
}


