"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Footer = () => {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-NL", {
      timeZone: "Europe/Amsterdam",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-NL", {
          timeZone: "Europe/Amsterdam",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="w-full bg-white text-black pt-8 font-tinos">
      <div className="w-full px-5 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* CONTACT Section */}
        <div className="flex flex-col">
          <h2 className="text-xs uppercase tracking-wide mb-5 text-gray-600">
            CONTACT
          </h2>
          <Link
            href="mailto:info@mursee.nl"
            className="text-sm hover:text-gray-600 transition-colors"
          >
            INFO@MURSEE.NL
          </Link>
        </div>

        {/* VISIT Section */}
        <div className="flex flex-col">
          <h2 className="text-xs uppercase tracking-wide mb-5 text-gray-600">
            ONS KANTOOR
          </h2>
          <address className="text-sm not-italic leading-relaxed uppercase">
            <p>John M. Keynesplein 12-46,</p>
            <p>1066 EP Amsterdam, Nederland</p>
            <p className="text-gray-500">{time}</p>
          </address>
        </div>

        {/* MENU Section */}
        <div className="flex flex-col">
          <h2 className="text-xs uppercase tracking-wide mb-5 text-gray-600">
            MENU
          </h2>
          <nav className="flex flex-col space-y-2">
            <Link
              href="/"
              className="text-sm hover:text-gray-600 transition-colors"
            >
              HOME
            </Link>
            <Link
              href="/about"
              className="text-sm hover:text-gray-600 transition-colors"
            >
              ABOUT
            </Link>
            <div className="flex items-center">
              <Link
                href="/work"
                className="text-sm hover:text-gray-600 transition-colors"
              >
                WORK
              </Link>
              <span className="text-[10px] ml-1.5 text-gray-500">[78]</span>
            </div>
            <div className="flex items-center">
              <Link
                href="/directors"
                className="text-sm hover:text-gray-600 transition-colors"
              >
                DIRECTORS
              </Link>
              <span className="text-[10px] ml-1.5 text-gray-500">[3]</span>
            </div>
            <Link
              href="/contact"
              className="text-sm hover:text-gray-600 transition-colors"
            >
              CONTACT
            </Link>
          </nav>
        </div>

        {/* SOCIALS Section */}
        <div className="flex flex-col">
          <h2 className="text-xs uppercase tracking-wide mb-5 text-gray-600">
            SOCIALS
          </h2>
          <nav className="flex flex-col space-y-2">
            <Link
              href="https://vimeo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-gray-600 transition-colors"
            >
              VIMEO
            </Link>
            <Link
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-gray-600 transition-colors"
            >
              INSTAGRAM
            </Link>
            <Link
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-gray-600 transition-colors"
            >
              X
            </Link>
            <Link
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-gray-600 transition-colors"
            >
              FACEBOOK
            </Link>
          </nav>
        </div>
      </div>
      <div className="mt-32">
        <div className="px-6 md:px-10 h-44 w-full relative">
          <svg
            width="100%"
            height="auto"
            viewBox="0 0 1000 100"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full"
          >
            <defs>
              <clipPath id="murseeLogoClip">
                <text
                  x="0"
                  y="150"
                  className="font-franklin tracking-tight text-[12vw] font-bold"
                >
                  MURSEE FILMS
                </text>
              </clipPath>
            </defs>
          </svg>
          <div className="relative h-full w-full">
            <video
              autoPlay
              muted
              loop
              style={{
                clipPath: "url(#murseeLogoClip)",
              }}
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/header.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center px-6 md:px-10 py-4 text-sm text-gray-500">
        <div>
          &copy; {new Date().getFullYear()} MURSEE FILMS. All rights reserved.
        </div>
        <div>Made by Mik Development</div>
      </div>
    </footer>
  );
};

export default Footer;
