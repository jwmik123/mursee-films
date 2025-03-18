"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import HamburgerMenu from "./HamburgerMenu";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const menuItemsRef = useRef([]);

  // Reset menuItemsRef when number of items change
  menuItemsRef.current = [];

  // Add to refs array for menu items
  const addToMenuItemsRef = (el) => {
    if (el && !menuItemsRef.current.includes(el)) {
      menuItemsRef.current.push(el);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      // Animate the nav in from off-screen
      gsap.to(navRef.current, {
        duration: 0.5,
        y: "0",
        ease: "power3.in",
        onComplete: () => {
          // After main navigation is visible, animate menu items
          gsap.fromTo(
            menuItemsRef.current,
            {
              y: 50,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              stagger: 0.1, // Stagger the animations
              duration: 0.4,
              ease: "power2.out",
            }
          );
        },
      });
    } else {
      // Reset menu items first (optional)
      gsap.to(menuItemsRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
      });

      // Animate the nav out to off-screen
      gsap.to(navRef.current, {
        duration: 0.5,
        y: "-100%",
        ease: "power3.in",
      });
    }
  }, [menuOpen]);

  const handleMenuToggle = (isOpen) => {
    setMenuOpen(isOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="flex items-center justify-end px-10 py-8 mx-auto">
        <HamburgerMenu onToggle={handleMenuToggle} />
        <div
          ref={navRef}
          className="fixed top-0 right-0 w-full h-screen bg-foreground flex items-start justify-start pt-32 pl-16 z-40"
          style={{ transform: "translateY(-100%)" }} // initial off-screen state
        >
          <ul className="list-none p-0 m-0 text-left">
            {[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Contact", href: "/contact" },
            ].map((item, index) => (
              <li key={index} className="my-8">
                <div className="overflow-hidden">
                  <a
                    ref={addToMenuItemsRef}
                    href={item.href}
                    className="text-[12vh] leading-[12vh] uppercase text-white no-underline transition-colors block font-anton"
                  >
                    {item.label}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
