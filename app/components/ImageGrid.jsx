"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

const ImageGrid = () => {
  const titleRef = useRef(null);
  const splitTextRef = useRef(null);
  const logoWallRef = useRef(null);

  const logos = [
    "/images/logos/ahold.png",
    "/images/logos/enza.png",
    "/images/logos/heineken.png",
    "/images/logos/hetpark.png",
    "/images/logos/nh.webp",
    "/images/logos/provincie-nh.png",
    "/images/logos/rechtspraak.png",
    "/images/logos/schouten.png",
    "/images/logos/siemens.png",
    "/images/logos/staan.png",
    "/images/logos/talpa.png",
    "/images/logos/tennet.png",
    "/images/logos/tracking.png",
    "/images/logos/vattenfal.png",
  ];

  useGSAP(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Use SplitText to split the title text into words
    if (titleRef.current && !splitTextRef.current) {
      // Add CSS style for title-text-word class
      const style = document.createElement("style");
      style.textContent = `
        .title-text-word {
          display: inline-block;
          margin-right: 0.3em;
        }
      `;
      document.head.appendChild(style);

      splitTextRef.current = new SplitText(titleRef.current, {
        type: "chars",
        wordsClass: "title-text-word",
      });

      // Set initial styles
      gsap.set(splitTextRef.current.chars, {
        x: 5,
        opacity: 0,
        filter: "blur(8px)",
      });

      // Create staggered animation on scroll
      gsap.to(splitTextRef.current.chars, {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.03,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 90%",
          end: "top -10%",
          scrub: 0.8,
          markers: false,
        },
      });
    }

    // Logo wall cycle animation
    if (logoWallRef.current) {
      const loopDelay = 1.5;
      const duration = 0.9;

      const root = logoWallRef.current;
      const list = root.querySelector("[data-logo-wall-list]");
      const items = Array.from(
        list.querySelectorAll("[data-logo-wall-item]")
      );

      const shuffleFront =
        root.getAttribute("data-logo-wall-shuffle") !== "false";

      // Get original targets from the hidden pool
      const poolContainer = root.querySelector(".logo-pool");
      const originalTargets = poolContainer
        ? Array.from(poolContainer.querySelectorAll("[data-logo-wall-target]"))
        : [];

      // Exit if no targets found
      if (originalTargets.length === 0) {
        console.warn("No logo targets found in pool");
        return;
      }

      let visibleItems = [];
      let visibleCount = 0;
      let pool = [];
      let pattern = [];
      let patternIndex = 0;
      let tl;

      function isVisible(el) {
        return window.getComputedStyle(el).display !== "none";
      }

      function shuffleArray(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }

      function setup() {
        if (tl) {
          tl.kill();
        }
        visibleItems = items.filter(isVisible);
        visibleCount = visibleItems.length;

        pattern = shuffleArray(
          Array.from({ length: visibleCount }, (_, i) => i)
        );
        patternIndex = 0;

        // remove all injected targets
        items.forEach((item) => {
          item
            .querySelectorAll("[data-logo-wall-target]")
            .forEach((old) => old.remove());
        });

        pool = originalTargets.map((n) => n.cloneNode(true));

        let front, rest;
        if (shuffleFront) {
          const shuffledAll = shuffleArray(pool);
          front = shuffledAll.slice(0, visibleCount);
          rest = shuffleArray(shuffledAll.slice(visibleCount));
        } else {
          front = pool.slice(0, visibleCount);
          rest = shuffleArray(pool.slice(visibleCount));
        }
        pool = front.concat(rest);

        for (let i = 0; i < visibleCount; i++) {
          const parent =
            visibleItems[i].querySelector("[data-logo-wall-target-parent]") ||
            visibleItems[i];
          parent.appendChild(pool.shift());
        }

        tl = gsap.timeline({ repeat: -1, repeatDelay: loopDelay });
        tl.call(swapNext);
        tl.play();
      }

      function swapNext() {
        const nowCount = items.filter(isVisible).length;
        if (nowCount !== visibleCount) {
          setup();
          return;
        }
        if (!pool.length) return;

        const idx = pattern[patternIndex % visibleCount];
        patternIndex++;

        const container = visibleItems[idx];
        const parent =
          container.querySelector("[data-logo-wall-target-parent]") ||
          container.querySelector("*:has(> [data-logo-wall-target])") ||
          container;
        const existing = parent.querySelectorAll("[data-logo-wall-target]");
        if (existing.length > 1) return;

        const current = parent.querySelector("[data-logo-wall-target]");
        const incoming = pool.shift();

        gsap.set(incoming, { yPercent: 50, autoAlpha: 0 });
        parent.appendChild(incoming);

        if (current) {
          gsap.to(current, {
            yPercent: -50,
            autoAlpha: 0,
            duration,
            ease: "expo.inOut",
            onComplete: () => {
              current.remove();
              pool.push(current);
            },
          });
        }

        gsap.to(incoming, {
          yPercent: 0,
          autoAlpha: 1,
          duration,
          delay: 0.1,
          ease: "expo.inOut",
        });
      }

      setup();

      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => tl.play(),
        onLeave: () => tl.pause(),
        onEnterBack: () => tl.play(),
        onLeaveBack: () => tl.pause(),
      });

      const handleVisibilityChange = () =>
        document.hidden ? tl.pause() : tl.play();
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        if (tl) tl.kill();
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }

    return () => {
      // Clean up any split text instances
      if (splitTextRef.current) {
        splitTextRef.current.revert();
      }
    };
  }, []);

  return (
    <div className="px-5 md:px-10 py-24 bg-black flex items-center justify-center md:mt-[60vh]">
      <div className="w-full">
        <h2
          ref={titleRef}
          className="text-white text-6xl md:text-7xl font-franklin uppercase text-center"
        >
          Partners die ons vertrouwen
        </h2>

        <div
          ref={logoWallRef}
          data-logo-wall-cycle-init
          data-logo-wall-shuffle="true"
          className="pt-12"
        >
          {/* Hidden logo pool */}
          <div className="logo-pool hidden">
            {logos.map((logo, index) => (
              <div key={index} data-logo-wall-target className="absolute inset-0 flex items-center justify-center p-4">
                <Image
                  src={logo}
                  alt={`Partner logo ${index + 1}`}
                  className="object-contain max-w-full max-h-full"
                  style={{
                    filter: "grayscale(1) invert(1)",
                  }}
                  width={150}
                  height={90}
                />
              </div>
            ))}
          </div>

          {/* Visible grid: 3x2 on mobile, 4x2 on desktop */}
          <div
            data-logo-wall-list
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {/* Mobile: 6 items (3x2), Desktop: 8 items (4x2) */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                data-logo-wall-item
                className={`aspect-video bg-white/10 overflow-hidden relative ${
                  index >= 6 ? "hidden md:flex" : "flex"
                } items-center justify-center`}
              >
                <div
                  data-logo-wall-target-parent
                  className="absolute inset-0 flex items-center justify-center"
                >
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGrid;
