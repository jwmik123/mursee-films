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
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
        className={`fixed top-0 left-0 w-full z-50 flex justify-center ${
          mounted && !animationStarted && pathname === "/"
            ? "hidden-initially"
            : ""
        }`}
      >
        <nav
          ref={navRef}
          className="flex items-center justify-between px-10 opacity-0 py-2 mx-auto max-w-5xl w-full mt-4 rounded-md backdrop-blur-md bg-black/30 border border-white/10"
        >
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
