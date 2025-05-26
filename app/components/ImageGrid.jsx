"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

const ImageGrid = ({ images }) => {
  const titleRef = useRef(null);
  const splitTextRef = useRef(null);
  const gridRef = useRef(null);

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

    // Animate grid images with staggered translateY on scroll
    if (gridRef.current) {
      const gridItems = gridRef.current.querySelectorAll(".grid-item");

      // Set initial state for grid items
      gsap.set(gridItems, {
        y: 100,
        opacity: 0,
      });

      // Create staggered animation for grid items
      gsap.to(gridItems, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
          markers: false,
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
    <div className="px-5 md:px-10 py-24 bg-black flex items-center justify-center md:mt-[60vh]">
      <div className="w-full">
        <h2
          ref={titleRef}
          className="text-white text-6xl md:text-7xl font-franklin uppercase"
        >
          Partners
        </h2>
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-12"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="grid-item aspect-video bg-white/10 overflow-hidden relative text-center flex items-center justify-center"
            >
              {images && images[index] ? (
                <div className="w-1/2 h-auto flex items-center justify-center">
                  <Image
                    src={images[index]}
                    alt={`Grid image ${index + 1}`}
                    className="object-contain w-full h-auto"
                    style={{
                      filter: "grayscale(1) invert(1)",
                    }}
                    width={150}
                    height={90}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Image {index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGrid;
