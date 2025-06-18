"use client";

import { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import Link from "next/link";

const Header = () => {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const mRef = useRef(null);
  const fRef = useRef(null);
  const urseeRef = useRef(null);
  const filmsRef = useRef(null);
  const [animationStarted, setAnimationStarted] = useState(false);
  const pathname = usePathname();

  // Register GSAP plugins once
  useEffect(() => {
    // Register ScrollTrigger plugin if needed
    if (typeof window !== "undefined") {
      gsap.registerPlugin();
    }
  }, []);

  const runNavAnimation = () => {
    // Set animation started state to true to allow showing elements
    setAnimationStarted(true);

    // Reset animation states
    gsap.set(navRef.current, { y: -100, opacity: 0 });

    // Animate navigation in
    gsap.fromTo(
      navRef.current,
      {
        y: -100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power4.out",
        delay: 2.5, // Delay to match the timing from HeroSection
      }
    );
  };

  // Logo hover animation
  const handleLogoHover = () => {
    // Animate the F moving to the right
    gsap.to(fRef.current, {
      x: 120,
      duration: 0.4,
      ease: "power2.out",
    });

    // Animate "ursee" appearing
    gsap.fromTo(
      urseeRef.current,
      {
        opacity: 0,
        x: -20,
        scale: 0.8,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
        delay: 0.1,
      }
    );

    // Animate "Films" appearing
    gsap.fromTo(
      filmsRef.current,
      {
        opacity: 0,
        x: -20,
        scale: 0.8,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
        delay: 0.2,
      }
    );
  };

  const handleLogoLeave = () => {
    // Animate the F moving back
    gsap.to(fRef.current, {
      x: 0,
      duration: 0.3,
      ease: "power2.out",
    });

    // Animate "ursee" disappearing
    gsap.to(urseeRef.current, {
      opacity: 0,
      x: -20,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.out",
    });

    // Animate "Films" disappearing
    gsap.to(filmsRef.current, {
      opacity: 0,
      x: -20,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    // Wait for a tiny delay to ensure DOM is ready
    const timer = setTimeout(() => {
      runNavAnimation();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && pathname === "/") {
        runNavAnimation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 ${
        !animationStarted ? "hidden-initially" : ""
      }`}
    >
      <nav
        ref={navRef}
        className="z-20 absolute w-full p-10 flex flex-row justify-between items-center transition-opacity duration-500"
      >
        {/* Left section - Logo */}
        <div className="flex">
          <Link href="/">
            <div
              ref={logoRef}
              className="font-franklin text-white text-4xl cursor-pointer hover:text-gray-300 transition-colors flex items-center overflow-hidden"
              onMouseEnter={handleLogoHover}
              onMouseLeave={handleLogoLeave}
            >
              <span ref={mRef}>M</span>
              <span
                ref={urseeRef}
                className="opacity-0"
                style={{ position: "absolute", left: "1.5rem" }}
              >
                ursee
              </span>
              <span ref={fRef}>F</span>
              <span
                ref={filmsRef}
                className="opacity-0"
                style={{ position: "absolute", left: "2.5rem" }}
              >
                ilms
              </span>
            </div>
          </Link>
        </div>

        {/* Right section - Navigation links */}
        <div className="flex space-x-8">
          <Link
            href="/"
            className="text-white text-sm uppercase font-franklin hover:text-gray-300 transition-colors tracking-wide"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-white text-sm uppercase font-franklin hover:text-gray-300 transition-colors tracking-wide"
          >
            About
          </Link>
          <Link
            href="/projects"
            className="text-white text-sm uppercase font-franklin hover:text-gray-300 transition-colors tracking-wide"
          >
            Projects
          </Link>
          <Link
            href="/contact"
            className="text-white text-sm uppercase font-franklin hover:text-gray-300 transition-colors tracking-wide"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
