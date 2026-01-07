// app/layout.js
import { Tinos } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import LayoutClient from "./components/LayoutClient";

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
        className={`${franklin.variable} ${tinos.variable}  antialiased bg-white min-h-[100svh]`}
      >
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
