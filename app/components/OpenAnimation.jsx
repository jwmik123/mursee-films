"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const OpenAnimation = () => {
  const murseeRef = useRef(null);
  const filmsRef = useRef(null);
  const videoRef = useRef(null);
  const bigMurseeRef = useRef(null);
  const bigFilmsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Set initial states
    gsap.set([murseeRef.current, filmsRef.current], {
      opacity: 0,
      filter: "blur(10px)",
      x: 50,
    });

    // Set initial states for big text
    gsap.set([bigMurseeRef.current, bigFilmsRef.current], {
      opacity: 0,
      y: 100,
      filter: "blur(10px)",
    });

    // Animate spans first - blur and translate x from 5 to 0
    tl.to([murseeRef.current, filmsRef.current], {
      filter: "blur(0px)",
      x: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
      stagger: 0.2,
    })
      // Then animate video width to 300px
      .to(videoRef.current, {
        width: "300px",
        duration: 0.8,
        ease: "power2.out",
      })
      // Hide original text spans first
      .to([murseeRef.current, filmsRef.current], {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      })
      .to([murseeRef.current, filmsRef.current], {
        width: "0px",
        duration: 0.1,
        ease: "power2.inOut",
      })
      // Then make video full viewport
      .to(videoRef.current, {
        width: "100vw",
        height: "100vh",
        duration: 1.2,
        ease: "power1.out",
      });

    // Separate timeline for big text animation
    const bigTextTimeline = gsap.timeline({ delay: 3 }); // Start after main animation
    bigTextTimeline
      .to(bigMurseeRef.current, {
        opacity: 1,
        filter: "blur(0px)",
        y: 40,
        duration: 1,
        ease: "power2.out",
      })
      .to(
        bigFilmsRef.current,
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 40,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5"
      ); // Start 0.5 seconds before mursee animation ends
  }, []);

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden mb-24">
      {/* Flex container - centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center font-franklin uppercase">
          {/* Mursee text */}
          <span
            ref={murseeRef}
            className="hidden md:block text-5xl font-bold text-white opacity-0 tracking-wider whitespace-nowrap"
          >
            mursee
          </span>

          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-[0px] h-[200px] object-cover rounded-lg mx-5 mt-5"
            muted
            loop
            playsInline
            autoPlay
          >
            <source src="/header.webm" type="video/webm" />
            <source src="/header.mp4" type="video/mp4" />
          </video>

          {/* Films text */}
          <span
            ref={filmsRef}
            className="hidden md:block text-5xl font-bold text-white opacity-0 tracking-wider whitespace-nowrap"
          >
            films
          </span>
        </div>
      </div>

      {/* Big text for bottom animation */}
      <span
        ref={bigMurseeRef}
        className="absolute bottom-1 left-8 text-[17vw] font-bold text-white opacity-0 tracking-[-0.05em] whitespace-nowrap font-franklin uppercase"
      >
        mursee
      </span>
      <span
        ref={bigFilmsRef}
        className="absolute bottom-1 right-8 text-[17vw] font-bold text-white opacity-0 tracking-[-0.05em] whitespace-nowrap font-franklin uppercase"
      >
        films
      </span>
    </div>
  );
};

export default OpenAnimation;
