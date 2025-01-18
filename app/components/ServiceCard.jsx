"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import Image from "next/image";

const ServiceCard = ({ title, description, image, textRef }) => {
  const [isHovered, setIsHovered] = useState(false);
  const textContainer = useRef(null);
  const imageRef = useRef(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  // Debounced scroll handler using useCallback
  const handleScroll = useCallback(() => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const scrollProgress =
      (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const parallaxAmount = Math.min(Math.max(scrollProgress * 40, -40), 40); // Limit parallax range

    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      setParallaxOffset(parallaxAmount);
    });
  }, []);

  useEffect(() => {
    // Text animation
    gsap.to(textRef.current, {
      opacity: isHovered ? 1 : 0,
      y: isHovered ? 0 : 10,
      duration: 0.5,
      ease: "power4.out",
    });

    gsap.to(textContainer.current, {
      y: isHovered ? "0%" : "15%",
      duration: 0.5,
      ease: "power4.out",
    });
  }, [isHovered]);

  useEffect(() => {
    // Add scroll listener with passive option for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div
      className="relative group overflow-hidden aspect-[4/3] will-change-transform"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <div
        ref={imageRef}
        className="absolute inset-0 transform-gpu h-[120%] -top-[10%]"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          transition: "transform 0.1s linear",
        }}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-black/50 transition-opacity duration-500 group-hover:opacity-70" />
      <div
        ref={textContainer}
        className="absolute inset-0 p-8 flex flex-col justify-end will-change-transform translate-y-[15%]"
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
