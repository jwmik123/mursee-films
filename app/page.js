"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { MoveUpRight } from "lucide-react";
import Showreel from "./components/Showreel";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
const projects = [
  {
    id: "1",
    title: "Project One",
    image: "/yasmeen.webp",
  },
  {
    id: "2",
    title: "Project Two",
    image: "/mursee-header.jpg",
  },

  // ... more projects
];

export default function Home() {
  const tlRef = useRef(null);

  const router = useRouter();
  const [selectedId, setSelectedId] = useState(null);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    tlRef.current = gsap.timeline();

    tlRef.current
      .fromTo(
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

  const variants = {
    initial: {
      position: "relative",
      zIndex: 1,
      opacity: 1,
    },
    selected: {
      position: "fixed",
      width: "524px",
      zIndex: 50,
      transition: {
        duration: 1.2,
        ease: [0.6, 0.01, 0, 0.9],
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const handleClick = (id) => {
    setSelectedId(id);
    setHide(true);
    setTimeout(() => {
      router.push(`/project/${id}`);
    }, 1000);
  };

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
    <main>
      <nav className="z-20 absolute w-full p-10 flex flex-row justify-between items-center transition-opacity duration-500">
        <div className="flex">
          <h1 className="font-anton text-white text-2xl">MURSEE&nbsp;FILMS</h1>
        </div>

        <div className="menu text-black bg-white px-2 text-lg py-1 rounded-md">
          <Link href="/about">Over ons</Link>
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
          <div className="z-10 flex relative items-center md:items-end justify-center min-h-screen w-full text-white mt-[7vw] flex-row">
            <h1 className="header-title z-[2000] font-anton text-white text-[14vw] md:text-[18vw] font-bold">
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

      <section className="w-full px-5 md:px-10 bg-[#1c1c1c] pt-16 pb-24">
        <div
          className={`flex flex-row items-center justify-between transition-opacity duration-500 ${
            hide ? "opacity-0" : "opacity-100"
          }`}
        >
          <h1 className="text-white text-[4vw] font-anton uppercase leading-none">
            Projecten
          </h1>

          <p className="font-medium self-end text-white text-xl">
            Van evenementen tot commercials
          </p>
        </div>
        <AnimatePresence initial={false} mode="wait">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 bg-[#1c1c1c] text-white w-full relative">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                layoutId={`project-${project.id}`}
                onClick={() => handleClick(project.id)}
                className="w-full aspect-video z-50 cursor-pointer relative"
                variants={variants}
                initial="initial"
                animate={
                  selectedId === project.id
                    ? "selected"
                    : selectedId
                    ? "hidden"
                    : "initial"
                }
                style={{
                  top: selectedId === project.id ? "50%" : "auto",
                  left: selectedId === project.id ? "50%" : "auto",
                  transform:
                    selectedId === project.id
                      ? "translate(-50%, -50%)"
                      : "none",
                }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </section>

      <section className="w-full px-5 md:px-10 bg-[#1c1c1c] pt-16 pb-24">
        <h1 className="text-white text-[4vw] font-anton uppercase leading-none mb-16">
          Onze aanpak.
        </h1>
        <div className="flex flex-row gap-6 border-t border-white pt-4 pb-16">
          <p className="text-white text-xl w-1/2">
            A simple philosophy: <br /> quality over quantity.
          </p>
          <p className="text-white text-xl w-1/2">
            We don’t do volume. We partner with only five clients a year,
            focusing our expertise on their success. Every detail is crafted,
            every decision strategic, and every outcome transformative. We build
            brands that set new benchmarks.
          </p>
        </div>
        <div className="flex flex-row gap-6 border-t border-white pt-4">
          <p className="text-white text-xl w-1/2">
            A simple philosophy: <br /> quality over quantity.
          </p>
          <p className="text-white text-xl w-1/2">
            We don’t do volume. We partner with only five clients a year,
            focusing our expertise on their success. Every detail is crafted,
            every decision strategic, and every outcome transformative. We build
            brands that set new benchmarks.
          </p>
        </div>
      </section>

      <section
        className={`w-full bg-[#1c1c1c] h-[300vh] transition-opacity duration-500 ${
          hide ? "opacity-0" : "opacity-100"
        }`}
      ></section>
    </main>
  );
}
