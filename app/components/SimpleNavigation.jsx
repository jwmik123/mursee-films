"use client";
import Link from "next/link";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import ContactDialog from "./ContactDialog";

const SimpleNavigation = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const topBarRef = useRef(null);
  const mobileContentRef = useRef(null);
  const logoRef = useRef(null);
  const mRef = useRef(null);
  const fRef = useRef(null);
  const urseeRef = useRef(null);
  const filmsRef = useRef(null);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Navigation links
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Projecten", href: "/projects" },
    { label: "Studio", href: "/about" },
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
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking on a link
  const handleMobileLinkClick = () => {
    closeMobileMenu();
  };

  // Logo hover animation
  const handleLogoHover = () => {
    // Temporarily set width to auto to get the natural width
    gsap.set(urseeRef.current, { width: "auto" });
    gsap.set(filmsRef.current, { width: "auto" });

    // Get the natural width of the text elements
    const urseeWidth = urseeRef.current.offsetWidth;
    const filmsWidth = filmsRef.current.offsetWidth;

    // Reset to 0 for animation
    gsap.set(urseeRef.current, { width: 0 });
    gsap.set(filmsRef.current, { width: 0 });

    // Animate "ursee" appearing by expanding its width
    gsap.fromTo(
      urseeRef.current,
      {
        width: 0,
        opacity: 0,
        scale: 0.8,
      },
      {
        width: urseeWidth,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      }
    );

    // Animate "Films" appearing by expanding its width
    gsap.fromTo(
      filmsRef.current,
      {
        width: 0,
        opacity: 0,
        scale: 0.8,
      },
      {
        width: filmsWidth,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
        delay: 0.1,
      }
    );
  };

  const handleLogoLeave = () => {
    // Animate "ursee" disappearing by collapsing its width
    gsap.to(urseeRef.current, {
      width: 0,
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.out",
    });

    // Animate "Films" disappearing by collapsing its width
    gsap.to(filmsRef.current, {
      width: 0,
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.out",
    });
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
        delay: 1.5, // Wait for OpenAnimation to complete
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

  // Animate the height of the nav so the header expands/collapses
  useLayoutEffect(() => {
    const navEl = navRef.current;
    const barEl = topBarRef.current;
    const contentEl = mobileContentRef.current;
    if (!navEl || !barEl || !contentEl) return;

    // Ensure overflow hidden during animation
    gsap.set(navEl, { overflow: "hidden" });

    if (isMobileMenuOpen) {
      // Opening: from collapsed (top bar height) to full (scrollHeight)
      const from = barEl.offsetHeight;
      // Make content participate in layout for accurate measurement
      contentEl.style.display = "block";
      // Temporarily set height to 'auto' to get total height including content
      gsap.set(navEl, { height: "auto" });
      const to = navEl.scrollHeight;
      gsap.set(navEl, { height: from });
      gsap.to(navEl, {
        height: to,
        duration: 0.35,
        ease: "power2.out",
        onComplete: () => {
          navEl.style.height = ""; // back to auto
          navEl.style.overflow = "";
        },
      });
    } else {
      // Closing: from current to top bar height
      const to = barEl.offsetHeight;
      const from = navEl.offsetHeight;
      gsap.set(navEl, { height: from });
      gsap.to(navEl, {
        height: to,
        duration: 0.28,
        ease: "power2.in",
        onComplete: () => {
          navEl.style.height = ""; // let content flow normally
          navEl.style.overflow = "";
          contentEl.style.display = "none";
        },
      });
    }
  }, [isMobileMenuOpen]);

  // Ensure collapsed height on first render when closed
  useLayoutEffect(() => {
    if (!navRef.current || !topBarRef.current) return;
    if (!isMobileMenuOpen) {
      navRef.current.style.height = `${topBarRef.current.offsetHeight}px`;
      // Allow a microtask to pass, then clear to auto so layout isn't stuck
      requestAnimationFrame(() => {
        if (navRef.current) navRef.current.style.height = "";
      });
    }
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 flex justify-center px-4 md:px-10 ${
          mounted && !animationStarted && pathname === "/"
            ? "hidden-initially"
            : ""
        }`}
      >
        <nav
          ref={navRef}
          className="flex flex-col md:flex-row items-center justify-between px-10 opacity-0 py-2 mx-auto max-w-7xl w-full mt-4 rounded-md backdrop-blur-md bg-black/30 border border-white/10"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between w-full" ref={topBarRef}>
          {/* Left section */}
          <div className="w-32">
            <Link href="/">
              <div
                ref={logoRef}
                className="font-franklin text-white text-2xl cursor-pointer flex items-center"
                onMouseEnter={handleLogoHover}
                onMouseLeave={handleLogoLeave}
              >
                <span ref={mRef}>M</span>
                <span
                  ref={urseeRef}
                  className="opacity-0 whitespace-nowrap"
                  style={{ width: 0, display: "inline-block" }}
                >
                  URSEE&nbsp;
                </span>
                <span ref={fRef}>F</span>
                <span
                  ref={filmsRef}
                  className="opacity-0 whitespace-nowrap"
                  style={{ width: 0, display: "inline-block" }}
                >
                  ILMS
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex justify-center">
            <ul className="flex space-x-8">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-white hover:text-gray-300 transition-colors"
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
              className="relative px-4 py-2 text-white text-sm uppercase font-franklin overflow-hidden group border border-white rounded-md"
            >
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                Start een project
              </span>
              <div className="absolute inset-0 bg-white transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out"></div>
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
                className={`block w-6 h-[1px] bg-white transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen
                    ? "translate-y-[1px]"
                    : "-translate-y-1"
                }`}
              ></span>
              <span
                className={`block w-6 h-[1px] bg-white transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen
                    ? "-translate-y-[1px]"
                    : "translate-y-1"
                }`}
              ></span>
            </button>
          </div>

          </div>

          {/* Mobile content inside same nav */}
          <div
            ref={mobileContentRef}
            className="md:hidden w-full"
            style={{ display: "none" }}
            aria-hidden={!isMobileMenuOpen}
          >
            <div className="pt-4">
              <ul className="space-y-6 text-center">
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
        </nav>
      </header>

      <ContactDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </>
  );
};

export default SimpleNavigation;
