"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "react-responsive";
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
      src: "/images/bedrijfsfilms.webp",
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

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

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
          end: `+=${window.innerHeight * totalCards}`,
          pin: true,
          scrub: true,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentCard = cards[i];
        const currentImage = images[i];
        const nextCard = cards[i + 1];
        const position = i;

        scrollTimeline.to(
          currentCard,
          {
            scale: 0.8,
            rotation: 3,
            duration: 1,
            ease: "none",
          },
          position
        );

        scrollTimeline.to(
          currentImage,
          {
            scale: 1.5,
            duration: 1,
            ease: "none",
          },
          position
        );

        scrollTimeline.to(
          nextCard,
          {
            y: "0%",
            scale: 1,
            duration: 1,
            ease: "none",
          },
          position
        );
      }
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
    <section
      ref={container}
      className={`sticky-cards px-5 md:px-10 py-16 bg-black relative h-screen overflow-hidden flex items-center justify-center`}
    >
      <div className="cards-container relative w-full md:w-2/3 aspect-square md:aspect-video overflow-hidden">
        {cardData.map((card) => (
          <div
            className="card absolute w-full aspect-square md:aspect-video overflow-hidden"
            key={card.id}
          >
            <div className="flex flex-col md:flex-row h-full">
              <div className="w-full h-1/2 md:h-auto md:w-2/3 p-5 bg-white md:p-10 flex flex-col justify-center space-y-2 md:space-y-6">
                <h3 className="text-black text-2xl md:text-5xl font-franklin font-bold uppercase leading-none">
                  {card.tag}
                </h3>
                <p className="text-black/80 tracking-tight text-xl md:text-2xl font-tinos leading-none">
                  {card.description}
                </p>
              </div>
              <div className="w-full md:w-1/2 h-full overflow-hidden">
                <Image
                  src={card.src}
                  alt={card.alt}
                  className="w-full h-full object-cover"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <span className="hidden md:block absolute w-10 h-10 border-t-2 border-l-2 border-white top-48 left-48 group-hover:-top-1 group-hover:-left-1 transition-all duration-300"></span>
      <span className="hidden md:block absolute w-10 h-10 border-t-2 border-r-2 border-white top-48 right-48 group-hover:-top-1 group-hover:-right-1 transition-all duration-300"></span>
      <span className="hidden md:block absolute w-10 h-10 border-b-2 border-l-2 border-white bottom-48 left-48 group-hover:-bottom-1 group-hover:-left-1 transition-all duration-300"></span>
      <span className="hidden md:block absolute w-10 h-10 border-b-2 border-r-2 border-white bottom-48 right-48 group-hover:-bottom-1 group-hover:-right-1 transition-all duration-300"></span> */}
    </section>
  );
};

export default StickyCards;
