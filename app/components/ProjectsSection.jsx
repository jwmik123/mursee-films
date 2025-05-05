"use client";

import React, { useRef, useEffect, useState } from "react";
import ProjectImage from "./ProjectImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useMediaQuery } from "react-responsive";

import "swiper/css";
// import "swiper/css/navigation";
import { useGSAP } from "@gsap/react";

const ProjectsSection = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const titleRef = useRef(null);
  const splitTextRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await fetch("/api/films");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Debug the response
        console.log("Films response:", data);

        // Ensure data is an array
        if (!Array.isArray(data)) {
          console.error("Received non-array data:", data);
          setFilms([]);
          setError("Invalid data format received");
          return;
        }

        setFilms(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching films:", error);
        setError(error.message);
        setFilms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  useGSAP(() => {
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
      className="text-white relative group px-3 py-2 inline-block w-full md:w-auto text-center"
    >
      <span className="font-tinos text-lg relative z-10">Alle projecten</span>
      <span className="absolute w-2 h-2 border-t border-l border-white top-0 left-0 group-hover:-top-1 group-hover:-left-1 transition-all duration-300"></span>
      <span className="absolute w-2 h-2 border-t border-r border-white top-0 right-0 group-hover:-top-1 group-hover:-right-1 transition-all duration-300"></span>
      <span className="absolute w-2 h-2 border-b border-l border-white bottom-0 left-0 group-hover:-bottom-1 group-hover:-left-1 transition-all duration-300"></span>
      <span className="absolute w-2 h-2 border-b border-r border-white bottom-0 right-0 group-hover:-bottom-1 group-hover:-right-1 transition-all duration-300"></span>
    </a>
  );

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-white">Error: {error}</div>;
  }

  if (!films || films.length === 0) {
    return <div className="text-white">No films found</div>;
  }

  return (
    <>
      <div
        className={`flex flex-row items-center justify-between transition-opacity duration-500`}
      >
        <div>
          <h2
            ref={titleRef}
            className="text-white text-6xl md:text-7xl font-franklin uppercase"
          >
            Laatste werk
          </h2>
          <p className="font-tinos self-end text-white text-xl mt-2">
            Van evenementen tot commercials
          </p>
        </div>
        {!isMobile && (
          <div>
            <AlleProjectenButton />
          </div>
        )}
      </div>
      <div className="mt-12 bg-black text-white">
        {isMobile ? (
          <div className="flex flex-col space-y-6">
            {films.map((film) => (
              <div key={film._id}>
                <a href={`/project/${film._id}`} className="project-card block">
                  <ProjectImage
                    project={{
                      id: film._id,
                      title: film.title,
                      imageUrl: film.imageUrl,
                      videoUrl: film.videoUrl,
                    }}
                  />
                </a>
                <div className="mt-2 flex items-center justify-between">
                  <h3 className="text-white text-sm uppercase font-franklin">
                    {film.title}
                  </h3>
                  <p className="text-white text-xs uppercase font-tinos tracking-tighter">
                    {film.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
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
                  slidesPerView: 2,
                },
              }}
              className="projects-swiper"
            >
              {films.map((film) => (
                <SwiperSlide key={film._id}>
                  <a
                    href={`/project/${film._id}`}
                    className="project-card block"
                  >
                    <ProjectImage
                      project={{
                        id: film._id,
                        title: film.title,
                        imageUrl: film.imageUrl,
                        videoUrl: film.videoUrl,
                      }}
                    />
                  </a>
                  <div className="px-2 py-1 flex items-center justify-between bg-white">
                    <h3 className="text-black text-sm md:text-md uppercase font-franklin">
                      {film.title}
                    </h3>
                    <p className="text-black text-xs md:text-sm uppercase font-tinos tracking-tighter">
                      {film.category}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="flex flex-row space-x-8 justify-end mt-4 cursor-pointer">
              <div className="swiper-button-prev text-white flex items-center justify-center rotate-180">
                <svg
                  width="48"
                  height="48"
                  xmlns="http://www.w3.org/2000/svg"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  className=" fill-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
                </svg>
              </div>
              <div className="swiper-button-next text-white flex items-center justify-center">
                <svg
                  width="48"
                  height="48"
                  xmlns="http://www.w3.org/2000/svg"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  className=" fill-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
                </svg>
              </div>
            </div>
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
