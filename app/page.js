"use client";
import Image from "next/image";
import { useEffect } from "react";
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

  return (
    <main className="bg-[#1c1c1c]">
      <nav className="absolute top-12 left-12 z-20">
        <div className="flex">
          <h1 className="font-anton text-white text-2xl ">MURSEE&nbsp;FILMS</h1>
        </div>
      </nav>

      <div className="cover w-full h-full bg-[#1c1c1c] absolute top-0 left-0 z-50 flex items-center justify-center">
        <div className="h-20 w-44 overflow-hidden">
          <h2 className="cover-title text-white text-2xl font-anton opacity-0">
            MURSEE&nbsp;FILMS
          </h2>
        </div>
      </div>

      <section className="hero-section w-full p-4">
        <div className="overflow-hidden w-full relative rounded-lg min-h-[120vh] object-cover block">
          <div className="z-10 w-full h-full absolute inset-0">
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
            <h1 className="font-anton text-white text-[18vw] font-bold -indent-[5px]">
              MURSEE&nbsp;FILMS
            </h1>
          </div>
        </div>
      </section>

      <section>
        <div className="w-full h-full bg-[#1c1c1c]">
          <div className="flex flex-col items-end justify-center text-white">
            <p className="max-w-2xl text-4xl font-anton">
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
