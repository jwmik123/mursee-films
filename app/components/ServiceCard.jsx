"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
const ServiceCard = ({ title, description, image, textRef }) => {
  const [isHovered, setIsHovered] = useState(false);
  const textContainer = useRef(null);

  useEffect(() => {
    gsap.to(textRef.current, {
      opacity: isHovered ? 1 : 0,
      y: isHovered ? 0 : 10,
      duration: 0.5,
      ease: "power4.out",
    });
    gsap.to(textContainer.current, {
      y: isHovered ? "0%" : "10%",
      duration: 0.5,
      ease: "power4.out",
    });
  }, [isHovered]);

  return (
    <div
      className="relative group overflow-hidden  aspect-[3/4]"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        priority
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/50 transition-opacity duration-500 group-hover:opacity-70" />
      <div
        ref={textContainer}
        className="absolute inset-0 p-8 flex flex-col justify-end will-change-transform translate-y-[10%]"
      >
        <h3 className="font-anton text-3xl mb-4">{title}</h3>
        <p ref={textRef} className="text-sm opacity-0">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
