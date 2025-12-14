"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Initialize time as null to prevent hydration mismatch
  const [time, setTime] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true after component mounts
    setMounted(true);

    // Check if mobile on client side
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Function to get current time
    const getCurrentTime = () => {
      return new Date().toLocaleTimeString("en-NL", {
        timeZone: "Europe/Amsterdam",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    };

    // Set initial time
    setTime(getCurrentTime());

    // Start timer
    const timer = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Don't render time until component is mounted
  const displayTime = mounted ? time : "--:--:--";

  // Hide footer on homepage - return after all hooks are called
  if (pathname === "/") {
    return null;
  }

  return (
    <div
      className="relative  md:h-[550px] lg:h-[650px]"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      }}
    >
      <footer
        className={`w-full bg-white text-black pt-8 font-tinos ${
          !isMobile ? "fixed bottom-0" : "relative"
        }`}
      >
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
              <p className="text-gray-500">{displayTime} (GMT +1)</p>
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
                href="/studio"
                className="text-sm hover:text-gray-600 transition-colors"
              >
                STUDIO
              </Link>
              <div className="flex items-center">
                <Link
                  href="/work"
                  className="text-sm hover:text-gray-600 transition-colors"
                >
                  PROJECTEN
                </Link>
                <span className="text-[10px] ml-1.5 text-gray-500">[78]</span>
              </div>
        
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
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-gray-600 transition-colors"
              >
                LINKEDIN
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-16 md:mt-32">
          <div className="px-6 md:px-10 h-44 md:h-64 w-full relative">
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
                    y={isMobile ? "150" : "250"}
                    className="font-franklin tracking-tighter text-[15vw] md:text-[12vw] font-bold"
                  >
                    MURSEE FILMS
                  </text>
                </clipPath>
              </defs>
            </svg>
            <div className="relative h-full w-full">
              {isMobile ? (
                <div
                  style={{
                    clipPath: "url(#murseeLogoClip)",
                    backgroundImage: 'url("/images/commercials.webp")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <video
                  autoPlay
                  muted
                  loop
                  style={{
                    clipPath: "url(#murseeLogoClip)",
                  }}
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="/header.webm" type="video/webm" />
                </video>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-10 py-4 text-sm text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} MURSEE FILMS. Alle rechten
            voorbehouden.
          </div>
          <div>
            Code door{" "}
            <Link
              href="https://mikdevelopment.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 cursor-pointer transition-colors duration-300"
            >
              Mik Development
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
