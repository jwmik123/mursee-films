"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useMediaQuery } from "react-responsive";

const ApproachSection = () => {
  const titleRef = useRef(null);
  const splitTextRef = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useGSAP(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Use SplitText to split the title text into characters
    if (titleRef.current && !splitTextRef.current) {
      // Add CSS style for title-text-char class
      const style = document.createElement("style");
      style.textContent = `
        .title-text-char {
          display: inline-block;
          margin-right: 0.02em;
        }
        .border-section {
          position: relative;
          --border-width: 0%;
        }
        .border-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 1px;
          width: var(--border-width);
          background-color: white;
          transform-origin: left;
        }
      `;
      document.head.appendChild(style);

      splitTextRef.current = new SplitText(titleRef.current, {
        type: "chars",
        charsClass: "title-text-char",
      });

      // Set initial styles
      gsap.set(splitTextRef.current.chars, {
        x: 5,
        opacity: 0,
        filter: "blur(8px)",
      });

      // Create staggered animation on scroll
      gsap.to(splitTextRef.current.chars, {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.02,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: isMobile ? "top 90%" : "top 90%",
          end: isMobile ? "top 10%" : "top -10%",
          scrub: isMobile ? 1 : 0.8,
          markers: false,
        },
      });

      // Animate borders
      [section1Ref, section2Ref, section3Ref].forEach((ref) => {
        if (ref.current) {
          gsap.fromTo(
            ref.current,
            { "--border-width": "0%" },
            {
              "--border-width": "100%",
              duration: 3,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ref.current,
                start: "top 75%",
                end: "top 65%",
                scrub: 3,
                markers: false,
              },
            }
          );
        }
      });
    }

    return () => {
      // Clean up any split text instances
      if (splitTextRef.current) {
        splitTextRef.current.revert();
      }
    };
  }, [isMobile]);

  return (
    <section className="w-full px-5 md:px-10 bg-black pt-16 pb-24 font-tinos">
      <h2
        ref={titleRef}
        className="text-white text-6xl md:text-7xl font-franklin uppercase"
      >
        Onze aanpak
      </h2>
      <div
        ref={section1Ref}
        className="border-section flex flex-row gap-6 pt-4 pb-16 mt-16"
      >
        <p className="text-white text-xl w-1/2">Pre production</p>
        <p className="text-white text-xl w-1/2">
          In de pre-productie denken we samen na over het verhaal dat u wilt
          vertellen. We helpen bij het uitwerken van het concept, het schrijven
          van het script, het plannen van de draaidag(en) en het regelen van de
          juiste locatie(s), acteurs en apparatuur. Dit is de fase waarin uw
          idee vorm krijgt en waarin we zorgen dat alles tot in de puntjes
          voorbereid is.
        </p>
      </div>
      <div
        ref={section2Ref}
        className="border-section flex flex-row gap-6 pt-4 pb-16"
      >
        <p className="text-white text-xl w-1/2">Production</p>
        <p className="text-white text-xl w-1/2">
          Tijdens de productie brengen we het plan tot leven. Met professionele
          camera’s, belichting en een ervaren crew zorgen we voor de opnames van
          uw video. Of het nu gaat om een commercial, bedrijfsfilm of social
          media content – we zorgen voor de juiste sfeer, beelden en kwaliteit
          die passen bij uw merk.
        </p>
      </div>
      <div
        ref={section3Ref}
        className="border-section flex flex-row gap-6 pt-4"
      >
        <p className="text-white text-xl w-1/2">Post production</p>
        <p className="text-white text-xl w-1/2">
          Na het filmen gaan we aan de slag met de montage, kleurcorrectie,
          geluidsbewerking en eventuele animaties of ondertitels. Dit is waar
          alles samenkomt tot een pakkend eindresultaat. U krijgt een eerste
          versie te zien en op basis van uw feedback maken we de video helemaal
          af naar wens.
        </p>
      </div>
    </section>
  );
};

export default ApproachSection;
