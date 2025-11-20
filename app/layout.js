// app/layout.js
import { Tinos } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { LenisProvider } from "@/providers/LenisProvider";
import SimpleNavigation from "./components/SimpleNavigation";
import Footer from "./components/Footer";
import TitleOnBlur from "./components/TitleOnBlur";

const franklin = localFont({
  src: "../public/fonts/franklin.woff2",
  variable: "--font-franklin",
});

const tinos = Tinos({
  variable: "--font-tinos",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Mursee Films",
  description: "Mursee Films",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${franklin.variable} ${tinos.variable}  antialiased bg-black min-h-[100svh]`}
      >
        <TitleOnBlur />
        <LenisProvider>
          <SimpleNavigation />
          {children}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
