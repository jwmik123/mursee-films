"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Showreel from "./components/Showreel";
import ProjectsSection from "./components/ProjectsSection";
import { usePathname } from "next/navigation";

const projects = [
  {
    id: "1",
    title: "Project One",
    imageUrl: "/images/groeten.jpg",
  },
  {
    id: "2",
    title: "Project Two",
    imageUrl: "/images/province.jpg",
  },
  {
    id: "3",
    title: "Project Three",
    imageUrl: "/images/race.jpg",
  },
  {
    id: "4",
    title: "Project Four",
    imageUrl: "/images/triple.jpg",
  },

  // ... more projects
];

export default function Home() {
  const tlRef = useRef(null);
  const aboutTextRef = useRef(null);
  const aboutTextCharsRef = useRef([]);
  const animationCompletedRef = useRef(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const pathname = usePathname();

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

    // Reset animation states
    gsap.set(".cover-title", { y: -100, opacity: 0 });
    gsap.set(".hero-section", { autoAlpha: 1 });
    gsap.set(".header-title-char", { y: 100, autoAlpha: 0 });
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
      // .fromTo(
      //   ".hero-section",
      //   {
      //     padding: 16,
      //   },
      //   {
      //     padding: 16,
      //     duration: 1.2,
      //     ease: "power4.out",
      //   }
      // )
      .fromTo(
        ".header-title-char",
        {
          y: 100,
          autoAlpha: 0,
        },
        {
          y: -100,
          autoAlpha: 1,
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
    const handlePopState = () => {
      if (window.location.pathname === "/") {
        // Reset animation state
        animationCompletedRef.current = false;

        // Small timeout to ensure DOM is ready
        setTimeout(() => {
          runAnimation();
        }, 50);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && pathname === "/") {
        if (!animationCompletedRef.current) {
          runAnimation();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Split the about text into words instead of characters
    if (aboutTextRef.current) {
      const aboutContent = aboutTextRef.current.textContent;
      aboutTextRef.current.textContent = "";

      // Split by words, keeping spaces with the next word
      const words = aboutContent.split(" ");

      aboutTextCharsRef.current = words.map((word, index) => {
        const span = document.createElement("span");
        span.textContent = word;
        span.className = "about-text-word inline-block";
        span.style.transform = "translateY(50px)";
        span.style.opacity = "0.3"; // Start slightly visible
        span.style.filter = "blur(8px)"; // Add blur effect
        span.style.marginRight = "0.3em"; // Space between words
        aboutTextRef.current.appendChild(span);
        return span;
      });

      // Create staggered animation on scroll
      gsap.to(".about-text-word", {
        y: 0,
        opacity: 1,
        filter: "blur(0px)", // Remove blur on scroll
        stagger: 0.03, // Slightly slower stagger for words
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: {
          trigger: aboutTextRef.current,
          start: "top 90%", // Start earlier
          end: "top -10%", // End much later (after the text has passed the top of viewport)
          scrub: 0.8, // Smoother scrubbing with more delay
          markers: false, // Set to true for debugging
        },
      });
    }
  }, []);

  const parallaxOffset = scrollPosition * 0.3;

  const headerTitle = "MURSEE FILMS".split("").map((char, i) => (
    <span key={i} className="header-title-char inline-block md:mr-2">
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  return (
    <main>
      <nav className="z-20 absolute w-full p-10 flex flex-row justify-between items-center transition-opacity duration-500">
        <div className="flex">
          <h1 className="font-franklin text-white text-4xl">MF</h1>
        </div>
      </nav>

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
          <div className="z-10 flex relative items-center md:items-end justify-center min-h-screen w-full text-white mt-[13vw] flex-row">
            <h1 className="header-title z-[2000] font-franklin mix-blend-difference text-[14vw] lg:text-[17vw] tracking-tighter">
              {headerTitle}
            </h1>
          </div>
        </div>
      </section>

      <section className={`px-5 md:px-10 transition-opacity duration-500`}>
        <div className="w-full h-full bg-black">
          <div className="flex flex-col md:flex-row w-full justify-between gap-6 text-white pb-24">
            <p
              ref={aboutTextRef}
              className="md:max-w-4xl w-full text-6xl leading-tighter tracking-tight font-franklin uppercase"
            >
              Wij zijn een creatieve studio met een zwak voor film. Of het nu
              gaat om een knallende commercial, een pakkend verhaal of iets
              compleet buiten de lijntjes – wij maken het.
            </p>
            <div className="max-w-lg flex flex-col gap-4 self-end text-lg">
              <Showreel />
            </div>
          </div>
        </div>
      </section>

      <section
        className={`w-full px-5 md:px-10 bg-black pt-16 pb-24 transition-opacity duration-500`}
      ></section>

      <section className=" w-full px-5 md:px-10 bg-black pt-16 pb-24">
        <ProjectsSection projects={projects} />
      </section>

      <section className="w-full px-5 md:px-10 bg-black pt-16 pb-24">
        <h1 className="text-white text-7xl font-franklin uppercase">
          Onze aanpak
        </h1>
        <div className="flex flex-row gap-6 border-t border-white pt-4 pb-16 mt-16">
          <p className="text-white text-xl w-1/2">Pre production</p>
          <p className="text-white text-xl w-1/2">
            We don't do volume. We partner with only five clients a year,
            focusing our expertise on their success. Every detail is crafted,
            every decision strategic, and every outcome transformative. We build
            brands that set new benchmarks.
          </p>
        </div>
        <div className="flex flex-row gap-6 border-t border-white pt-4 pb-16">
          <p className="text-white text-xl w-1/2">Production</p>
          <p className="text-white text-xl w-1/2">
            We don't do volume. We partner with only five clients a year,
            focusing our expertise on their success. Every detail is crafted,
            every decision strategic, and every outcome transformative. We build
            brands that set new benchmarks.
          </p>
        </div>
        <div className="flex flex-row gap-6 border-t border-white pt-4">
          <p className="text-white text-xl w-1/2">Post production</p>
          <p className="text-white text-xl w-1/2">
            We don't do volume. We partner with only five clients a year,
            focusing our expertise on their success. Every detail is crafted,
            every decision strategic, and every outcome transformative. We build
            brands that set new benchmarks.
          </p>
        </div>
      </section>

      <section
        className={`w-full bg-black h-[300vh] transition-opacity duration-500`}
      ></section>
    </main>
  );
}
