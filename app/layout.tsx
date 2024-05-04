import "../styles/global.css";
import { Metadata } from "next";
import ThemeProvider from "./theme-provider";
import localFont from "next/font/local";

const cascadia_mono = localFont({
  src: "../public/CascadiaMono.woff2",
  variable: "--font-cascadia-mono",
});

import { Roboto_Mono, Victor_Mono, Space_Mono } from "next/font/google";

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

const victor_mono = Victor_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-victor-mono",
  adjustFontFallback: false,
});

const space_mono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-mono",
  weight: '400',
});

export const metadata: Metadata = {
  title: "hi welcome to my site",
  description:
    "AREN’T YOU HOT IN SUCH HEAVY CLOTHES WHY DO YOU HAVE TO GO BACK TO YOUR HOMETOWN NOW YOU FAILED THE COLLEGE ENTRANCE EXAM TWICE NOW IT DOESN’T MATTER I WILL COME BACK AFTER I ATTEND THE CLASS REUNION POOL PARTY TOMORROWRUMIKO YOU ARE SO EASY GOING MY NECKLACE IS RATTLING I WONDER COULD IT BE THE SHIRATORI SHRINE SHIRATORI? THIS MUST BE THE PLACE WHERE YAMATO TAKERU NO MIKOTO CAME DOWN FROM THE SKY WHOA WHAT THE HECK IS THIS NOW? UAHH",
  icons: "/favicon.ico",
  // property="og:image"
  // content={`https://og-image.vercel.app/${encodeURI(
  //   siteTitle,
  // )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}

  //   <meta name="og:title" content={siteTitle} />
  //   <meta name="twitter:card" content="summary_large_image" />
};

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${victor_mono.variable} ${roboto_mono.variable} ${cascadia_mono.variable} ${space_mono.variable}`}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
