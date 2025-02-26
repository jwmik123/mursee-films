"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { MoveUpRight, Menu } from "lucide-react";
import Showreel from "./components/Showreel";
import ProjectImage from "./components/ProjectImage";
import { usePathname, useRouter } from "next/navigation"; // Import these for navigation detection

const projects = [
  {
    id: "1",
    title: "Project One",
    imageUrl: "/project1.webp",
  },
  {
    id: "2",
    title: "Project Two",
    imageUrl: "/project2.webp",
  },
  {
    id: "3",
    title: "Project Three",
    imageUrl: "/project3.webp",
  },

  // ... more projects
];

export default function Home() {
  const tlRef = useRef(null);
  const animationCompletedRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();

  // Function to run the animation sequence
  const runAnimation = () => {
    // Clear any previous animations
    if (tlRef.current) {
      tlRef.current.kill();
    }

    // Create a new timeline
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

    // IMPORTANT: Get direct reference to the video element for more reliable animation
    const videoElement = document.querySelector("video.video");

    // Temporarily disable the parallax transform during animation
    const videoParent = document.querySelector(".video").parentElement;
    const originalTransform = videoParent.style.transform;
    videoParent.style.transform = "none";

    // Run the animation sequence
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

  // Also, modify your parallax effect to avoid interference:
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

  // Run animation on initial mount
  useEffect(() => {
    runAnimation();

    // Reset the animation flag when component unmounts
    return () => {
      animationCompletedRef.current = false;
    };
  }, []);

  // Listen for popstate events (browser back/forward)
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

  // Add visibility check
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

  const [scrollPosition, setScrollPosition] = useState(0);

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
          <h1 className="font-anton text-white text-2xl">MURSEE&nbsp;FILMS</h1>
        </div>

        <div className="menu text-white px-2 text-lg py-1 rounded-md">
          <Link href="/about">
            <Menu className="w-8 h-8" />
          </Link>
        </div>
      </nav>

      <div
        className={`cover w-full h-full bg-[#1c1c1c] fixed top-0 left-0 z-50 flex items-center justify-center transition-opacity duration-500`}
      >
        <div className="h-20 w-44 overflow-hidden">
          <h2 className="cover-title text-white text-2xl font-anton opacity-0">
            MURSEE&nbsp;FILMS
          </h2>
        </div>
      </div>

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
          <div className="z-10 flex relative items-center md:items-end justify-center min-h-screen w-full text-white mt-[7vw] flex-row">
            <h1 className="header-title z-[2000] font-anton mix-blend-difference text-[14vw] md:text-[18vw] leading-none font-bold">
              {headerTitle}
            </h1>
          </div>
        </div>
      </section>

      <section className={`px-5 md:px-10 transition-opacity duration-500`}>
        <div className="w-full h-full bg-[#1c1c1c]">
          <div className="flex flex-col md:flex-row w-full justify-between gap-6 text-white pb-24">
            <p className="md:max-w-xl w-full text-4xl md:text-[3vw] leading-tight font-anton uppercase">
              Wij zijn een creatieve studio gespecialiseerd in filmproductie
            </p>
            <div className="max-w-xl flex flex-col gap-4 self-end text-lg">
              Wij geloven dat verwondering alleen kan worden opgeroepen als je
              het eerst zelf hebt ervaren.
              <a className="text-white text-xl group uppercase flex flex-row gap-6 items-center cursor-pointer">
                <span className="font-medium">Over ons</span>
                <MoveUpRight className="w-8 h-8 group-hover:bg-orange-600 rounded-md bg-gray-400 p-1 transition-all duration-300" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`w-full px-5 md:px-10 bg-[#1c1c1c] pt-16 pb-24 transition-opacity duration-500`}
      >
        <Showreel />
      </section>

      <section className=" w-full px-5 md:px-10 bg-[#1c1c1c] pt-16 pb-24">
        <div
          className={`flex flex-row items-center justify-between transition-opacity duration-500`}
        >
          <h1 className="text-white text-[4vw] font-anton uppercase leading-none">
            Projecten
          </h1>

          <p className="font-medium self-end text-white text-xl">
            Van evenementen tot commercials
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 bg-[#1c1c1c] text-white">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <ProjectImage project={project} />
            </div>
          ))}
        </div>
      </section>

      <section className="w-full px-5 md:px-10 bg-[#1c1c1c] pt-16 pb-24">
        <h1 className="text-white text-[4vw] font-anton uppercase leading-none mb-16">
          Onze aanpak
        </h1>
        <div className="flex flex-row gap-6 border-t border-white pt-4 pb-16">
          <p className="text-white text-xl w-1/2">Pre production</p>
          <p className="text-white text-xl w-1/2">
            We don’t do volume. We partner with only five clients a year,
            focusing our expertise on their success. Every detail is crafted,
            every decision strategic, and every outcome transformative. We build
            brands that set new benchmarks.
          </p>
        </div>
        <div className="flex flex-row gap-6 border-t border-white pt-4 pb-16">
          <p className="text-white text-xl w-1/2">Production</p>
          <p className="text-white text-xl w-1/2">
            We don’t do volume. We partner with only five clients a year,
            focusing our expertise on their success. Every detail is crafted,
            every decision strategic, and every outcome transformative. We build
            brands that set new benchmarks.
          </p>
        </div>
        <div className="flex flex-row gap-6 border-t border-white pt-4">
          <p className="text-white text-xl w-1/2">Post production</p>
          <p className="text-white text-xl w-1/2">
            We don’t do volume. We partner with only five clients a year,
            focusing our expertise on their success. Every detail is crafted,
            every decision strategic, and every outcome transformative. We build
            brands that set new benchmarks.
          </p>
        </div>
      </section>

      <section
        className={`w-full bg-[#1c1c1c] h-[300vh] transition-opacity duration-500`}
      ></section>
    </main>
  );
}
