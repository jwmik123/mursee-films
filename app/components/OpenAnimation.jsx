"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const OpenAnimation = ({ onComplete }) => {
  const murseeRef = useRef(null);
  const filmsRef = useRef(null);
  const containerRef = useRef(null);
  const whiteLayerRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Set initial states with blur
    gsap.set([murseeRef.current, filmsRef.current], {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    });

    // Animate text in with blur, then slide both layers up
    tl.to([murseeRef.current, filmsRef.current], {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1,
      delay: 0.5,
      ease: "power2.out",
      stagger: 0.15,
    })
      // Slide black container up fast with more power
      .to(containerRef.current, {
        y: "-100%",
        duration: 0.6,
        delay: 0.5,
        ease: "power3.in",
      })
      // Slide white layer up slightly slower, stacked effect
      .to(whiteLayerRef.current, {
        y: "-100%",
        duration: 0.7,
        ease: "power3.in",
        onComplete: () => {
          if (onComplete) {
            onComplete();
          }
        },
      }, "-=0.65");
  }, [onComplete]);

  return (
    <>
      {/* Black background layer with text */}
      <div ref={containerRef} className="fixed inset-0 z-50 h-screen w-full bg-black overflow-hidden">
        {/* Flex container - centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-4 font-franklin uppercase">
            {/* Mursee text */}
            <span
              ref={murseeRef}
              className="text-3xl md:text-4xl font-bold text-white opacity-0 tracking-wider whitespace-nowrap"
            >
              Mursee
            </span>

            {/* Films text */}
            <span
              ref={filmsRef}
              className="text-3xl md:text-4xl font-bold text-white opacity-0 tracking-wider whitespace-nowrap"
            >
              Films
            </span>
          </div>
        </div>
      </div>

      {/* White layer behind - slides up slightly slower */}
      <div ref={whiteLayerRef} className="fixed inset-0 z-40 h-screen w-full bg-white" />
    </>
  );
};

export default OpenAnimation;
