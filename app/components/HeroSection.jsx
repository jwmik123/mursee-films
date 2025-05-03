"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

const HeroSection = () => {
  const headerTitleRef = useRef(null);
  const headerSplitRef = useRef(null);
  const animationCompletedRef = useRef(false);
  const tlRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Register GSAP plugins once
  useEffect(() => {
    // Register ScrollTrigger and SplitText plugins globally
    gsap.registerPlugin(ScrollTrigger, SplitText);

    return () => {
      // Clean up any split text instances
      if (headerSplitRef.current) {
        headerSplitRef.current.revert();
      }
    };
  }, []);

  const runAnimation = () => {
    if (tlRef.current) {
      tlRef.current.kill();
    }

    tlRef.current = gsap.timeline();

    // Make sure elements are visible
    gsap.set(".cover", {
      y: "0%",
      display: "flex",
      autoAlpha: 1,
    });

    // Register SplitText for header if needed
    if (headerTitleRef.current && !headerSplitRef.current) {
      // Add CSS style for header characters
      const headerStyle = document.createElement("style");
      headerStyle.textContent = `
        .header-title-char {
          display: inline-block;
          margin-right: 0.05em;
        }
        @media (min-width: 768px) {
          .header-title-char {
            margin-right: 0.1em;
          }
        }
      `;
      document.head.appendChild(headerStyle);

      headerSplitRef.current = new SplitText(headerTitleRef.current, {
        type: "chars",
        charsClass: "header-title-char",
      });
    }

    // Reset animation states
    gsap.set(".cover-title", { y: -100, opacity: 0 });
    gsap.set(".hero-section", { autoAlpha: 1 });

    // Set initial state for header characters if we have the split text
    if (headerSplitRef.current) {
      gsap.set(headerSplitRef.current.chars, { y: 100, autoAlpha: 0 });
    } else {
      gsap.set(".header-title-char", { y: 100, autoAlpha: 0 });
    }

    gsap.set("nav", { y: -100, opacity: 0 });

    const videoParent = document.querySelector(".video").parentElement;

    videoParent.style.transform = "none";

    tlRef.current
      .fromTo(
        ".cover-title",
        {
          y: -100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
        }
      )
      .fromTo(
        ".cover",
        {
          y: "0%",
        },
        {
          y: "-100%",
          duration: 1,
          ease: "power4.out",
        },
        "+=0.5"
      )
      .fromTo(
        ".ticks",
        {
          opacity: 1,
        },
        {
          opacity: 0,
          duration: 1,
          ease: "power4.out",
        }
      )
      .fromTo(
        ".video",
        {
          width: "50%",
          height: "30%",
          y: "-33.33%",
        },
        {
          width: "100%",
          height: "100%",
          y: "0%",
          duration: 1.5,
          ease: "power2.out",
        }
      )
      .fromTo(
        headerSplitRef.current
          ? headerSplitRef.current.chars
          : ".header-title-char",
        {
          y: 100,
          autoAlpha: 0,
          opacity: 0,
        },
        {
          y: -100,
          autoAlpha: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.05,
        },
        "-=0.5"
      )
      .fromTo(
        "nav",
        {
          y: -100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
        },
        "-=0.5"
      )
      .call(() => {
        animationCompletedRef.current = true;
      });
  };

  useEffect(() => {
    const handleScroll = () => {
      // Only apply parallax if animation is complete
      if (animationCompletedRef.current) {
        const position = window.scrollY;
        setScrollPosition(position);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    runAnimation();

    // Reset the animation flag when component unmounts
    return () => {
      animationCompletedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        window.location.pathname === "/"
      ) {
        if (!animationCompletedRef.current) {
          runAnimation();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const parallaxOffset = scrollPosition * 0.3;

  return (
    <section
      className={`hero-section w-full p-4 transition-opacity duration-500`}
    >
      <div className="overflow-hidden w-full relative rounded-lg md:min-h-[120vh] object-cover block">
        <div
          className="z-10 w-full h-full absolute inset-0 flex justify-center items-center"
          style={{
            transform: `translate3d(0, -${parallaxOffset}px, 0)`,
          }}
        >
          <video
            autoPlay
            muted
            loop
            className="object-cover video -z-10 absolute bg-cover opacity-80"
          >
            <source src="/header.mp4" type="video/mp4" />
          </video>
          <div className="w-1/2 translate-y-[100px] ticks">
            <div className="flex flex-col">
              {/* Tick marks row */}
              <div className="flex items-end pt-2 px-1 pb-6 relative">
                {Array.from({ length: 41 }).map((_, index) => {
                  const isMajorTick = index % 5 === 0;
                  return (
                    <div
                      key={index}
                      className="flex-1 flex justify-center relative"
                    >
                      <div
                        className={`${
                          isMajorTick ? "h-5" : "h-3"
                        } w-px bg-white`}
                      />
                    </div>
                  );
                })}

                {/* Numbers overlay */}
                <div className="absolute bottom-1 left-0 right-0 flex justify-between px-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="text-white font-mono text-sm flex-1 text-center"
                    >
                      {(i + 1).toString().padStart(2, "0")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="z-10 flex relative items-center md:items-end justify-center min-h-screen w-full text-white mt-[13vw] flex-row ">
          <h1
            ref={headerTitleRef}
            className="header-title z-[2000] font-franklin mix-blend-difference text-[14vw] lg:text-[17vw] lg:ml-2 -tracking-[0.1em] whitespace-nowrap w-full max-w-full text-center"
          >
            MURSEE FILMS
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
