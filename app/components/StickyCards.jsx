"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import Image from "next/image";

const StickyCards = () => {
  const cardData = [
    {
      id: 1,
      tag: "Commercials",
      description:
        "Korte reclamevideo's die een product of dienst helder in beeld brengen, geschikt voor online en tv-campagnes.",
      src: "/images/commercials.webp",
      alt: "commercials",
    },
    {
      id: 2,
      tag: "Bedrijfsfilms",
      description:
        "Een duidelijke video over wie jullie zijn, wat jullie doen en waar jullie voor staan – handig voor klanten, nieuwe medewerkers of investeerders.",
      src: "/images/bedrijfsfilms.jpeg",
      alt: "bedrijfsfilms",
    },
    {
      id: 3,
      tag: "Social Video's",
      description:
        "Bewegend beeld voor op social media, afgestemd op snelle communicatie met je doelgroep, bijvoorbeeld bij een actie of aankondiging.",
      src: "/images/socials.webp",
      alt: "socials",
    },
  ];

  const container = useRef(null);
  const bgtextRef = useRef(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger, Flip);

      const cards = document.querySelectorAll(".card");
      const images = document.querySelectorAll(".card img");
      const totalCards = cards.length;

      gsap.set(cards[0], { y: "0%", scale: 1, rotation: 0 });
      gsap.set(images[0], { scale: 1 });

      for (let i = 1; i < totalCards; i++) {
        gsap.set(cards[i], { y: "100%", scale: 1, rotation: 0 });
        gsap.set(images[i], { scale: 1 });
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: `+=${(typeof window !== "undefined" ? window.innerHeight : 800) * (totalCards + 2)}`,
          pin: true,
          scrub: 1,
        },
      });

      // Set initial states
      gsap.set(".cards-container", { y: "100vh" });
      gsap.set(".background-text div", {
        overflow: "hidden",
      });
      gsap.set(".background-text span", {
        y: "100%",
        rotate: 5,
        display: "block",
        filter: "blur(10px)",
      });

      // Background text animation when hitting middle of screen
      gsap.to(".background-text span", {
        y: "0",
        filter: "blur(0px)",
        rotate: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: bgtextRef.current,
          start: "top 50%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      });

      // Initial animation to move container from bottom to higher position
      scrollTimeline.to(
        ".cards-container",
        {
          y: "5vh",
          duration: 2,
          ease: "none",
        },
        -0.5
      );

      for (let i = 0; i < totalCards - 1; i++) {
        const currentCard = cards[i];
        const currentImage = images[i];
        const nextCard = cards[i + 1];
        const position = (i + 1) * 2; // Increased spacing between transitions

        scrollTimeline.to(
          currentCard,
          {
            scale: 0.8,
            rotation: 3,
            duration: 2,
            ease: "none",
          },
          position
        );

        scrollTimeline.to(
          nextCard,
          {
            y: "0%",
            scale: 1,
            duration: 2,
            ease: "none",
          },
          position
        );
      }

      // Add spread animation at the end of the timeline
      scrollTimeline.to(
        ".cards-container",
        {
          y: "80vh",
          duration: 2,
          ease: "none",
        },
        totalCards * 2
      );

      cards.forEach((card, index) => {
        const spread = (index - (totalCards - 1) / 2) * 65;
        scrollTimeline.to(
          card,
          {
            x: `${spread}%`,
            scale: 0.6,
            rotation: 0,
            duration: 2,
            ease: "none",
          },
          totalCards * 2
        );
      });

      return () => {
        scrollTimeline.kill();
        ScrollTrigger.getAll().forEach((trigger) => {
          trigger.kill();
        });
      };
    },
    { scope: container }
  );

  return (
    <>
      <section
        ref={container}
        className={`sticky-cards px-5 md:px-10 py-16 bg-black relative h-screen overflow-visible flex items-center justify-center`}
      >
        <div className="cards-container relative w-1/2 aspect-square ">
          {cardData.map((card) => (
            <div
              className="card absolute w-full aspect-square overflow-hidden border-2 border-white/20 rounded-md"
              key={card.id}
            >
              <div className="flex flex-col h-full">
                <div className="w-full h-1/2">
                  <Image
                    src={card.src}
                    alt={card.alt}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full flex-1 p-5 bg-[#1A1A1A] md:p-10 flex flex-col justify-end space-y-2 md:space-y-6">
                  <h3 className="text-white text-2xl md:text-7xl font-franklin font-bold uppercase leading-none">
                    {card.tag}
                  </h3>
                  <p className="text-white text-2xl">{card.description}</p>
                  {/* <p className="text-white tracking-tight text-xl md:text-7xl font-franklin leading-none absolute left-10 top-4">
                    {card.id}
                  </p> */}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          ref={bgtextRef}
          className="background-text -z-10 absolute top-10 bottom-10 left-10 right-10 flex flex-col justify-between text-white uppercase font-franklin font-bold text-[13vw]"
        >
          <div className="overflow-hidden">
            <span className="self-start">Wat Mursee</span>
          </div>
          <div className="overflow-hidden flex justify-end">
            <span>jouw bedrijf</span>
          </div>
          <div className="overflow-hidden">
            <span className="self-start">kan Bieden(3)</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default StickyCards;
