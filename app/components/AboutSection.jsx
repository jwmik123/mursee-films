"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useMediaQuery } from "react-responsive";
import Showreel from "./Showreel";

const AboutSection = () => {
  const aboutTextRef = useRef(null);
  const splitTextRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Use SplitText to split the about text into words
    if (aboutTextRef.current && !splitTextRef.current) {
      // Add CSS style for about-text-word class
      const style = document.createElement("style");
      style.textContent = `
        .about-text-word {
          display: inline-block;
          margin-right: 0.1em;
        }
      `;
      document.head.appendChild(style);

      splitTextRef.current = new SplitText(aboutTextRef.current, {
        type: "words",
        wordsClass: "about-text-word",
      });

      // Set initial styles
      gsap.set(splitTextRef.current.words, {
        x: 5,
        opacity: 0,
        filter: "blur(5px)",
      });

      // Create staggered animation on scroll
      gsap.to(splitTextRef.current.words, {
        x: 0,
        opacity: 1,
        filter: "blur(0px)", // Remove blur on scroll
        stagger: 0.03, // Slightly slower stagger for words
        duration: 0.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: aboutTextRef.current,
          start: isMobile ? "top 100%" : "top 90%", // Start earlier
          end: isMobile ? "top 10%" : "top -10%", // End much later (after the text has passed the top of viewport)
          scrub: 0.5, // Smoother scrubbing with more delay
          markers: false, // Set to true for debugging
        },
      });
    }

    return () => {
      // Clean up any split text instances
      if (splitTextRef.current) {
        splitTextRef.current.revert();
      }
    };
  }, []);

  return (
    <section
      className={`px-5 md:px-10 md:min-h-[50vh] flex items-center transition-opacity duration-500`}
    >
      <div className="w-full bg-black">
        <div className="flex flex-col md:flex-row w-full justify-between gap-6 text-white pb-24">
          <p
            ref={aboutTextRef}
            className="w-full lg:w-1/2 text-4xl md:text-6xl leading-tighter tracking-tight font-franklin"
          >
            Wij zijn een creatieve studio met een zwak voor film. Of het nu gaat
            om een knallende commercial, een pakkend verhaal of iets compleet
            buiten de lijntjes – wij maken het.
          </p>
          <div className="max-w-lg flex flex-col gap-4 self-end text-lg">
            <Showreel />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
