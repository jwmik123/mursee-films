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
        y: 50,
        opacity: 0,
        filter: "blur(8px)",
      });

      // Create staggered animation on scroll
      gsap.to(splitTextRef.current.chars, {
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
    }

    return () => {
      // Clean up any split text instances
      if (splitTextRef.current) {
        splitTextRef.current.revert();
      }
    };
  }, []);
  return (
    <div className="px-5 md:px-10 py-24 bg-black flex items-center justify-center">
      <div className="w-full">
        <h2
          ref={titleRef}
          className="text-white text-6xl md:text-7xl font-franklin uppercase"
        >
          Partners
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-12">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="aspect-video bg-white/10 overflow-hidden relative text-center flex items-center justify-center"
            >
              {images && images[index] ? (
                <div className="w-1/2 h-auto flex items-center justify-center">
                  <Image
                    src={images[index]}
                    alt={`Grid image ${index + 1}`}
                    className="object-contain w-full h-auto brightness-0 invert"
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
