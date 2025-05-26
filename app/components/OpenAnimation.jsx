"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

const OpenAnimation = () => {
  const murseeRef = useRef(null);
  const filmsRef = useRef(null);
  const videoRef = useRef(null);
  const bigMurseeRef = useRef(null);
  const bigFilmsRef = useRef(null);
  const bigMurseeSplitRef = useRef(null);
  const bigFilmsSplitRef = useRef(null);

  useEffect(() => {
    // Register SplitText plugin
    gsap.registerPlugin(SplitText);

    const tl = gsap.timeline();

    // Set initial states
    gsap.set([murseeRef.current, filmsRef.current], {
      opacity: 0,
      filter: "blur(10px)",
      x: 50,
    });

    // Set initial states for big text containers (make them visible)
    gsap.set([bigMurseeRef.current, bigFilmsRef.current], {
      opacity: 1, // Make containers visible
    });

    // Create SplitText instances for big text
    if (bigMurseeRef.current && !bigMurseeSplitRef.current) {
      bigMurseeSplitRef.current = new SplitText(bigMurseeRef.current, {
        type: "chars",
        charsClass: "char",
      });
    }

    if (bigFilmsRef.current && !bigFilmsSplitRef.current) {
      bigFilmsSplitRef.current = new SplitText(bigFilmsRef.current, {
        type: "chars",
        charsClass: "char",
      });
    }

    // Set initial states for big text characters
    if (bigMurseeSplitRef.current) {
      gsap.set(bigMurseeSplitRef.current.chars, {
        opacity: 0,
        y: 150,
        filter: "blur(10px)",
      });
    }

    if (bigFilmsSplitRef.current) {
      gsap.set(bigFilmsSplitRef.current.chars, {
        opacity: 0,
        y: 150,
        filter: "blur(10px)",
      });
    }

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
        width: "100%",
        height: "100vh",
        marginLeft: "0px",
        marginRight: "0px",
        duration: 1.2,
        ease: "power1.out",
      });

    // Separate timeline for big text animation with character staggering
    const bigTextTimeline = gsap.timeline({ delay: 3 }); // Start after main animation

    // Animate "mursee" characters with stagger
    if (bigMurseeSplitRef.current) {
      bigTextTimeline.to(bigMurseeSplitRef.current.chars, {
        opacity: 1,
        filter: "blur(0px)",
        y: 100,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.05, // Stagger each character by 0.05 seconds
      });
    }

    // Animate "films" characters with stagger, starting slightly before mursee ends
    if (bigFilmsSplitRef.current) {
      bigTextTimeline.to(
        bigFilmsSplitRef.current.chars,
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 100,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.05, // Stagger each character by 0.05 seconds
        },
        "-=0.3" // Start 0.3 seconds before mursee animation ends
      );
    }

    // Cleanup function
    return () => {
      if (bigMurseeSplitRef.current) {
        bigMurseeSplitRef.current.revert();
        bigMurseeSplitRef.current = null;
      }
      if (bigFilmsSplitRef.current) {
        bigFilmsSplitRef.current.revert();
        bigFilmsSplitRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative h-[80vh] md:h-screen w-full bg-black overflow-hidden mb-44">
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
            className="w-[0px] h-[200px] max-w-full box-border object-cover rounded-lg mx-5 mt-0 md:mt-5"
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

      {/* Big text for center animation */}
      <div className="absolute inset-0 flex items-center md:items-end justify-between px-8 md:pb-1 pointer-events-none">
        <span
          ref={bigMurseeRef}
          className="text-[12vw] md:text-[17vw] font-bold text-white tracking-[-0.05em] whitespace-nowrap font-franklin uppercase"
        >
          mursee
        </span>
        <span
          ref={bigFilmsRef}
          className="text-[12vw] md:text-[17vw] font-bold text-white tracking-[-0.05em] whitespace-nowrap font-franklin uppercase"
        >
          films
        </span>
      </div>
    </div>
  );
};

export default OpenAnimation;
