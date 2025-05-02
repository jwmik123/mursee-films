// HamburgerMenu.jsx
"use client";
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

const HamburgerMenu = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);
  const menuTimeline = useRef(null);

  useEffect(() => {
    // Initialize the GSAP timeline
    menuTimeline.current = gsap.timeline({ paused: true });

    // Animation for opening the menu (two lines become one in the middle)
    menuTimeline.current
      // Move top line to the exact middle (y: 0)
      .to(
        topLineRef.current,
        {
          y: 0, // Move to the exact center (from -8px to 0)
          duration: 0.3,
          ease: "cubic-bezier(0.2, 0, 0.9, 1)",
        },
        0
      )
      // Move bottom line to the exact middle too and fade it out
      .to(
        bottomLineRef.current,
        {
          y: 0, // Move to the exact center (from 8px to 0)
          opacity: 0,
          duration: 0.3,
          ease: "power3.in",
        },
        0
      );

    return () => {
      // Clean up
      if (menuTimeline.current) {
        menuTimeline.current.kill();
      }
    };
  }, []);

  const handleClick = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
      menuTimeline.current.play();
    } else {
      menuTimeline.current.reverse();
    }

    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <button
      className="flex items-center justify-center w-12 h-12 bg-transparent border-none cursor-pointer z-50"
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-label="Toggle navigation menu"
    >
      <div className="relative w-10 h-10 flex flex-col justify-center items-center">
        <div
          ref={topLineRef}
          className="absolute w-full h-0.5 bg-white rounded-sm -translate-y-1"
        ></div>
        <div
          ref={bottomLineRef}
          className="absolute w-full h-0.5 bg-white rounded-sm translate-y-1"
        ></div>
      </div>
    </button>
  );
};

export default HamburgerMenu;
