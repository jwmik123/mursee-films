"use client";

import React, { useEffect, useRef, useState } from "react";
import ProjectImage from "./ProjectImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useMediaQuery } from "react-responsive";

import "swiper/css";
import "swiper/css/navigation";

const ProjectsSection = ({ projects }) => {
  const titleRef = useRef(null);
  const splitTextRef = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Use SplitText to split the title text into words
    if (titleRef.current && !splitTextRef.current) {
      // Add CSS style for title-text-word class
      const style = document.createElement("style");
      style.textContent = `
        .title-text-word {
          display: inline-block;
          margin-right: 0.3em;
        }
      `;
      document.head.appendChild(style);

      splitTextRef.current = new SplitText(titleRef.current, {
        type: "chars",
        wordsClass: "title-text-word",
      });

      // Set initial styles
      gsap.set(splitTextRef.current.chars, {
        y: 50,
        opacity: 0,
        filter: "blur(8px)",
      });

      // Create staggered animation on scroll
      gsap.to(splitTextRef.current.chars, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.03,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 90%",
          end: "top -10%",
          scrub: 0.8,
          markers: false,
        },
      });
    }

    return () => {
      // Clean up any split text instances
      if (splitTextRef.current) {
        splitTextRef.current.revert();
      }
    };
  }, []);

  // Button component for "Alle projecten"
  const AlleProjectenButton = () => (
    <a
      href="/projects"
      className="text-white relative group px-3 py-2 inline-block"
    >
      <span className="font-tinos text-lg relative z-10">Alle projecten</span>
      <span className="absolute w-2 h-2 border-t border-l border-white top-0 left-0 group-hover:-top-1 group-hover:-left-1 transition-all duration-300"></span>
      <span className="absolute w-2 h-2 border-t border-r border-white top-0 right-0 group-hover:-top-1 group-hover:-right-1 transition-all duration-300"></span>
      <span className="absolute w-2 h-2 border-b border-l border-white bottom-0 left-0 group-hover:-bottom-1 group-hover:-left-1 transition-all duration-300"></span>
      <span className="absolute w-2 h-2 border-b border-r border-white bottom-0 right-0 group-hover:-bottom-1 group-hover:-right-1 transition-all duration-300"></span>
    </a>
  );

  return (
    <>
      <div
        className={`flex flex-row items-center justify-between transition-opacity duration-500`}
      >
        <div>
          <h2
            ref={titleRef}
            className="text-white text-[6vw] md:text-7xl leading-none font-franklin uppercase"
          >
            Laatste werk
          </h2>
          <p className="font-tinos self-end text-white text-xl mt-2">
            Van evenementen tot commercials
          </p>
        </div>
        {!isMobile && (
          <div className="self-end">
            <AlleProjectenButton />
          </div>
        )}
      </div>
      <div className="mt-12 bg-black text-white">
        {isMobile ? (
          <div className="flex flex-col space-y-6">
            {projects.map((project) => (
              <a
                key={project.id}
                href={`/project/${project.id}`}
                className="project-card block"
              >
                <ProjectImage project={project} />
              </a>
            ))}
          </div>
        ) : (
          <div className="cursor-grab">
            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={1}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="projects-swiper"
            >
              {projects.map((project) => (
                <SwiperSlide key={project.id}>
                  <a
                    href={`/project/${project.id}`}
                    className="project-card block"
                  >
                    <ProjectImage project={project} />
                  </a>
                </SwiperSlide>
              ))}
              {/* <div className="swiper-button-next !text-white after:!text-white"></div>
              <div className="swiper-button-prev !text-white after:!text-white"></div> */}
            </Swiper>
          </div>
        )}
      </div>
      {isMobile && (
        <div className="mt-8 flex justify-center">
          <AlleProjectenButton />
        </div>
      )}
    </>
  );
};

export default ProjectsSection;
