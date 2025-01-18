"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { MoveUpRight } from "lucide-react";
import ServiceCard from "./components/ServiceCard";
import Showreel from "./components/Showreel";

export default function Home() {
  const commercialsRef = useRef(null);
  const companyFilmsRef = useRef(null);
  const socialVideosRef = useRef(null);

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

        <div className="menu text-black bg-white px-2 text-lg py-1 rounded-md">
          menu
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
        <div className="overflow-hidden w-full relative rounded-lg md:min-h-[120vh] object-cover block">
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
          <div className="z-10 flex relative items-center md:items-end justify-center min-h-[100vh] w-full text-white mt-[7vw] flex-row">
            <h1 className="header-title z-[2000] font-anton text-white text-[14vw] md:text-[18vw] font-bold -indent-[1px] lg:-indent-[2px] md:-indent-[3px]">
              {headerTitle}
            </h1>
          </div>
        </div>
      </section>

      <section className="px-5 md:px-10">
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

      <section className="w-full bg-[#1c1c1c] pb-24">
        <Showreel />
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-[#1c1c1c] text-white">
          <ServiceCard
            title="Commercials"
            description="Commercials die uw merk laten opvallen en uw boodschap krachtig overbrengen."
            image="/commercial.webp"
            textRef={commercialsRef}
          />

          <ServiceCard
            title="Bedrijfsfilms"
            description="Professionele bedrijfsfilms die uw organisatie en waarden authentiek in beeld brengen."
            image="/commercial.webp"
            textRef={companyFilmsRef}
          />

          <ServiceCard
            title="Social Videos"
            description="Engaging content die uw social media aanwezigheid versterkt en conversie stimuleert."
            image="/commercial.webp"
            textRef={socialVideosRef}
          />
        </div>
      </section>

      <section className="w-full bg-[#1c1c1c] h-[300vh]"></section>
    </main>
  );
}
