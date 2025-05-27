"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import ContactDialog from "./ContactDialog";

const SimpleNavigation = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Navigation links
  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "PROJECTEN", href: "/projects" },
    { label: "OVER ONS", href: "/about" },
  ];

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleContactClick = (e) => {
    e.preventDefault();
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking on a link
  const handleMobileLinkClick = () => {
    closeMobileMenu();
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
    if (!mounted) return;

    // Only run animation on home page
    if (pathname === "/") {
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
  }, [pathname, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && pathname === "/") {
        runNavAnimation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname, mounted]);

  // Animate mobile menu
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        gsap.fromTo(
          mobileMenuRef.current,
          { y: "-100%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      } else {
        gsap.to(mobileMenuRef.current, {
          y: "-100%",
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 ${
          mounted && !animationStarted && pathname === "/"
            ? "hidden-initially"
            : ""
        }`}
      >
        <nav
          ref={navRef}
          className="flex items-center justify-between px-10 opacity-0 py-6 mx-auto"
        >
          {/* Left section */}
          <div className="w-32">
            <Link href="/">
              <h1 className="font-franklin text-white text-4xl">MF</h1>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex justify-center">
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

          {/* Desktop CTA button - Hidden on mobile */}
          <div className="hidden md:flex justify-end">
            <button
              onClick={handleContactClick}
              className="px-4 py-2 bg-white text-black text-sm uppercase font-franklin hover:bg-gray-200 transition-colors"
            >
              Start een project
            </button>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="relative w-8 h-6 flex flex-col justify-center items-center focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {/* Hamburger lines that animate to cross */}
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen
                    ? "rotate-45 translate-y-0.5"
                    : "-translate-y-1"
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen
                    ? "-rotate-45 -translate-y-0.5"
                    : "translate-y-1"
                }`}
              ></span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 w-full h-1/2 bg-black z-40 md:hidden transform -translate-y-full opacity-0 m-[5px] rounded-lg border border-gray-800`}
        style={{ height: "calc(50vh - 10px)" }}
      >
        <div className="flex flex-col h-full p-6 pt-20">
          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center">
            <ul className="space-y-8 text-center">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    onClick={handleMobileLinkClick}
                    className="text-2xl uppercase text-white hover:text-gray-300 transition-colors font-franklin block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile CTA Button */}
          <div className="mt-8 text-center">
            <button
              onClick={(e) => {
                handleContactClick(e);
                closeMobileMenu();
              }}
              className="px-6 py-3 bg-white text-black text-sm uppercase font-franklin hover:bg-gray-200 transition-colors rounded"
            >
              Start een project
            </button>
          </div>
        </div>
      </div>

      <ContactDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </>
  );
};

export default SimpleNavigation;
