import { Geist, Geist_Mono, Anton } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/providers/LenisProvider";
import { FlipProvider } from "@/app/context/FlipContext";
import Navigation from "./components/Navigation";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
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
        className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} antialiased bg-[#1c1c1c]`}
      >
        <LenisProvider>
          <FlipProvider>
            <Navigation />
            {children}
          </FlipProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
