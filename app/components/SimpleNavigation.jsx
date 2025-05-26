"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import ContactDialog from "./ContactDialog";

const SimpleNavigation = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navRef = useRef(null);
  const [animationStarted, setAnimationStarted] = useState(false);

  // Navigation links
  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "PROJECTEN", href: "/projects" },
    { label: "OVER ONS", href: "/about" },
  ];

  const handleContactClick = (e) => {
    e.preventDefault();
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const runNavAnimation = () => {
    // Set animation started state to true to allow showing elements
    setAnimationStarted(true);

    // Reset animation states
    gsap.set(navRef.current, { y: -100, opacity: 0 });

    // Animate navigation in after OpenAnimation completes (around 5 seconds)
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
        delay: 5, // Wait for OpenAnimation to complete
      }
    );
  };

  useEffect(() => {
    // Only run animation on home page
    if (window.location.pathname === "/") {
      const timer = setTimeout(() => {
        runNavAnimation();
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    } else {
      // On other pages, show navigation immediately
      setAnimationStarted(true);
      if (navRef.current) {
        gsap.set(navRef.current, { y: 0, opacity: 1 });
      }
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        window.location.pathname === "/"
      ) {
        runNavAnimation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 ${
          !animationStarted && window.location.pathname === "/"
            ? "hidden-initially"
            : ""
        }`}
      >
        <nav
          ref={navRef}
          className="flex items-center justify-between px-10 py-6 mx-auto"
        >
          {/* Left section (empty for balance) */}
          <div className="w-32">
            <h1 className="font-franklin text-white text-4xl">MF</h1>
          </div>

          {/* Middle section - Navigation links */}
          <div className="flex justify-center">
            <ul className="flex space-x-8">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm uppercase text-white hover:text-gray-300 transition-colors font-franklin"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right section - CTA button */}
          <div className=" flex justify-end">
            <button
              onClick={handleContactClick}
              className="px-4 py-2 bg-white text-black text-sm uppercase font-franklin hover:bg-gray-200 transition-colors"
            >
              Start een project
            </button>
          </div>
        </nav>
      </header>

      <ContactDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </>
  );
};

export default SimpleNavigation;
