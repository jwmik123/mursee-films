"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

const Clients = () => {
  const titleRef = useRef(null);
  const logosRef = useRef(null);

  // Sample client logos - replace with your actual client logos
  const clients = [
    { id: 1, name: "Client 1", logo: "/logos/client1.png" },
    { id: 2, name: "Client 2", logo: "/logos/client2.png" },
    { id: 3, name: "Client 3", logo: "/logos/client3.png" },
    { id: 4, name: "Client 4", logo: "/logos/client4.png" },
    { id: 5, name: "Client 5", logo: "/logos/client5.png" },
    { id: 6, name: "Client 6", logo: "/logos/client6.png" },
  ];

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate title
    gsap.fromTo(
      titleRef.current,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          end: "top 60%",
          scrub: 1,
        },
      }
    );

    // Animate logos
    const logoElements = logosRef.current.children;
    gsap.fromTo(
      logoElements,
      {
        opacity: 0,
        y: 30,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: logosRef.current,
          start: "top 75%",
          end: "top 50%",
          scrub: 1,
        },
      }
    );
  }, []);

  return (
    <section className="w-full px-5 md:px-10 bg-black py-24">
      <h2
        ref={titleRef}
        className="text-white text-6xl md:text-7xl font-franklin uppercase mb-16"
      >
        Onze Klanten
      </h2>
      <div
        ref={logosRef}
        className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12"
      >
        {clients.map((client) => (
          <div
            key={client.id}
            className="flex items-center justify-center p-8 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300"
          >
            <div className="relative w-full h-24">
              <Image
                src={client.logo}
                alt={client.name}
                fill
                className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Clients;
