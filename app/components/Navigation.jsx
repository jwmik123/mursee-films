"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import HamburgerMenu from "./HamburgerMenu";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const navRef = useRef(null);
  const topHalfRef = useRef(null);
  const bottomHalfRef = useRef(null);
  const menuItemsRef = useRef([]);
  const activeAnimations = useRef({});
  const imageRefs = useRef([]);

  // Menu items with corresponding image paths
  const menuItems = [
    { label: "Home", href: "/", image: "/homepage.webp" },
    { label: "About", href: "/about", image: "/project2.jpg" },
    { label: "Services", href: "/services", image: "/project2.webp" },
    { label: "Contact", href: "/contact", image: "/project2.webp" },
  ];

  // Reset refs when number of items change
  menuItemsRef.current = [];
  imageRefs.current = [];

  // Add to refs array for menu items
  const addToMenuItemsRef = (el) => {
    if (el && !menuItemsRef.current.includes(el)) {
      menuItemsRef.current.push(el);
    }
  };

  // Add to refs array for images
  const addToImageRefs = (el) => {
    if (el && !imageRefs.current.includes(el)) {
      imageRefs.current.push(el);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      // Animate the top half down from off-screen
      gsap.fromTo(
        topHalfRef.current,
        {
          y: "-100%",
        },
        {
          y: "0%",
          duration: 0.6,
          ease: "power3.out",
        }
      );

      // Animate the bottom half up from off-screen
      gsap.fromTo(
        bottomHalfRef.current,
        {
          y: "100%",
        },
        {
          y: "0%",
          duration: 0.6,
          ease: "power3.out",
          onComplete: () => {
            // After both halves meet, animate menu items and footer elements
            const allAnimElements = [
              ...menuItemsRef.current,
              document.querySelector(".footer-content"),
            ];

            gsap.fromTo(
              allAnimElements,
              {
                y: 50,
                opacity: 0,
              },
              {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.4,
                ease: "power2.out",
              }
            );

            // Show the first image by default
            if (imageRefs.current.length > 0) {
              //   gsap.fromTo(
              //     imageRefs.current[0],
              //     {
              //       opacity: 0,
              //       scale: 0.9,
              //     },
              //     {
              //       opacity: 1,
              //       scale: 1,
              //       duration: 0.6,
              //       ease: "power2.out",
              //     }
              //   );
              //   setActiveImageIndex(0);
            }
          },
        }
      );
    } else {
      // Reset menu items and footer first
      const allAnimElements = [
        ...menuItemsRef.current,
        document.querySelector(".footer-content"),
      ];

      gsap.to(allAnimElements, {
        y: 50,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
      });

      // Hide images
      gsap.to(imageRefs.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
      });

      // Animate the top half back up off-screen
      gsap.to(topHalfRef.current, {
        y: "-100%",
        duration: 0.5,
        ease: "power3.in",
      });

      // Animate the bottom half back down off-screen
      gsap.to(bottomHalfRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power3.in",
      });
    }
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen && imageRefs.current.length > 0) {
      // Hide all images
      gsap.to(imageRefs.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
      });

      // Show active image
      gsap.to(imageRefs.current[activeImageIndex], {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [activeImageIndex, menuOpen]);

  const handleMenuToggle = (isOpen) => {
    setMenuOpen(isOpen);
  };

  // Setup letter animation on hover
  const handleMenuItemHover = (e, index) => {
    const originalLetters =
      e.currentTarget.querySelectorAll(".original-letter");
    const hoverLetters = e.currentTarget.querySelectorAll(".hover-letter");

    // Update active image
    setActiveImageIndex(index);

    // Kill any existing animations for this menu item to prevent disappearing
    if (activeAnimations.current[index]) {
      activeAnimations.current[index].kill();
    }

    // Make hover text visible immediately before animation starts
    const hoverTextElement = e.currentTarget.querySelector(".hover-text");
    gsap.set(hoverTextElement, { visibility: "visible" });

    const tl = gsap.timeline();

    // Animate original letters up and fade them out
    tl.to(originalLetters, {
      y: "-100%",
      opacity: 0,
      stagger: 0.02,
      duration: 0.4,
      ease: "power3.out",
    });

    // Simultaneously animate hover letters in from below
    tl.fromTo(
      hoverLetters,
      { y: "100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        stagger: 0.02,
        duration: 0.4,
        ease: "power3.out",
      },
      "-=0.4" // Start at the same time as the original letters animation
    );

    // Store the animation in the refs
    activeAnimations.current[index] = tl;
  };

  // Reset letter animation on mouse leave
  const handleMenuItemLeave = (e, index) => {
    const originalLetters =
      e.currentTarget.querySelectorAll(".original-letter");
    const hoverLetters = e.currentTarget.querySelectorAll(".hover-letter");

    // Kill any existing animations for this menu item
    if (activeAnimations.current[index]) {
      activeAnimations.current[index].kill();
    }

    // Store reference to hover text element
    const hoverTextElement = e.currentTarget.querySelector(".hover-text");

    // Create new timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Hide hover letters completely when done
        if (hoverTextElement) {
          gsap.set(hoverTextElement, { visibility: "hidden" });
        }
      },
    });

    // Animate hover letters down (reverse of hover in)
    tl.to(hoverLetters, {
      y: "100%",
      opacity: 0,
      stagger: 0.02,
      duration: 0.4,
      ease: "power3.out",
    });

    // Simultaneously animate original letters back down (reverse of hover in)
    tl.fromTo(
      originalLetters,
      { y: "-100%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        stagger: 0.02,
        duration: 0.4,
        ease: "power3.out",
      },
      "-=0.4" // Start at the same time as the hover letters animation
    );

    // Store the animation in the refs
    activeAnimations.current[index] = tl;
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="flex items-center justify-end px-10 py-8 mx-auto">
        <HamburgerMenu onToggle={handleMenuToggle} />
        <div
          ref={navRef}
          className="fixed inset-0 w-full h-screen z-40 pointer-events-none"
          style={menuOpen ? { pointerEvents: "auto" } : {}}
        >
          {/* Top half of the menu */}
          <div
            ref={topHalfRef}
            className="absolute top-0 left-0 w-full h-1/2 bg-primary"
            style={{ transform: "translateY(-100%)" }}
          ></div>

          {/* Bottom half of the menu */}
          <div
            ref={bottomHalfRef}
            className="absolute bottom-0 left-0 w-full h-1/2 bg-primary"
            style={{ transform: "translateY(100%)" }}
          ></div>

          {/* Image showcase area */}
          <div className="hidden md:block absolute top-1/3 right-24 w-[33%] aspect-video overflow-hidden">
            {menuItems.map((item, i) => (
              <div
                key={`image-${i}`}
                ref={addToImageRefs}
                className="absolute inset-0 opacity-0"
                style={{
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
          </div>

          {/* Menu content - centered in the screen */}
          <div className="absolute inset-0 flex items-center px-24">
            <ul className="list-none p-0 m-0 w-1/2">
              {menuItems.map((item, index) => (
                <li key={index} className="my-8">
                  <div className="overflow-hidden relative">
                    <a
                      ref={addToMenuItemsRef}
                      href={item.href}
                      className="text-[10vw] leading-[10vw] md:text-[7vw] md:leading-[7vw] uppercase text-white no-underline transition-colors block font-anton opacity-0"
                      onMouseEnter={(e) => handleMenuItemHover(e, index)}
                      onMouseLeave={(e) => handleMenuItemLeave(e, index)}
                    >
                      {/* Original letters */}
                      <span className="block">
                        {item.label.split("").map((letter, i) => (
                          <span
                            key={`orig-${i}`}
                            className="inline-block overflow-hidden"
                          >
                            <span
                              className="original-letter  inline-block"
                              style={{ transform: "translateY(0%)" }}
                            >
                              {letter}
                            </span>
                          </span>
                        ))}
                      </span>

                      {/* Hover effect letters (initially hidden) */}
                      <span
                        className="hover-text absolute top-0 left-0 block"
                        style={{ visibility: "hidden" }}
                      >
                        {item.label.split("").map((letter, i) => (
                          <span
                            key={`hover-${i}`}
                            className="inline-block overflow-hidden"
                          >
                            <span
                              className="hover-letter inline-block"
                              style={{
                                transform: "translateY(100%)",
                                opacity: 0,
                              }}
                            >
                              {letter}
                            </span>
                          </span>
                        ))}
                      </span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer area with copyright and social links */}
          <div className="footer-content absolute bottom-8 left-0 w-full px-24 flex flex-col-reverse gap-10 md:flex-row justify-between text-white opacity-0">
            {/* Copyright on left */}
            <div className="text-sm">
              &copy; {new Date().getFullYear()} Mursee Films. All rights
              reserved.
            </div>

            {/* Social links on right */}
            <div className="flex flex-col md:flex-row md:space-x-6">
              <a
                href="#"
                className="text-sm text-white hover:text-gray-300 transition-colors"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-sm text-white hover:text-gray-300 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
