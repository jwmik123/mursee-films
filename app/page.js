"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import gsap from "gsap";

export default function Home() {
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      ".cover-title",
      {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
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
        { y: "0%" },
        { y: "-100%", duration: 1, ease: "power4.out" },
        "+=0.5"
      )
      .from(".hero-section", {
        padding: 0,
        duration: 1.2,
        ease: "power4.out",
      })
      .from(".header-title-char", {
        y: 100,
        duration: 1,
        ease: "power4.out",
        stagger: 0.05,
      })
      .from(
        "nav",
        {
          y: -100,
          opacity: 0,
          duration: 1,
          ease: "power4.out",
        },
        "-=0.5"
      );
  }, []);

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
    <span key={i} className="header-title-char inline-block">
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  return (
    <main className="bg-[#1c1c1c]">
      <nav className="z-20 absolute w-full p-10 flex flex-row justify-between items-center">
        <div className="flex">
          <h1 className="font-anton text-white text-2xl">MURSEE&nbsp;FILMS</h1>
        </div>

        <div className="menu">
          <ul className="flex flex-row justify-between items-center space-x-10 bg-white text-black py-2 px-6 rounded-full">
            <li>Home</li>
            <li>Projecten</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className="inquire">
          <button className="font-anton text-white text-xl uppercase px-4 py-2 rounded-full border border-white">
            Contact
          </button>
        </div>
      </nav>

      <div className="cover w-full h-full bg-[#1c1c1c] fixed top-0 left-0 z-50 flex items-center justify-center">
        <div className="h-20 w-44 overflow-hidden">
          <h2 className="cover-title text-white text-2xl font-anton opacity-0">
            MURSEE&nbsp;FILMS
          </h2>
        </div>
      </div>

      <section className="hero-section w-full p-4">
        <div className="overflow-hidden w-full relative rounded-lg min-h-[120vh] object-cover block">
          <div
            className="z-10 w-full h-full absolute inset-0"
            style={{
              transform: `translate3d(0, -${parallaxOffset}px, 0)`,
            }}
          >
            <video
              autoPlay
              muted
              loop
              className="object-cover -z-10 absolute w-full h-full bg-cover opacity-80"
            >
              <source src="/header.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="z-10 flex relative items-end justify-center min-h-[100vh] w-full text-white mt-[7vw] flex-row">
            <h1 className="header-title z-[2000] font-anton text-white text-[16vw] md:text-[18vw] font-bold">
              {headerTitle}
            </h1>
          </div>
        </div>
      </section>

      <section>
        <div className="w-full h-full bg-[#1c1c1c]">
          <div className="flex flex-col items-end justify-center text-white py-24">
            <p className="max-w-6xl text-[3vw] leading-tight font-anton">
              Bij Mursee Films creëren we meeslepende visuele verhalen die
              boeien en inspireren. Onze passie voor storytelling door middel
              van cinematografie drijft ons om onvergetelijke momenten te
              creëren die wereldwijd resoneren met het publiek.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
