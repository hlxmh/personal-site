import "../styles/global.css";
import { Metadata } from "next";
import localFont from "next/font/local";

const cascadia_mono = localFont({
  src: "../public/CascadiaMono.woff2",
  variable: "--font-cascadia-mono",
});

export const metadata: Metadata = {
  title: "hi welcome to my site",
  icons: "/favicon.ico",
};

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cascadia_mono.variable}
    >
      <body>{children}</body>
    </html>
  );
}
