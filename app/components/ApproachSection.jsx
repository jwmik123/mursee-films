"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

const ApproachSection = () => {
  const titleRef = useRef(null);
  const splitTextRef = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Use SplitText to split the title text into words
    if (titleRef.current && !splitTextRef.current) {
      // Add CSS style for title-text-word class
      const style = document.createElement("style");
      style.textContent = `
        .title-text-word {
          display: inline-block;
          margin-right: 0.1em;
        }
        .border-section {
          position: relative;
          --border-width: 0%;
        }
        .border-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 1px;
          width: var(--border-width);
          background-color: white;
          transform-origin: left;
        }
      `;
      document.head.appendChild(style);

      splitTextRef.current = new SplitText(titleRef.current, {
        type: "words",
        wordsClass: "title-text-word",
      });

      // Set initial styles
      gsap.set(splitTextRef.current.words, {
        y: 50,
        opacity: 0,
        filter: "blur(8px)",
      });

      // Create staggered animation on scroll
      gsap.to(splitTextRef.current.words, {
        y: 0,
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

      // Animate borders
      [section1Ref, section2Ref, section3Ref].forEach((ref) => {
        if (ref.current) {
          gsap.fromTo(
            ref.current,
            { "--border-width": "0%" },
            {
              "--border-width": "100%",
              duration: 3,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ref.current,
                start: "top 75%",
                end: "top 65%",
                scrub: 3,
                markers: false,
              },
            }
          );
        }
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
    <section className="w-full px-5 md:px-10 bg-black pt-16 pb-24 font-tinos">
      <h2
        ref={titleRef}
        className="text-white text-7xl font-franklin uppercase"
      >
        Onze aanpak
      </h2>
      <div
        ref={section1Ref}
        className="border-section flex flex-row gap-6 pt-4 pb-16 mt-16"
      >
        <p className="text-white text-xl w-1/2">Pre production</p>
        <p className="text-white text-xl w-1/2">
          We don't do volume. We partner with only five clients a year, focusing
          our expertise on their success. Every detail is crafted, every
          decision strategic, and every outcome transformative. We build brands
          that set new benchmarks.
        </p>
      </div>
      <div
        ref={section2Ref}
        className="border-section flex flex-row gap-6 pt-4 pb-16"
      >
        <p className="text-white text-xl w-1/2">Production</p>
        <p className="text-white text-xl w-1/2">
          We don't do volume. We partner with only five clients a year, focusing
          our expertise on their success. Every detail is crafted, every
          decision strategic, and every outcome transformative. We build brands
          that set new benchmarks.
        </p>
      </div>
      <div
        ref={section3Ref}
        className="border-section flex flex-row gap-6 pt-4"
      >
        <p className="text-white text-xl w-1/2">Post production</p>
        <p className="text-white text-xl w-1/2">
          We don't do volume. We partner with only five clients a year, focusing
          our expertise on their success. Every detail is crafted, every
          decision strategic, and every outcome transformative. We build brands
          that set new benchmarks.
        </p>
      </div>
    </section>
  );
};

export default ApproachSection;
