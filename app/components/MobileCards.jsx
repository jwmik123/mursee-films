"use client";

import React from "react";

const MobileCards = () => {
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

  return (
    <section className="mobile-cards px-5 py-16 bg-black">
      {/* Background text */}
      <div className="background-text relative flex flex-col justify-between text-white uppercase font-franklin font-bold text-[13vw] pointer-events-none">
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

      {/* Cards container */}
      <div className="relative z-10 space-y-6">
        {cardData.map((card) => (
          <div
            key={card.id}
            className=" w-full aspect-square border-2 border-white/20 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              <div className="w-full h-full p-5 bg-[#1A1A1A] flex flex-col justify-end space-y-2">
                <h3 className="text-white text-2xl font-franklin font-bold uppercase leading-none">
                  {card.tag}
                </h3>
                <p className="text-white text-lg">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MobileCards;
